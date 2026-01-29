#!/usr/bin/env node
/**
 * Rebranding Script for Universal Crypto MCP
 * Updates all package.json files with consistent branding
 * 
 * Author: nich
 * GitHub: https://github.com/nirholas
 * Twitter: https://x.com/nichxbt
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const AUTHOR_INFO = {
  name: "nich",
  url: "https://github.com/nirholas",
  twitter: "https://x.com/nichxbt"
};

const REPO_INFO = {
  type: "git",
  url: "https://github.com/nirholas/universal-crypto-mcp"
};

function findPackageJsonFiles(dir, files = []) {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
      findPackageJsonFiles(fullPath, files);
    } else if (item === 'package.json') {
      files.push(fullPath);
    }
  }
  
  return files;
}

function updatePackageJson(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    // Update author
    pkg.author = AUTHOR_INFO;
    
    // Update repository if it exists or add it
    if (pkg.repository || pkg.name?.startsWith('@nirholas')) {
      pkg.repository = {
        ...REPO_INFO,
        directory: filePath.replace('/workspaces/universal-crypto-mcp/', '').replace('/package.json', '')
      };
    }
    
    // Add funding if not present
    if (!pkg.funding) {
      pkg.funding = {
        type: "github",
        url: "https://github.com/sponsors/nirholas"
      };
    }
    
    // Update contributors
    if (!pkg.contributors) {
      pkg.contributors = [AUTHOR_INFO];
    }
    
    // Write back
    writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`Updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main
const packagesDir = '/workspaces/universal-crypto-mcp/packages';
const files = findPackageJsonFiles(packagesDir);

console.log(`Found ${files.length} package.json files`);

let updated = 0;
let failed = 0;

for (const file of files) {
  if (updatePackageJson(file)) {
    updated++;
  } else {
    failed++;
  }
}

console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
