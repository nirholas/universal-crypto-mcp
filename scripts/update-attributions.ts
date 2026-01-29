#!/usr/bin/env node
/**
 * Update attributions in THIRD_PARTY_NOTICES.md
 * 
 * Scans packages/integrations for integrated projects
 * and ensures they're all documented with proper attribution.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

interface Attribution {
  name: string;
  path: string;
  license: string | null;
  source: string | null;
}

async function findIntegrations(): Promise<Attribution[]> {
  const integrationsPath = './packages/integrations';
  const attributions: Attribution[] = [];

  try {
    const entries = await fs.readdir(integrationsPath, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const projectPath = path.join(integrationsPath, entry.name);
      const attribution: Attribution = {
        name: entry.name,
        path: projectPath,
        license: null,
        source: null
      };

      // Look for license file
      const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'ORIGINAL_LICENSE'];
      for (const licenseFile of licenseFiles) {
        try {
          const licensePath = path.join(projectPath, licenseFile);
          const content = await fs.readFile(licensePath, 'utf-8');
          attribution.license = content;
          break;
        } catch {}
      }

      // Look for README or package.json for source info
      try {
        const packagePath = path.join(projectPath, 'package.json');
        const packageData = JSON.parse(await fs.readFile(packagePath, 'utf-8'));
        
        if (packageData.repository) {
          attribution.source = typeof packageData.repository === 'string'
            ? packageData.repository
            : packageData.repository.url;
        }
      } catch {}

      // Try README for source URL
      if (!attribution.source) {
        try {
          const readmePath = path.join(projectPath, 'README.md');
          const readme = await fs.readFile(readmePath, 'utf-8');
          const match = readme.match(/https:\/\/github\.com\/[^\s)]+/);
          if (match) {
            attribution.source = match[0];
          }
        } catch {}
      }

      attributions.push(attribution);
    }
  } catch (error) {
    // No integrations directory yet
    return [];
  }

  return attributions;
}

async function checkExistingAttributions(): Promise<Set<string>> {
  const existing = new Set<string>();

  try {
    const content = await fs.readFile('./THIRD_PARTY_NOTICES.md', 'utf-8');
    
    // Find all project names in existing file
    const matches = content.matchAll(/###\s+\[?([^\]]+)\]?/g);
    for (const match of matches) {
      existing.add(match[1].toLowerCase());
    }
  } catch {
    // File doesn't exist yet
  }

  return existing;
}

async function main() {
  console.log(chalk.bold.cyan('📝 Updating Third-Party Attributions\n'));

  const integrations = await findIntegrations();
  const existing = await checkExistingAttributions();

  if (integrations.length === 0) {
    console.log(chalk.yellow('No integrations found in packages/integrations/'));
    console.log(chalk.gray('\nIntegrations will be added here when you run:'));
    console.log(chalk.white('  npm run add:subtree -- <repo-url> <name>\n'));
    return;
  }

  console.log(chalk.white(`Found ${integrations.length} integration(s):\n`));

  const missing: Attribution[] = [];
  const documented: Attribution[] = [];

  for (const integration of integrations) {
    if (existing.has(integration.name.toLowerCase())) {
      documented.push(integration);
      console.log(chalk.green('  ✓'), integration.name, chalk.gray('(documented)'));
    } else {
      missing.push(integration);
      console.log(chalk.yellow('  ⚠'), integration.name, chalk.yellow('(missing attribution)'));
    }
  }

  if (missing.length === 0) {
    console.log(chalk.green('\n✅ All integrations have proper attribution!\n'));
    return;
  }

  console.log(chalk.bold.yellow(`\n⚠️  ${missing.length} integration(s) need attribution:\n`));

  for (const integration of missing) {
    console.log(chalk.white(`\n${integration.name}:`));
    
    if (!integration.license) {
      console.log(chalk.red('  ❌ No license file found'));
      console.log(chalk.gray(`     Expected in: ${integration.path}/LICENSE`));
    }
    
    if (!integration.source) {
      console.log(chalk.red('  ❌ No source URL found'));
      console.log(chalk.gray('     Add to package.json or README.md'));
    }

    if (integration.license && integration.source) {
      console.log(chalk.green('  ✓ Ready to add attribution'));
      console.log(chalk.gray(`    Run: npm run verify:license -- ${integration.source} --template`));
    }
  }

  console.log(chalk.bold.cyan('\n📋 Action Items:\n'));
  console.log(chalk.white('1. For each missing integration, run:'));
  console.log(chalk.gray('   npm run verify:license -- <source-url> --template\n'));
  console.log(chalk.white('2. Verify THIRD_PARTY_NOTICES.md is complete\n'));
  console.log(chalk.white('3. Commit the updated attribution file\n'));

  process.exit(missing.length > 0 ? 1 : 0);
}

main().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
