#!/usr/bin/env node
/**
 * TODO Analyzer
 * 
 * Scans the entire codebase for TODOs, FIXMEs, and implementation gaps.
 * Generates a comprehensive report of what needs to be done.
 * 
 * Usage: node scripts/analyze-todos.mjs [--json] [--by-package] [--by-priority]
 */

import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from 'fs';
import { join, dirname, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = dirname(__dirname);

const args = process.argv.slice(2);
const JSON_OUTPUT = args.includes('--json');
const BY_PACKAGE = args.includes('--by-package');
const BY_PRIORITY = args.includes('--by-priority');

// ============================================================
// TODO Patterns
// ============================================================

const TODO_PATTERNS = [
  { pattern: /\/\/\s*TODO:\s*(.+)/gi, type: 'TODO', priority: 2 },
  { pattern: /\/\/\s*FIXME:\s*(.+)/gi, type: 'FIXME', priority: 1 },
  { pattern: /\/\/\s*HACK:\s*(.+)/gi, type: 'HACK', priority: 3 },
  { pattern: /\/\/\s*XXX:\s*(.+)/gi, type: 'XXX', priority: 2 },
  { pattern: /\/\/\s*BUG:\s*(.+)/gi, type: 'BUG', priority: 1 },
  { pattern: /\/\/\s*OPTIMIZE:\s*(.+)/gi, type: 'OPTIMIZE', priority: 4 },
  { pattern: /\/\/\s*REFACTOR:\s*(.+)/gi, type: 'REFACTOR', priority: 4 },
  { pattern: /throw new Error\(['"]Not implemented/gi, type: 'NOT_IMPLEMENTED', priority: 1 },
];

const IMPLEMENTATION_PATTERNS = [
  { pattern: /throw new Error\(['"](.*not implemented.*)['"]\)/gi, type: 'STUB' },
  { pattern: /\/\/\s*TODO:\s*Implement/gi, type: 'TODO_IMPLEMENT' },
  { pattern: /console\.warn\(['"].*not implemented/gi, type: 'WARN_STUB' },
];

// ============================================================
// File Scanner
// ============================================================

function findFiles(dir, extensions = ['.ts', '.tsx', '.js', '.mjs'], maxDepth = 10) {
  const files = [];
  
  function walk(currentDir, depth) {
    if (depth > maxDepth) return;
    if (!existsSync(currentDir)) return;
    
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip non-source directories
          if (['node_modules', '.git', 'dist', 'build', 'coverage', 'vendor'].includes(entry.name)) {
            continue;
          }
          walk(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = extname(entry.name);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (e) {
      // Skip unreadable directories
    }
  }
  
  walk(dir, 0);
  return files;
}

function analyzeTodos(filePath) {
  const todos = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      for (const { pattern, type, priority } of TODO_PATTERNS) {
        pattern.lastIndex = 0;
        const match = pattern.exec(line);
        if (match) {
          todos.push({
            file: relative(ROOT_DIR, filePath),
            line: index + 1,
            type,
            priority: priority || 2,
            text: match[1]?.trim() || line.trim(),
            package: getPackageName(filePath),
          });
        }
      }
      
      // Check for implementation stubs
      for (const { pattern, type } of IMPLEMENTATION_PATTERNS) {
        pattern.lastIndex = 0;
        if (pattern.test(line)) {
          todos.push({
            file: relative(ROOT_DIR, filePath),
            line: index + 1,
            type,
            priority: 1,
            text: line.trim().slice(0, 100),
            package: getPackageName(filePath),
          });
        }
      }
    });
  } catch (e) {
    // Skip unreadable files
  }
  
  return todos;
}

function getPackageName(filePath) {
  const rel = relative(ROOT_DIR, filePath);
  const parts = rel.split('/');
  
  if (parts[0] === 'packages' && parts.length >= 2) {
    return parts[1];
  }
  if (parts[0] === 'src') {
    return 'core';
  }
  return parts[0];
}

// ============================================================
// Report Generation
// ============================================================

function generateReport(todos) {
  const report = {
    summary: {
      total: todos.length,
      byType: {},
      byPriority: { 1: 0, 2: 0, 3: 0, 4: 0 },
      byPackage: {},
    },
    todos: todos,
    generated: new Date().toISOString(),
  };
  
  for (const todo of todos) {
    // By type
    report.summary.byType[todo.type] = (report.summary.byType[todo.type] || 0) + 1;
    
    // By priority
    report.summary.byPriority[todo.priority]++;
    
    // By package
    report.summary.byPackage[todo.package] = (report.summary.byPackage[todo.package] || 0) + 1;
  }
  
  return report;
}

function printReport(report) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    TODO Analysis Report                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  console.log(`📊 Summary`);
  console.log(`   Total items: ${report.summary.total}`);
  console.log('');
  
  // By Type
  console.log('📋 By Type:');
  const sortedTypes = Object.entries(report.summary.byType)
    .sort((a, b) => b[1] - a[1]);
  for (const [type, count] of sortedTypes) {
    const bar = '█'.repeat(Math.min(count, 50));
    console.log(`   ${type.padEnd(20)} ${String(count).padStart(4)} ${bar}`);
  }
  console.log('');
  
  // By Priority
  console.log('🎯 By Priority:');
  const priorityLabels = { 1: 'Critical', 2: 'High', 3: 'Medium', 4: 'Low' };
  for (const [priority, count] of Object.entries(report.summary.byPriority)) {
    if (count > 0) {
      const label = priorityLabels[priority] || priority;
      const bar = '█'.repeat(Math.min(count, 50));
      console.log(`   ${label.padEnd(20)} ${String(count).padStart(4)} ${bar}`);
    }
  }
  console.log('');
  
  // By Package
  if (BY_PACKAGE) {
    console.log('📦 By Package:');
    const sortedPackages = Object.entries(report.summary.byPackage)
      .sort((a, b) => b[1] - a[1]);
    for (const [pkg, count] of sortedPackages) {
      const bar = '█'.repeat(Math.min(count, 50));
      console.log(`   ${pkg.padEnd(20)} ${String(count).padStart(4)} ${bar}`);
    }
    console.log('');
  }
  
  // Top 20 Critical Items
  console.log('🔴 Critical Items (Priority 1):');
  const critical = report.todos
    .filter(t => t.priority === 1)
    .slice(0, 20);
  
  for (const todo of critical) {
    console.log(`   [${todo.type}] ${todo.file}:${todo.line}`);
    console.log(`      ${todo.text.slice(0, 80)}...`);
  }
  
  if (critical.length === 0) {
    console.log('   ✅ No critical items!');
  }
  
  console.log('');
  console.log(`Generated: ${report.generated}`);
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('🔍 Scanning codebase for TODOs...\n');
  
  const files = findFiles(join(ROOT_DIR, 'packages'));
  files.push(...findFiles(join(ROOT_DIR, 'src')));
  
  console.log(`📁 Found ${files.length} source files to analyze`);
  
  const allTodos = [];
  
  for (const file of files) {
    const todos = analyzeTodos(file);
    allTodos.push(...todos);
  }
  
  const report = generateReport(allTodos);
  
  if (JSON_OUTPUT) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
    
    // Save report
    const reportPath = join(ROOT_DIR, 'todo-report.json');
    writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 Full report saved to: todo-report.json`);
  }
}

main().catch(console.error);
