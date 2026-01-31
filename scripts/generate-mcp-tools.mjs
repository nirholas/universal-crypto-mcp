#!/usr/bin/env node
/**
 * MCP Tool Generator
 * 
 * Scans vendor repos and existing code to generate MCP tool definitions.
 * Creates properly typed tool handlers with Zod schemas.
 * 
 * Usage: node scripts/generate-mcp-tools.mjs [--category <name>] [--output <dir>]
 */

import { readdirSync, readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname, basename, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = dirname(__dirname);
const VENDOR_DIR = join(ROOT_DIR, 'vendor');

const args = process.argv.slice(2);
const CATEGORY_FILTER = args.includes('--category') ? args[args.indexOf('--category') + 1] : null;
const OUTPUT_DIR = args.includes('--output') 
  ? args[args.indexOf('--output') + 1] 
  : join(ROOT_DIR, 'packages', 'core', 'src', 'tools', 'generated');

// ============================================================
// Tool Detection
// ============================================================

const TOOL_PATTERNS = [
  // Function names that suggest tools
  /^(get|fetch|create|update|delete|send|verify|sign|list|query|check|validate|execute|process)/,
  // Common tool-like operations
  /^(swap|transfer|mint|burn|approve|stake|unstake|claim|withdraw|deposit)/,
  // Analysis tools
  /^(analyze|calculate|estimate|simulate|predict|parse|format)/,
];

function extractPotentialTools(filePath) {
  const tools = [];
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    
    // Find exported functions
    const funcRegex = /export\s+(?:async\s+)?function\s+(\w+)\s*(?:<[^>]+>)?\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/g;
    let match;
    
    while ((match = funcRegex.exec(content)) !== null) {
      const name = match[1];
      const params = match[2];
      const returnType = match[3]?.trim();
      
      // Check if function name matches tool patterns
      if (TOOL_PATTERNS.some(p => p.test(name))) {
        tools.push({
          name,
          params: parseParams(params),
          returnType: returnType || 'Promise<unknown>',
          file: filePath,
        });
      }
    }
  } catch (e) {
    // Skip
  }
  
  return tools;
}

function parseParams(paramsStr) {
  if (!paramsStr.trim()) return [];
  
  const params = [];
  const parts = paramsStr.split(',');
  
  for (const part of parts) {
    const match = part.trim().match(/^(\w+)(?:\?)?:\s*(.+)$/);
    if (match) {
      params.push({
        name: match[1],
        type: match[2].trim(),
        optional: part.includes('?'),
      });
    }
  }
  
  return params;
}

// ============================================================
// MCP Tool Generation
// ============================================================

function generateToolDefinition(tool, category) {
  const toolName = `${category}_${camelToSnake(tool.name)}`;
  const description = generateDescription(tool.name);
  
  const lines = [
    `/**`,
    ` * ${tool.name}`,
    ` * `,
    ` * ${description}`,
    ` * Source: ${relative(ROOT_DIR, tool.file)}`,
    ` */`,
    `export const ${tool.name}Tool: MCPTool = {`,
    `  name: '${toolName}',`,
    `  description: '${description}',`,
    `  inputSchema: {`,
    `    type: 'object',`,
    `    properties: {`,
  ];
  
  for (const param of tool.params) {
    const zodType = typeToZod(param.type);
    lines.push(`      ${param.name}: ${zodType},`);
  }
  
  lines.push(`    },`);
  
  const requiredParams = tool.params.filter(p => !p.optional).map(p => `'${p.name}'`);
  if (requiredParams.length > 0) {
    lines.push(`    required: [${requiredParams.join(', ')}],`);
  }
  
  lines.push(`  },`);
  lines.push(`  handler: async (params) => {`);
  lines.push(`    // TODO: Implement using ${tool.name}`);
  lines.push(`    // const result = await ${tool.name}(${tool.params.map(p => `params.${p.name}`).join(', ')});`);
  lines.push(`    throw new Error('Not implemented: ${toolName}');`);
  lines.push(`  },`);
  lines.push(`};`);
  
  return lines.join('\n');
}

function camelToSnake(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).replace(/^_/, '');
}

function generateDescription(funcName) {
  // Convert camelCase to readable description
  const words = funcName.replace(/([A-Z])/g, ' $1').toLowerCase().trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function typeToZod(tsType) {
  // Map TypeScript types to Zod-like schema
  const typeMap = {
    'string': "{ type: 'string' }",
    'number': "{ type: 'number' }",
    'boolean': "{ type: 'boolean' }",
    'bigint': "{ type: 'string', description: 'BigInt as string' }",
    'Address': "{ type: 'string', pattern: '^0x[a-fA-F0-9]{40}$' }",
    'Hash': "{ type: 'string', pattern: '^0x[a-fA-F0-9]{64}$' }",
  };
  
  // Check for array
  if (tsType.endsWith('[]')) {
    const innerType = tsType.slice(0, -2);
    return `{ type: 'array', items: ${typeToZod(innerType)} }`;
  }
  
  // Check for known types
  for (const [key, value] of Object.entries(typeMap)) {
    if (tsType.includes(key)) {
      return value;
    }
  }
  
  return "{ type: 'object' }";
}

function generateCategoryFile(category, tools) {
  const lines = [
    `/**`,
    ` * MCP Tools: ${category}`,
    ` * `,
    ` * Auto-generated from vendor/${category}/`,
    ` * Total tools: ${tools.length}`,
    ` */`,
    ``,
    `import { z } from 'zod';`,
    `import type { MCPTool } from '../types';`,
    ``,
  ];
  
  for (const tool of tools) {
    lines.push(generateToolDefinition(tool, category));
    lines.push('');
  }
  
  // Export all tools
  lines.push(`export const ${category.replace(/-/g, '')}Tools = [`);
  for (const tool of tools) {
    lines.push(`  ${tool.name}Tool,`);
  }
  lines.push(`];`);
  
  return lines.join('\n');
}

// ============================================================
// Vendor Scanning
// ============================================================

function scanVendorCategory(category) {
  const categoryDir = join(VENDOR_DIR, category);
  if (!existsSync(categoryDir)) return [];
  
  const tools = [];
  const repos = readdirSync(categoryDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
  
  for (const repo of repos.slice(0, 5)) {
    const repoDir = join(categoryDir, repo);
    const tsFiles = findTypeScriptFiles(repoDir, 30);
    
    for (const file of tsFiles) {
      const extracted = extractPotentialTools(file);
      tools.push(...extracted);
    }
  }
  
  // Deduplicate by name
  const seen = new Set();
  return tools.filter(t => {
    if (seen.has(t.name)) return false;
    seen.add(t.name);
    return true;
  });
}

function findTypeScriptFiles(dir, maxFiles = 50, maxDepth = 4) {
  const files = [];
  
  function walk(currentDir, depth) {
    if (depth > maxDepth || files.length >= maxFiles) return;
    if (!existsSync(currentDir)) return;
    
    try {
      const entries = readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (files.length >= maxFiles) break;
        
        const fullPath = join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          if (['node_modules', '.git', 'dist', 'test', 'tests', '__tests__'].includes(entry.name)) continue;
          walk(fullPath, depth + 1);
        } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip
    }
  }
  
  walk(dir, 0);
  return files;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('🔧 Generating MCP Tools...\n');
  
  if (!existsSync(VENDOR_DIR)) {
    console.error('❌ Vendor directory not found!');
    process.exit(1);
  }
  
  // Get categories
  const categories = CATEGORY_FILTER 
    ? [CATEGORY_FILTER]
    : readdirSync(VENDOR_DIR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
  
  mkdirSync(OUTPUT_DIR, { recursive: true });
  
  let totalTools = 0;
  const categoryStats = [];
  
  for (const category of categories) {
    console.log(`📦 Processing: ${category}`);
    
    const tools = scanVendorCategory(category);
    
    if (tools.length === 0) {
      console.log(`   ⚪ No tools found`);
      continue;
    }
    
    console.log(`   📋 Found ${tools.length} potential tools`);
    
    // Generate category file
    const content = generateCategoryFile(category, tools);
    const outputFile = join(OUTPUT_DIR, `${category}.ts`);
    
    writeFileSync(outputFile, content);
    console.log(`   ✅ Generated: ${relative(ROOT_DIR, outputFile)}`);
    
    totalTools += tools.length;
    categoryStats.push({ category, count: tools.length });
  }
  
  // Generate index file
  const indexLines = [
    `/**`,
    ` * Generated MCP Tools Index`,
    ` * `,
    ` * Total: ${totalTools} tools across ${categoryStats.length} categories`,
    ` */`,
    ``,
  ];
  
  for (const { category } of categoryStats) {
    indexLines.push(`export * from './${category}';`);
  }
  
  writeFileSync(join(OUTPUT_DIR, 'index.ts'), indexLines.join('\n'));
  
  console.log('\n════════════════════════════════════════');
  console.log(`📊 Summary:`);
  console.log(`   Categories: ${categoryStats.length}`);
  console.log(`   Total tools: ${totalTools}`);
  console.log(`   Output: ${relative(ROOT_DIR, OUTPUT_DIR)}/`);
  console.log('════════════════════════════════════════\n');
}

main().catch(console.error);
