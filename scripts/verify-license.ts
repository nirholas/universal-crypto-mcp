#!/usr/bin/env node
/**
 * License Verification Tool
 * 
 * Verifies that a GitHub repository has a compatible license
 * before integration.
 */

import { Octokit } from '@octokit/rest';
import chalk from 'chalk';
import ora from 'ora';

const COMPATIBLE_LICENSES = new Set([
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC',
  '0BSD'
]);

const INCOMPATIBLE_LICENSES = new Set([
  'GPL-2.0',
  'GPL-3.0',
  'AGPL-3.0',
  'LGPL-2.1',
  'LGPL-3.0',
  'SSPL-1.0',
  'CC-BY-NC-4.0',
  'CC-BY-NC-SA-4.0'
]);

interface LicenseInfo {
  spdxId: string;
  name: string;
  compatible: boolean;
  requiresAttribution: boolean;
  requiresNotice: boolean;
  requiresDisclosure: boolean;
  allowsCommercialUse: boolean;
  warnings: string[];
}

class LicenseVerifier {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
  }

  async verifyRepository(repoUrl: string): Promise<{
    compatible: boolean;
    license: LicenseInfo | null;
    details: any;
  }> {
    const spinner = ora('Checking repository license...').start();

    try {
      // Parse repo URL
      const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL');
      }

      const [, owner, repo] = match;
      const repoName = repo.replace(/\.git$/, '');

      // Get repository info
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo: repoName
      });

      // Get license details
      let licenseContent = null;
      try {
        const { data: licenseData } = await this.octokit.repos.getContent({
          owner,
          repo: repoName,
          path: 'LICENSE'
        });
        
        if ('content' in licenseData) {
          licenseContent = Buffer.from(licenseData.content, 'base64').toString('utf-8');
        }
      } catch (e) {
        // Try LICENSE.md, LICENSE.txt
        for (const filename of ['LICENSE.md', 'LICENSE.txt', 'COPYING']) {
          try {
            const { data } = await this.octokit.repos.getContent({
              owner,
              repo: repoName,
              path: filename
            });
            if ('content' in data) {
              licenseContent = Buffer.from(data.content, 'base64').toString('utf-8');
              break;
            }
          } catch {}
        }
      }

      spinner.stop();

      const license = repoData.license;
      if (!license) {
        return {
          compatible: false,
          license: null,
          details: {
            hasLicense: false,
            message: 'No license detected'
          }
        };
      }

      const spdxId = license.spdx_id || 'Unknown';
      const licenseInfo = this.analyzeLicense(spdxId, licenseContent);

      return {
        compatible: licenseInfo.compatible,
        license: licenseInfo,
        details: {
          hasLicense: true,
          spdxId,
          name: license.name,
          url: license.url,
          content: licenseContent
        }
      };
    } catch (error: any) {
      spinner.fail('Verification failed');
      throw error;
    }
  }

  private analyzeLicense(spdxId: string, content: string | null): LicenseInfo {
    const warnings: string[] = [];
    let compatible = COMPATIBLE_LICENSES.has(spdxId);
    
    // Check for incompatible licenses
    if (INCOMPATIBLE_LICENSES.has(spdxId)) {
      compatible = false;
      warnings.push('This is a copyleft license that requires derivative works to use the same license');
    }

    // Check for commercial restrictions
    if (spdxId.includes('NC')) {
      compatible = false;
      warnings.push('Non-commercial license - cannot be used in commercial products');
    }

    // Analyze specific license requirements
    let requiresAttribution = true;
    let requiresNotice = false;
    let requiresDisclosure = false;
    let allowsCommercialUse = true;

    switch (spdxId) {
      case 'MIT':
      case 'ISC':
      case '0BSD':
        requiresAttribution = true;
        requiresNotice = false;
        requiresDisclosure = false;
        break;

      case 'Apache-2.0':
        requiresAttribution = true;
        requiresNotice = true;
        requiresDisclosure = true;
        if (content && !content.includes('NOTICE')) {
          warnings.push('Apache 2.0 license but no NOTICE file found');
        }
        break;

      case 'BSD-2-Clause':
      case 'BSD-3-Clause':
        requiresAttribution = true;
        requiresNotice = false;
        requiresDisclosure = false;
        break;

      case 'GPL-2.0':
      case 'GPL-3.0':
      case 'AGPL-3.0':
        compatible = false;
        allowsCommercialUse = true; // Yes, but viral
        requiresDisclosure = true;
        warnings.push('GPL requires all derivative works to be GPL licensed');
        break;

      default:
        if (!COMPATIBLE_LICENSES.has(spdxId)) {
          warnings.push('Unknown or uncommon license - manual review required');
          compatible = false;
        }
    }

    // Check for patent clauses
    if (content) {
      if (content.toLowerCase().includes('patent')) {
        warnings.push('Contains patent-related clauses - review carefully');
      }

      // Check for attribution requirements
      if (content.toLowerCase().includes('attribution') || 
          content.toLowerCase().includes('copyright notice')) {
        requiresAttribution = true;
      }
    }

    return {
      spdxId,
      name: this.getLicenseName(spdxId),
      compatible,
      requiresAttribution,
      requiresNotice,
      requiresDisclosure,
      allowsCommercialUse,
      warnings
    };
  }

  private getLicenseName(spdxId: string): string {
    const names: Record<string, string> = {
      'MIT': 'MIT License',
      'Apache-2.0': 'Apache License 2.0',
      'BSD-2-Clause': 'BSD 2-Clause "Simplified" License',
      'BSD-3-Clause': 'BSD 3-Clause "New" or "Revised" License',
      'ISC': 'ISC License',
      '0BSD': 'BSD Zero Clause License',
      'GPL-2.0': 'GNU General Public License v2.0',
      'GPL-3.0': 'GNU General Public License v3.0',
      'AGPL-3.0': 'GNU Affero General Public License v3.0',
      'LGPL-2.1': 'GNU Lesser General Public License v2.1',
      'LGPL-3.0': 'GNU Lesser General Public License v3.0'
    };

    return names[spdxId] || spdxId;
  }

  displayResults(result: Awaited<ReturnType<typeof this.verifyRepository>>): void {
    console.log(chalk.bold.blue('\n📜 License Verification Report\n'));
    console.log(chalk.gray('─'.repeat(80)));

    if (!result.details.hasLicense) {
      console.log(chalk.red('\n❌ No license detected'));
      console.log(chalk.yellow('\n⚠️  Cannot integrate without a valid open source license'));
      return;
    }

    const license = result.license!;

    // Compatibility status
    if (license.compatible) {
      console.log(chalk.green('\n✅ Compatible License'));
    } else {
      console.log(chalk.red('\n❌ Incompatible License'));
    }

    console.log(chalk.white(`\n${license.name} (${license.spdxId})`));

    // Requirements
    console.log(chalk.bold.cyan('\n📋 Requirements:\n'));
    
    if (license.requiresAttribution) {
      console.log(chalk.green('  ✓'), 'Must include copyright notice and license text');
    }
    
    if (license.requiresNotice) {
      console.log(chalk.green('  ✓'), 'Must include NOTICE file if present');
    }
    
    if (license.requiresDisclosure) {
      console.log(chalk.green('  ✓'), 'Must document all modifications');
    }
    
    if (license.allowsCommercialUse) {
      console.log(chalk.green('  ✓'), 'Commercial use allowed');
    } else {
      console.log(chalk.red('  ✗'), 'Commercial use NOT allowed');
    }

    // Warnings
    if (license.warnings.length > 0) {
      console.log(chalk.bold.yellow('\n⚠️  Warnings:\n'));
      for (const warning of license.warnings) {
        console.log(chalk.yellow(`  • ${warning}`));
      }
    }

    // Next steps
    if (license.compatible) {
      console.log(chalk.bold.green('\n✅ Integration Steps:\n'));
      console.log(chalk.white('  1. Copy full license text to THIRD_PARTY_NOTICES.md'));
      console.log(chalk.white('  2. Include copyright notice in adapted files'));
      console.log(chalk.white('  3. Add attribution to README and documentation'));
      console.log(chalk.white('  4. Document integration in INTEGRATION_STRATEGY.md'));
      
      if (license.requiresNotice) {
        console.log(chalk.yellow('  5. Check for NOTICE file and include it'));
      }
    } else {
      console.log(chalk.bold.red('\n❌ Cannot Integrate:\n'));
      console.log(chalk.white('  This license is incompatible with commercial use'));
      console.log(chalk.white('  or has copyleft requirements that conflict with'));
      console.log(chalk.white('  our licensing model.'));
    }

    console.log(chalk.gray('\n' + '─'.repeat(80) + '\n'));
  }

  async generateAttributionTemplate(
    repoUrl: string,
    result: Awaited<ReturnType<typeof this.verifyRepository>>
  ): Promise<string> {
    if (!result.compatible || !result.license) {
      return '';
    }

    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return '';

    const [, owner, repo] = match;
    const repoName = repo.replace(/\.git$/, '');

    const template = `
### ${repoName}

- **Source:** ${repoUrl}
- **License:** ${result.license.spdxId}
- **Used for:** [DESCRIPTION NEEDED]
- **Integration method:** [Subtree / Adapter / Dependency]

\`\`\`
${result.details.content || ''}
\`\`\`

---
`.trim();

    return template;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(chalk.bold.cyan('License Verification Tool\n'));
    console.log('Usage: npm run verify:license -- <github-repo-url>');
    console.log('\nExample:');
    console.log('  npm run verify:license -- https://github.com/owner/repo\n');
    process.exit(0);
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error(chalk.red('❌ GITHUB_TOKEN environment variable required'));
    console.log(chalk.yellow('\nGet a token at: https://github.com/settings/tokens'));
    console.log(chalk.yellow('Then run: export GITHUB_TOKEN=your_token\n'));
    process.exit(1);
  }

  const repoUrl = args[0];
  const verifier = new LicenseVerifier();

  try {
    const result = await verifier.verifyRepository(repoUrl);
    verifier.displayResults(result);

    // Generate attribution template if compatible
    if (result.compatible && args.includes('--template')) {
      const template = await verifier.generateAttributionTemplate(repoUrl, result);
      const fs = await import('fs/promises');
      await fs.appendFile('./THIRD_PARTY_NOTICES.md', '\n\n' + template);
      console.log(chalk.green('✅ Attribution template added to THIRD_PARTY_NOTICES.md\n'));
    }

    process.exit(result.compatible ? 0 : 1);
  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { LicenseVerifier };
