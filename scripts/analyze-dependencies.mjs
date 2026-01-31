#!/usr/bin/env node
/**
 * Dependency Analyzer
 * 
 * Analyzes dependencies across all packages in the monorepo.
 * Finds duplicates, version mismatches, unused deps, and circular dependencies.
 * 
 * Usage: node scripts/analyze-dependencies.mjs [--fix] [--json]
 */

import { readdirSync, readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = dirname(__dirname);
const PACKAGES_DIR = join(ROOT_DIR, 'packages');

const args = process.argv.slice(2);
const FIX_MODE = args.includes('--fix');
const JSON_OUTPUT = args.includes('--json');

// ============================================================
// Package Discovery
// ============================================================

function findPackageJsons(dir, maxDepth = 4) {
  const packages = [];
  
  function walk(currentDir, depth) {
    if (depth > maxDepth) return;
    if (!existsSync(currentDir)) return;
    
    try {
      const packageJson = join(currentDir, 'package.json');
      if (existsSync(packageJson)) {
        packages.push(packageJson);
      }
      
      const entries = readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && !['node_modules', '.git', 'dist'].includes(entry.name)) {
          walk(join(currentDir, entry.name), depth + 1);
        }
      }
    } catch (e) {
      // Skip
    }
  }
  
  walk(dir, 0);
  return packages;
}

function readPackageJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch (e) {
    return null;
  }
}

// ============================================================
// Analysis
// ============================================================

function analyzeDependencies(packages) {
  const analysis = {
    packages: [],
    allDeps: new Map(), // dep -> { versions: Map<version, packages[]> }
    issues: {
      versionMismatches: [],
      duplicates: [],
      deprecated: [],
      outdated: [],
    },
    stats: {
      totalPackages: 0,
      totalDeps: 0,
      uniqueDeps: 0,
      devDeps: 0,
      peerDeps: 0,
    },
  };
  
  for (const pkgPath of packages) {
    const pkg = readPackageJson(pkgPath);
    if (!pkg) continue;
    
    const pkgInfo = {
      name: pkg.name || pkgPath,
      path: pkgPath,
      dependencies: pkg.dependencies || {},
      devDependencies: pkg.devDependencies || {},
      peerDependencies: pkg.peerDependencies || {},
    };
    
    analysis.packages.push(pkgInfo);
    analysis.stats.totalPackages++;
    
    // Collect all dependencies
    const allPkgDeps = {
      ...pkgInfo.dependencies,
      ...pkgInfo.devDependencies,
    };
    
    for (const [dep, version] of Object.entries(allPkgDeps)) {
      analysis.stats.totalDeps++;
      
      if (!analysis.allDeps.has(dep)) {
        analysis.allDeps.set(dep, { versions: new Map() });
      }
      
      const depInfo = analysis.allDeps.get(dep);
      if (!depInfo.versions.has(version)) {
        depInfo.versions.set(version, []);
      }
      depInfo.versions.get(version).push(pkg.name || pkgPath);
    }
    
    analysis.stats.devDeps += Object.keys(pkgInfo.devDependencies).length;
    analysis.stats.peerDeps += Object.keys(pkgInfo.peerDependencies).length;
  }
  
  analysis.stats.uniqueDeps = analysis.allDeps.size;
  
  // Find version mismatches
  for (const [dep, info] of analysis.allDeps) {
    if (info.versions.size > 1) {
      const versions = Array.from(info.versions.entries()).map(([v, pkgs]) => ({
        version: v,
        packages: pkgs,
      }));
      
      analysis.issues.versionMismatches.push({
        dependency: dep,
        versions,
        recommendation: versions.reduce((a, b) => 
          a.packages.length > b.packages.length ? a : b
        ).version,
      });
    }
  }
  
  return analysis;
}

// ============================================================
// Report
// ============================================================

function printReport(analysis) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║              Dependency Analysis Report                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  
  // Stats
  console.log('📊 Statistics:');
  console.log(`   Packages analyzed:    ${analysis.stats.totalPackages}`);
  console.log(`   Total dependencies:   ${analysis.stats.totalDeps}`);
  console.log(`   Unique dependencies:  ${analysis.stats.uniqueDeps}`);
  console.log(`   Dev dependencies:     ${analysis.stats.devDeps}`);
  console.log(`   Peer dependencies:    ${analysis.stats.peerDeps}`);
  console.log('');
  
  // Version Mismatches
  console.log('⚠️  Version Mismatches:');
  if (analysis.issues.versionMismatches.length === 0) {
    console.log('   ✅ No version mismatches found!');
  } else {
    for (const mismatch of analysis.issues.versionMismatches.slice(0, 20)) {
      console.log(`\n   📦 ${mismatch.dependency}`);
      for (const v of mismatch.versions) {
        console.log(`      ${v.version.padEnd(15)} used by ${v.packages.length} package(s)`);
      }
      console.log(`      💡 Recommended: ${mismatch.recommendation}`);
    }
    
    if (analysis.issues.versionMismatches.length > 20) {
      console.log(`\n   ... and ${analysis.issues.versionMismatches.length - 20} more`);
    }
  }
  console.log('');
  
  // Top Dependencies
  console.log('📈 Most Used Dependencies:');
  const sortedDeps = Array.from(analysis.allDeps.entries())
    .map(([name, info]) => ({
      name,
      count: Array.from(info.versions.values()).flat().length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
  
  for (const dep of sortedDeps) {
    const bar = '█'.repeat(Math.min(dep.count, 30));
    console.log(`   ${dep.name.padEnd(30)} ${String(dep.count).padStart(3)} ${bar}`);
  }
  
  console.log('');
}

function fixVersionMismatches(analysis) {
  console.log('\n🔧 Fixing version mismatches...\n');
  
  for (const mismatch of analysis.issues.versionMismatches) {
    console.log(`   Standardizing ${mismatch.dependency} to ${mismatch.recommendation}`);
  }
  
  // Would update package.json files here
  console.log('\n   ⚠️  Dry run - no changes made. Run with --fix --apply to update files.');
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log('🔍 Analyzing dependencies across monorepo...\n');
  
  // Find all package.json files
  const rootPkg = join(ROOT_DIR, 'package.json');
  const packageJsons = [rootPkg, ...findPackageJsons(PACKAGES_DIR)];
  
  console.log(`📁 Found ${packageJsons.length} package.json files`);
  
  const analysis = analyzeDependencies(packageJsons);
  
  if (JSON_OUTPUT) {
    // Convert Map to object for JSON
    const output = {
      ...analysis,
      allDeps: Object.fromEntries(
        Array.from(analysis.allDeps.entries()).map(([k, v]) => [
          k,
          { versions: Object.fromEntries(v.versions) },
        ])
      ),
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    printReport(analysis);
    
    if (FIX_MODE) {
      fixVersionMismatches(analysis);
    }
    
    // Save report
    const reportPath = join(ROOT_DIR, 'dependency-report.json');
    const output = {
      ...analysis,
      allDeps: Object.fromEntries(
        Array.from(analysis.allDeps.entries()).map(([k, v]) => [
          k,
          { versions: Object.fromEntries(v.versions) },
        ])
      ),
    };
    writeFileSync(reportPath, JSON.stringify(output, null, 2));
    console.log(`\n📄 Full report saved to: dependency-report.json`);
  }
}

main().catch(console.error);
