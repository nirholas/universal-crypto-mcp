#!/usr/bin/env node
/**
 * Script Registry & Runner
 * 
 * Central registry for all UCM automation scripts.
 * Lists, describes, and runs available scripts.
 * 
 * Usage:
 *   node scripts/index.mjs                    # List all scripts
 *   node scripts/index.mjs run <script>       # Run a script
 *   node scripts/index.mjs info <script>      # Get script info
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================================
// Script Registry
// ============================================================

const SCRIPT_CATEGORIES = {
  'vendor': {
    name: 'Vendor Management',
    description: 'Clone, update, and manage vendor repositories',
    scripts: [
      'clone-vendor-repos.sh',
      'clone-all-agent-repos.sh',
      'clone-additional-repos.sh',
      'restructure-vendor.sh',
      'update-vendor-repos.mjs',
    ],
  },
  'implementation': {
    name: 'Implementation Generation',
    description: 'Generate implementations from vendor code',
    scripts: [
      'complete-implementation.mjs',
      'generate-implementations.sh',
      'extract-vendor-code.sh',
      'implement-from-vendor.ts',
      'deep-implement.ts',
      'run-all-implementations.sh',
    ],
  },
  'analysis': {
    name: 'Code Analysis',
    description: 'Analyze codebase, dependencies, and progress',
    scripts: [
      'analyze-todos.mjs',
      'analyze-dependencies.mjs',
      'analyze-coverage.mjs',
      'audit-licenses.ts',
    ],
  },
  'generation': {
    name: 'Code Generation',
    description: 'Generate tests, docs, and boilerplate',
    scripts: [
      'generate-tests.mjs',
      'generate-mcp-tools.mjs',
      'generate-docs.mjs',
    ],
  },
  'maintenance': {
    name: 'Maintenance',
    description: 'Build, clean, and maintain the project',
    scripts: [
      'add-headers.sh',
      'clean-build.sh',
      'validate-structure.mjs',
    ],
  },
};

// ============================================================
// Helpers
// ============================================================

function getScriptInfo(scriptName) {
  const scriptPath = join(__dirname, scriptName);
  if (!existsSync(scriptPath)) return null;
  
  try {
    const content = readFileSync(scriptPath, 'utf-8');
    const lines = content.split('\n').slice(0, 30);
    
    // Extract description from header comments
    let description = '';
    let usage = '';
    let inDescription = false;
    
    for (const line of lines) {
      if (line.includes('Usage:')) {
        inDescription = false;
        usage = line.replace(/.*Usage:\s*/, '').trim();
      } else if (line.match(/^\s*\*\s+\w/) || line.match(/^#\s+\w/)) {
        const text = line.replace(/^\s*[\*#]\s*/, '').trim();
        if (text && !text.startsWith('@') && !text.startsWith('!')) {
          if (!description) description = text;
        }
      }
    }
    
    const stats = statSync(scriptPath);
    
    return {
      name: scriptName,
      path: scriptPath,
      description: description || 'No description',
      usage: usage || `node/bash scripts/${scriptName}`,
      size: stats.size,
      modified: stats.mtime,
    };
  } catch (e) {
    return null;
  }
}

function listAllScripts() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           UCM Script Registry                              ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  for (const [category, config] of Object.entries(SCRIPT_CATEGORIES)) {
    console.log(`\n📁 ${config.name}`);
    console.log(`   ${config.description}`);
    console.log('   ─────────────────────────────────────────');
    
    for (const script of config.scripts) {
      const info = getScriptInfo(script);
      if (info) {
        console.log(`   📜 ${script}`);
        console.log(`      ${info.description}`);
      } else {
        console.log(`   ⚪ ${script} (not created yet)`);
      }
    }
  }
  
  // Also list any scripts not in registry
  const allScripts = readdirSync(__dirname)
    .filter(f => f.endsWith('.sh') || f.endsWith('.mjs') || f.endsWith('.ts'))
    .filter(f => f !== 'index.mjs');
  
  const registeredScripts = Object.values(SCRIPT_CATEGORIES)
    .flatMap(c => c.scripts);
  
  const unregistered = allScripts.filter(s => !registeredScripts.includes(s));
  
  if (unregistered.length > 0) {
    console.log('\n📁 Other Scripts');
    console.log('   Scripts not yet categorized');
    console.log('   ─────────────────────────────────────────');
    for (const script of unregistered) {
      const info = getScriptInfo(script);
      console.log(`   📜 ${script}`);
      if (info) console.log(`      ${info.description}`);
    }
  }
  
  console.log('\n');
  console.log('Usage:');
  console.log('  node scripts/index.mjs run <script>   Run a script');
  console.log('  node scripts/index.mjs info <script>  Get detailed info');
  console.log('\n');
}

function runScript(scriptName) {
  const scriptPath = join(__dirname, scriptName);
  
  if (!existsSync(scriptPath)) {
    console.error(`❌ Script not found: ${scriptName}`);
    process.exit(1);
  }
  
  const ext = extname(scriptName);
  let command, args;
  
  if (ext === '.sh') {
    command = 'bash';
    args = [scriptPath, ...process.argv.slice(4)];
  } else if (ext === '.mjs') {
    command = 'node';
    args = [scriptPath, ...process.argv.slice(4)];
  } else if (ext === '.ts') {
    command = 'npx';
    args = ['tsx', scriptPath, ...process.argv.slice(4)];
  } else {
    console.error(`❌ Unknown script type: ${ext}`);
    process.exit(1);
  }
  
  console.log(`🚀 Running: ${scriptName}\n`);
  
  const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: dirname(__dirname),
  });
  
  child.on('close', (code) => {
    process.exit(code);
  });
}

function showInfo(scriptName) {
  const info = getScriptInfo(scriptName);
  
  if (!info) {
    console.error(`❌ Script not found: ${scriptName}`);
    process.exit(1);
  }
  
  console.log(`\n📜 ${info.name}`);
  console.log('═'.repeat(50));
  console.log(`Description: ${info.description}`);
  console.log(`Path:        ${info.path}`);
  console.log(`Size:        ${(info.size / 1024).toFixed(1)} KB`);
  console.log(`Modified:    ${info.modified.toISOString()}`);
  console.log(`Usage:       ${info.usage}`);
  console.log('');
}

// ============================================================
// Main
// ============================================================

const [,, action, target] = process.argv;

switch (action) {
  case 'run':
    if (!target) {
      console.error('Usage: node scripts/index.mjs run <script>');
      process.exit(1);
    }
    runScript(target);
    break;
    
  case 'info':
    if (!target) {
      console.error('Usage: node scripts/index.mjs info <script>');
      process.exit(1);
    }
    showInfo(target);
    break;
    
  default:
    listAllScripts();
}
