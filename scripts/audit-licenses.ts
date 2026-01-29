#!/usr/bin/env node
/**
 * License Audit Tool
 * 
 * Audits all dependencies and integrated projects for license compliance.
 */

import { execSync } from 'child_process';
import chalk from 'chalk';
import * as fs from 'fs/promises';

const COMPATIBLE_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  '0BSD',
  'Unlicense',
  'CC0-1.0'
]);

const INCOMPATIBLE_LICENSES = new Set([
  'GPL-2.0',
  'GPL-3.0',
  'AGPL-3.0',
  'LGPL-2.1',
  'LGPL-3.0',
  'SSPL-1.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0',
  'BUSL-1.1'
]);

interface DependencyLicense {
  name: string;
  version: string;
  license: string;
  repository?: string;
  path: string;
}

async function auditNpmDependencies(): Promise<{
  compatible: DependencyLicense[];
  incompatible: DependencyLicense[];
  unknown: DependencyLicense[];
}> {
  console.log(chalk.cyan('🔍 Auditing npm dependencies...\n'));

  try {
    // Use license-checker
    const output = execSync('npx license-checker --json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    });

    const licenses = JSON.parse(output);
    const compatible: DependencyLicense[] = [];
    const incompatible: DependencyLicense[] = [];
    const unknown: DependencyLicense[] = [];

    for (const [key, value] of Object.entries(licenses as Record<string, any>)) {
      const [name, version] = key.split('@').slice(-2);
      const license = value.licenses || 'UNKNOWN';
      
      const dep: DependencyLicense = {
        name: name || key,
        version,
        license,
        repository: value.repository,
        path: value.path
      };

      // Check license compatibility
      const licenseSpdx = license.replace(/[()]/g, '').split(' OR ')[0];
      
      if (INCOMPATIBLE_LICENSES.has(licenseSpdx)) {
        incompatible.push(dep);
      } else if (COMPATIBLE_LICENSES.has(licenseSpdx)) {
        compatible.push(dep);
      } else if (license === 'UNKNOWN' || license.includes('*')) {
        unknown.push(dep);
      } else {
        // Might be compatible but needs review
        unknown.push(dep);
      }
    }

    return { compatible, incompatible, unknown };
  } catch (error) {
    console.error(chalk.yellow('⚠️  Could not run license-checker'));
    console.log(chalk.gray('Install with: npm install -g license-checker\n'));
    return { compatible: [], incompatible: [], unknown: [] };
  }
}

async function auditIntegrations(): Promise<{
  documented: string[];
  undocumented: string[];
}> {
  console.log(chalk.cyan('🔍 Auditing integrated projects...\n'));

  const documented: string[] = [];
  const undocumented: string[] = [];

  try {
    // Check packages/integrations
    const entries = await fs.readdir('./packages/integrations', { withFileTypes: true });
    
    // Check THIRD_PARTY_NOTICES.md
    const notices = await fs.readFile('./THIRD_PARTY_NOTICES.md', 'utf-8');

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      if (notices.toLowerCase().includes(entry.name.toLowerCase())) {
        documented.push(entry.name);
      } else {
        undocumented.push(entry.name);
      }
    }
  } catch (error) {
    // No integrations yet
  }

  return { documented, undocumented };
}

async function main() {
  console.log(chalk.bold.blue('\n📋 License Compliance Audit\n'));
  console.log(chalk.gray('─'.repeat(80)));

  // Audit npm dependencies
  const deps = await auditNpmDependencies();

  console.log(chalk.bold.green(`\n✅ Compatible: ${deps.compatible.length}`));
  console.log(chalk.gray('   These dependencies have compatible open source licenses\n'));

  if (deps.incompatible.length > 0) {
    console.log(chalk.bold.red(`\n❌ Incompatible: ${deps.incompatible.length}`));
    console.log(chalk.red('   These dependencies have incompatible licenses:\n'));
    
    for (const dep of deps.incompatible) {
      console.log(chalk.red(`   • ${dep.name}@${dep.version} - ${dep.license}`));
    }
    console.log();
  }

  if (deps.unknown.length > 0) {
    console.log(chalk.bold.yellow(`\n⚠️  Unknown/Needs Review: ${deps.unknown.length}`));
    console.log(chalk.yellow('   These dependencies need manual license review:\n'));
    
    for (const dep of deps.unknown.slice(0, 10)) {
      console.log(chalk.yellow(`   • ${dep.name}@${dep.version} - ${dep.license}`));
    }
    
    if (deps.unknown.length > 10) {
      console.log(chalk.gray(`   ... and ${deps.unknown.length - 10} more\n`));
    }
  }

  // Audit integrations
  console.log(chalk.gray('\n─'.repeat(80)));
  const integrations = await auditIntegrations();

  if (integrations.documented.length > 0) {
    console.log(chalk.bold.green(`\n✅ Documented Integrations: ${integrations.documented.length}`));
    for (const name of integrations.documented) {
      console.log(chalk.green(`   • ${name}`));
    }
  }

  if (integrations.undocumented.length > 0) {
    console.log(chalk.bold.red(`\n❌ Missing Attribution: ${integrations.undocumented.length}`));
    console.log(chalk.red('   These integrations need attribution in THIRD_PARTY_NOTICES.md:\n'));
    
    for (const name of integrations.undocumented) {
      console.log(chalk.red(`   • ${name}`));
    }
  }

  // Summary
  console.log(chalk.gray('\n─'.repeat(80)));
  
  const issues = deps.incompatible.length + integrations.undocumented.length;
  const warnings = deps.unknown.length;

  if (issues === 0 && warnings === 0) {
    console.log(chalk.bold.green('\n✅ All licenses are compliant!\n'));
    process.exit(0);
  } else if (issues > 0) {
    console.log(chalk.bold.red(`\n❌ Found ${issues} compliance issue(s)\n`));
    console.log(chalk.yellow('Action required:'));
    
    if (deps.incompatible.length > 0) {
      console.log(chalk.white('  • Remove or replace incompatible dependencies'));
    }
    
    if (integrations.undocumented.length > 0) {
      console.log(chalk.white('  • Add missing attributions: npm run update:attributions'));
    }
    
    console.log();
    process.exit(1);
  } else {
    console.log(chalk.bold.yellow(`\n⚠️  Found ${warnings} item(s) needing review\n`));
    console.log(chalk.white('Please review unknown licenses manually\n'));
    process.exit(0);
  }
}

main().catch(error => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
