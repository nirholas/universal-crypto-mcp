#!/usr/bin/env npx ts-node
/**
 * Deep Implementation Generator
 * 
 * This script does a deep analysis of vendor repos and generates
 * production-ready implementations by extracting and adapting actual code.
 * 
 * Usage: npx ts-node scripts/deep-implement.ts [options]
 * 
 * Options:
 *   --dry-run       Show what would be created without writing files
 *   --category <n>  Only process specific category (wallet, ai-agents, etc.)
 *   --verbose       Show detailed extraction info
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================
// Types
// ============================================================

interface FileAnalysis {
  path: string;
  relativePath: string;
  exports: ExportInfo[];
  imports: ImportInfo[];
  content: string;
  size: number;
}

interface ExportInfo {
  name: string;
  type: 'function' | 'class' | 'interface' | 'type' | 'const' | 'enum';
  isDefault: boolean;
  code: string;
  startLine: number;
  endLine: number;
}

interface ImportInfo {
  source: string;
  names: string[];
  isDefault: boolean;
}

interface ImplementationPlan {
  targetPath: string;
  files: GeneratedFile[];
  dependencies: string[];
}

interface GeneratedFile {
  path: string;
  content: string;
  sourceRepo: string;
  adaptations: string[];
}

// ============================================================
// Constants
// ============================================================

const ROOT_DIR = path.join(__dirname, '..');
const VENDOR_DIR = path.join(ROOT_DIR, 'vendor');
const PACKAGES_DIR = path.join(ROOT_DIR, 'packages');

// Map vendor categories to implementation targets
const IMPLEMENTATION_MAP: Record<string, {
  package: string;
  subdir: string;
  priority: string[];  // Priority repos to extract from
}> = {
  'wallet': {
    package: 'wallets',
    subdir: 'src/adapters',
    priority: ['evm-hooks', 'evm-client', 'connect-modal'],
  },
  'ai-agents': {
    package: 'agents',
    subdir: 'src/frameworks',
    priority: ['langchain', 'eliza', 'crew-orchestration'],
  },
  'auth': {
    package: 'security',
    subdir: 'src/auth',
    priority: ['nextjs-auth', 'jwt-library', 'middleware'],
  },
  'state': {
    package: 'shared',
    subdir: 'src/state',
    priority: ['store', 'atomic', 'async-state'],
  },
  'realtime': {
    package: 'infrastructure',
    subdir: 'src/realtime',
    priority: ['websocket-engine', 'websocket-core'],
  },
  'contracts': {
    package: 'core',
    subdir: 'src/contracts',
    priority: ['abi-types', 'foundry-toolkit', 'ethers'],
  },
  'defi': {
    package: 'defi',
    subdir: 'src/protocols',
    priority: ['tvl-adapters'],
  },
  'payments': {
    package: 'payments',
    subdir: 'src/providers',
    priority: ['stripe-sdk', 'coinbase-sdk'],
  },
  'account-abstraction': {
    package: 'wallets',
    subdir: 'src/smart-accounts',
    priority: ['alchemy-aa'],
  },
  'database': {
    package: 'infrastructure',
    subdir: 'src/database',
    priority: ['orm-prisma', 'orm-drizzle', 'query-builder'],
  },
  'api': {
    package: 'core',
    subdir: 'src/api',
    priority: ['typesafe-rpc', 'edge-framework', 'openapi-types'],
  },
  'testing': {
    package: 'shared',
    subdir: 'src/testing',
    priority: ['test-runner', 'e2e-browser', 'api-mocking'],
  },
};

// ============================================================
// File Analysis
// ============================================================

function analyzeTypeScriptFile(filePath: string): FileAnalysis | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const relativePath = path.relative(VENDOR_DIR, filePath);
    
    const exports: ExportInfo[] = [];
    const imports: ImportInfo[] = [];
    
    // Parse imports
    const importRegex = /^import\s+(?:(\w+)(?:\s*,\s*)?)?(?:\{([^}]+)\})?\s+from\s+['"]([^'"]+)['"]/gm;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const defaultImport = match[1];
      const namedImports = match[2] ? match[2].split(',').map(s => s.trim().split(/\s+as\s+/)[0]) : [];
      const source = match[3];
      
      imports.push({
        source,
        names: defaultImport ? [defaultImport, ...namedImports] : namedImports,
        isDefault: !!defaultImport,
      });
    }
    
    // Parse exports with code extraction
    let currentLine = 0;
    for (const line of lines) {
      currentLine++;
      
      // Match export declarations
      const exportMatch = line.match(/^export\s+(default\s+)?(async\s+)?(function|class|interface|type|const|enum)\s+(\w+)/);
      if (exportMatch) {
        const isDefault = !!exportMatch[1];
        const type = exportMatch[3] as ExportInfo['type'];
        const name = exportMatch[4];
        
        // Find the end of this declaration
        let endLine = currentLine;
        let braceCount = 0;
        let started = false;
        
        for (let i = currentLine - 1; i < lines.length; i++) {
          const l = lines[i];
          for (const char of l) {
            if (char === '{') { braceCount++; started = true; }
            if (char === '}') { braceCount--; }
          }
          if (started && braceCount === 0) {
            endLine = i + 1;
            break;
          }
          if (i > currentLine + 200) { // Limit search
            endLine = currentLine + 50;
            break;
          }
        }
        
        const code = lines.slice(currentLine - 1, endLine).join('\n');
        
        exports.push({
          name,
          type,
          isDefault,
          code,
          startLine: currentLine,
          endLine,
        });
      }
    }
    
    return {
      path: filePath,
      relativePath,
      exports,
      imports,
      content,
      size: content.length,
    };
  } catch (e) {
    return null;
  }
}

function findTypeScriptFiles(dir: string, maxFiles = 100): string[] {
  const files: string[] = [];
  
  function walk(currentDir: string, depth = 0) {
    if (depth > 6 || files.length >= maxFiles) return;
    if (!fs.existsSync(currentDir)) return;
    
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (files.length >= maxFiles) break;
        
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          // Skip common non-source directories
          if (['node_modules', '.git', 'dist', 'build', 'coverage', '__pycache__'].includes(entry.name)) {
            continue;
          }
          walk(fullPath, depth + 1);
        } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip unreadable directories
    }
  }
  
  walk(dir);
  return files;
}

// ============================================================
// Code Adaptation
// ============================================================

function adaptImports(imports: ImportInfo[], repoName: string): string[] {
  const adaptedImports: string[] = [];
  
  for (const imp of imports) {
    // Skip relative imports (they reference internal files)
    if (imp.source.startsWith('.')) continue;
    
    // Map common packages
    const packageMappings: Record<string, string> = {
      '@wagmi/core': '@ucm/lib/wallet',
      '@wagmi/connectors': '@ucm/lib/wallet',
      'wagmi': '@ucm/lib/wallet',
      'viem': 'viem',
      'zod': 'zod',
      'zustand': '@ucm/lib/state',
      '@tanstack/react-query': '@ucm/lib/state',
      'jose': 'jose',
      'ethers': 'viem',
      '@safe-global/safe-core-sdk': '@ucm/lib/wallet',
    };
    
    const mappedSource = packageMappings[imp.source] || imp.source;
    
    if (imp.isDefault && imp.names.length === 1) {
      adaptedImports.push(`import ${imp.names[0]} from '${mappedSource}';`);
    } else if (imp.names.length > 0) {
      adaptedImports.push(`import { ${imp.names.join(', ')} } from '${mappedSource}';`);
    }
  }
  
  return adaptedImports;
}

function generateAdaptedCode(analysis: FileAnalysis, category: string, repoName: string): string {
  const lines: string[] = [];
  
  // Header
  lines.push(`/**`);
  lines.push(` * Adapted from: ${repoName}`);
  lines.push(` * Source: vendor/${category}/${repoName}/`);
  lines.push(` * Original file: ${analysis.relativePath}`);
  lines.push(` * `);
  lines.push(` * This code has been adapted for UCM conventions.`);
  lines.push(` * MIT License - See original repository for full license.`);
  lines.push(` */`);
  lines.push(``);
  
  // Adapted imports
  const adaptedImports = adaptImports(analysis.imports, repoName);
  if (adaptedImports.length > 0) {
    lines.push(...adaptedImports);
    lines.push(``);
  }
  
  // Export types first, then functions, then classes
  const typeExports = analysis.exports.filter(e => e.type === 'interface' || e.type === 'type');
  const funcExports = analysis.exports.filter(e => e.type === 'function' || e.type === 'const');
  const classExports = analysis.exports.filter(e => e.type === 'class');
  
  // Add types
  if (typeExports.length > 0) {
    lines.push(`// ============================================================`);
    lines.push(`// Types`);
    lines.push(`// ============================================================`);
    lines.push(``);
    for (const exp of typeExports) {
      lines.push(exp.code);
      lines.push(``);
    }
  }
  
  // Add functions
  if (funcExports.length > 0) {
    lines.push(`// ============================================================`);
    lines.push(`// Functions`);
    lines.push(`// ============================================================`);
    lines.push(``);
    for (const exp of funcExports) {
      lines.push(exp.code);
      lines.push(``);
    }
  }
  
  // Add classes
  if (classExports.length > 0) {
    lines.push(`// ============================================================`);
    lines.push(`// Classes`);
    lines.push(`// ============================================================`);
    lines.push(``);
    for (const exp of classExports) {
      lines.push(exp.code);
      lines.push(``);
    }
  }
  
  return lines.join('\n');
}

// ============================================================
// Implementation Generation
// ============================================================

function generateImplementationPlan(category: string): ImplementationPlan | null {
  const config = IMPLEMENTATION_MAP[category];
  if (!config) return null;
  
  const categoryDir = path.join(VENDOR_DIR, category);
  if (!fs.existsSync(categoryDir)) return null;
  
  const files: GeneratedFile[] = [];
  const dependencies: string[] = [];
  
  // Get repos in priority order
  const repos = fs.readdirSync(categoryDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort((a, b) => {
      const aIndex = config.priority.indexOf(a);
      const bIndex = config.priority.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return 0;
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  
  console.log(`\n📦 Processing category: ${category}`);
  console.log(`   Target: packages/${config.package}/${config.subdir}`);
  console.log(`   Repos: ${repos.join(', ')}`);
  
  const allExports: Map<string, ExportInfo[]> = new Map();
  
  for (const repo of repos.slice(0, 3)) { // Limit to top 3 priority repos
    const repoDir = path.join(categoryDir, repo);
    const tsFiles = findTypeScriptFiles(repoDir, 50);
    
    console.log(`   📄 Analyzing ${repo}: ${tsFiles.length} TypeScript files`);
    
    for (const tsFile of tsFiles) {
      const analysis = analyzeTypeScriptFile(tsFile);
      if (!analysis || analysis.exports.length === 0) continue;
      
      // Track dependencies
      for (const imp of analysis.imports) {
        if (!imp.source.startsWith('.') && !dependencies.includes(imp.source)) {
          dependencies.push(imp.source);
        }
      }
      
      // Group exports by type
      for (const exp of analysis.exports) {
        const key = `${exp.type}:${exp.name}`;
        if (!allExports.has(key)) {
          allExports.set(key, []);
        }
        allExports.get(key)!.push(exp);
      }
      
      // Generate adapted file if it has substantial exports
      if (analysis.exports.length >= 2) {
        const adaptedCode = generateAdaptedCode(analysis, category, repo);
        const fileName = path.basename(analysis.path).replace(/\.tsx?$/, '.ts');
        
        files.push({
          path: path.join(config.subdir, repo, fileName),
          content: adaptedCode,
          sourceRepo: repo,
          adaptations: [`Extracted ${analysis.exports.length} exports`],
        });
      }
    }
  }
  
  // Generate index file
  const indexContent = generateCategoryIndex(category, config, files);
  files.unshift({
    path: path.join(config.subdir, 'index.ts'),
    content: indexContent,
    sourceRepo: 'combined',
    adaptations: ['Re-exports all implementations'],
  });
  
  return {
    targetPath: path.join(PACKAGES_DIR, config.package),
    files,
    dependencies,
  };
}

function generateCategoryIndex(
  category: string,
  config: { package: string; subdir: string; priority: string[] },
  files: GeneratedFile[]
): string {
  const lines: string[] = [];
  
  lines.push(`/**`);
  lines.push(` * ${category.charAt(0).toUpperCase() + category.slice(1)} Implementations`);
  lines.push(` * `);
  lines.push(` * Auto-generated from vendor/${category}/`);
  lines.push(` * See individual files for source attribution.`);
  lines.push(` */`);
  lines.push(``);
  
  // Add re-export from lib if applicable
  const libModules = ['wallet', 'state', 'auth', 'ai', 'realtime', 'forms', 'api', 'contracts', 'payments'];
  const matchingLib = libModules.find(m => category.includes(m));
  if (matchingLib) {
    lines.push(`// Re-export unified lib interface`);
    lines.push(`export * from '@ucm/lib/${matchingLib}';`);
    lines.push(``);
  }
  
  // Group files by repo
  const repoFiles = new Map<string, GeneratedFile[]>();
  for (const file of files) {
    if (file.sourceRepo === 'combined') continue;
    if (!repoFiles.has(file.sourceRepo)) {
      repoFiles.set(file.sourceRepo, []);
    }
    repoFiles.get(file.sourceRepo)!.push(file);
  }
  
  // Add exports for each repo
  for (const [repo, repoFileList] of repoFiles) {
    lines.push(`// From ${repo}`);
    for (const file of repoFileList) {
      const modulePath = './' + path.relative(config.subdir, file.path).replace(/\.ts$/, '');
      lines.push(`export * from '${modulePath}';`);
    }
    lines.push(``);
  }
  
  return lines.join('\n');
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  const categoryFilter = args.includes('--category') 
    ? args[args.indexOf('--category') + 1] 
    : null;
  
  console.log('🚀 Deep Implementation Generator');
  console.log('================================\n');
  
  if (!fs.existsSync(VENDOR_DIR)) {
    console.error('❌ Vendor directory not found. Run clone scripts first.');
    process.exit(1);
  }
  
  const categories = categoryFilter 
    ? [categoryFilter]
    : Object.keys(IMPLEMENTATION_MAP);
  
  let totalFiles = 0;
  let createdFiles = 0;
  
  for (const category of categories) {
    const plan = generateImplementationPlan(category);
    if (!plan) {
      console.log(`   ⚠️  No implementation plan for ${category}`);
      continue;
    }
    
    console.log(`   ✅ Generated ${plan.files.length} files`);
    totalFiles += plan.files.length;
    
    if (verbose) {
      console.log(`   Dependencies: ${plan.dependencies.slice(0, 10).join(', ')}...`);
    }
    
    // Write files
    for (const file of plan.files) {
      const fullPath = path.join(plan.targetPath, file.path);
      const relativePath = path.relative(ROOT_DIR, fullPath);
      
      if (dryRun) {
        console.log(`      [DRY] ${relativePath}`);
      } else {
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        
        if (fs.existsSync(fullPath)) {
          if (verbose) console.log(`      ⏭️  ${relativePath} (exists)`);
        } else {
          fs.writeFileSync(fullPath, file.content);
          console.log(`      ✅ ${relativePath}`);
          createdFiles++;
        }
      }
    }
  }
  
  console.log('\n================================');
  console.log(`📊 Summary: ${createdFiles}/${totalFiles} files created`);
  
  if (dryRun) {
    console.log('\nℹ️  Dry run complete. Remove --dry-run to create files.');
  }
}

main().catch(console.error);
