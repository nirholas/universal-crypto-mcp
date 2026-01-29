#!/usr/bin/env node
/**
 * Package Name Rebranding Script
 * Updates all package names to use @nirholas scope
 * 
 * @author nich
 * @see https://github.com/nirholas
 * @see https://x.com/nichxbt
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative, dirname } from 'path';

const ROOT = '/workspaces/universal-crypto-mcp';

// Mapping of old scopes to new names
const SCOPE_REPLACEMENTS = {
  '@mcpdotdirect/': '@nirholas/crypto-',
  '@sperax/': '@nirholas/crypto-',
  '@llm-energy/': '@nirholas/crypto-',
  '@coinpaprika/': '@nirholas/crypto-',
  '@x402/': '@nirholas/x402-',
  'plugin.delivery': '@nirholas/crypto-mcp-marketplace',
};

// Specific package name mappings
const NAME_MAPPINGS = {
  'evm-mcp-server': '@nirholas/crypto-evm-mcp',
  'cryptopanic-mcp-server': '@nirholas/crypto-news-mcp',
  'crypto-news': '@nirholas/crypto-news',
  'free-crypto-news': '@nirholas/crypto-news-free',
  'crypto-news-cli': '@nirholas/crypto-news-cli',
  'dexpaprika-mcp': '@nirholas/crypto-dex-prices',
  'whale-tracker-mcp': '@nirholas/crypto-whale-tracker',
  'fear-greed-mcp': '@nirholas/crypto-fear-greed',
  'mcp-web3-stats': '@nirholas/crypto-web3-stats',
  'onchain-mcp': '@nirholas/crypto-onchain',
  'lyra-registry': '@nirholas/crypto-lyra-registry',
  'lyra-tool-discovery': '@nirholas/crypto-lyra-discovery',
  'github-to-mcp': '@nirholas/crypto-github-to-mcp',
  'extract-llms-docs': '@nirholas/crypto-doc-extractor',
  'sweep-dust-sweeper': '@nirholas/crypto-dust-sweeper',
  'boosty-volume-bot': '@nirholas/crypto-volume-bot',
  'xactions-mcp': '@nirholas/crypto-xactions',
  'xactions-premium': '@nirholas/crypto-xactions-premium',
  'solana-wallet-toolkit': '@nirholas/crypto-solana-wallet',
  'ethereum-wallet-toolkit': '@nirholas/crypto-evm-wallet',
  'binance-mcp-server': '@nirholas/crypto-binance',
  'binance-us-mcp-server': '@nirholas/crypto-binance-us',
  'prediction-api': '@nirholas/crypto-predictions',
  'defi-agents': '@nirholas/crypto-defi-agents',
  'agenti-mcp-server': '@nirholas/crypto-agenti',
  'ucai-mcp-server': '@nirholas/crypto-ucai',
  'bnbchain-mcp-server': '@nirholas/crypto-bnbchain',
  'sperax-mcp-server': '@nirholas/crypto-sperax',
  'mcp-free-usdc-transfer': '@nirholas/crypto-usdc-transfer',
  'mcp-blockchain-server': '@nirholas/crypto-blockchain',
  'lyra-intel-mcp': '@nirholas/crypto-lyra-intel',
  'lyra-intel-dashboard': '@nirholas/crypto-lyra-dashboard',
  'lyra-intel-vscode': '@nirholas/crypto-lyra-vscode',
  'lyra-web3-playground': '@nirholas/crypto-lyra-playground',
};

function findPackageJsonFiles(dir, files = []) {
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      try {
        const stat = statSync(fullPath);
        
        if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') {
          findPackageJsonFiles(fullPath, files);
        } else if (item === 'package.json') {
          files.push(fullPath);
        }
      } catch (e) {
        // Skip files we can't stat
      }
    }
  } catch (e) {
    // Skip directories we can't read
  }
  
  return files;
}

function getNewPackageName(oldName, filePath) {
  // Check direct mappings first
  if (NAME_MAPPINGS[oldName]) {
    return NAME_MAPPINGS[oldName];
  }
  
  // Check scope replacements
  for (const [oldScope, newPrefix] of Object.entries(SCOPE_REPLACEMENTS)) {
    if (oldName.startsWith(oldScope)) {
      return oldName.replace(oldScope, newPrefix);
    }
  }
  
  // Already has @nirholas scope
  if (oldName.startsWith('@nirholas/')) {
    return oldName;
  }
  
  // For unscoped packages, derive name from path
  const relPath = relative(ROOT + '/packages', dirname(filePath));
  const parts = relPath.split('/').filter(p => p && p !== 'src');
  
  if (parts.length >= 1) {
    // Use path-based naming
    const newName = '@nirholas/crypto-' + parts.join('-').toLowerCase();
    return newName;
  }
  
  return oldName; // Keep original if we can't determine
}

function updatePackageJson(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const pkg = JSON.parse(content);
    
    const oldName = pkg.name;
    if (!oldName) return false;
    
    // Skip if already @nirholas scoped
    if (oldName.startsWith('@nirholas/')) {
      return false;
    }
    
    const newName = getNewPackageName(oldName, filePath);
    
    if (newName !== oldName) {
      pkg.name = newName;
      
      // Update description to mention Universal Crypto MCP
      if (pkg.description && !pkg.description.includes('Universal Crypto MCP')) {
        pkg.description = pkg.description.replace(/^/, 'Universal Crypto MCP - ');
      }
      
      writeFileSync(filePath, JSON.stringify(pkg, null, 2) + '\n');
      console.log(`Renamed: ${oldName} → ${newName}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main
const packagesDir = ROOT + '/packages';
const files = findPackageJsonFiles(packagesDir);

console.log(`Found ${files.length} package.json files`);

let updated = 0;
let skipped = 0;

for (const file of files) {
  if (updatePackageJson(file)) {
    updated++;
  } else {
    skipped++;
  }
}

console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
