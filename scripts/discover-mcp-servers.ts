#!/usr/bin/env node
/**
 * MCP Server Discovery Tool
 * 
 * Finds high-quality MCP servers in the crypto/web3/defi space
 * that can be integrated with proper attribution.
 */

import { Octokit } from '@octokit/rest';
import chalk from 'chalk';
import ora from 'ora';

interface MCPServer {
  name: string;
  fullName: string;
  url: string;
  description: string;
  stars: number;
  forks: number;
  license: string | null;
  lastUpdate: string;
  topics: string[];
  language: string;
}

const REQUIRED_TOPICS = ['mcp', 'model-context-protocol', 'mcp-server'];
const CRYPTO_TOPICS = [
  'cryptocurrency',
  'web3',
  'defi',
  'ethereum',
  'blockchain',
  'bitcoin',
  'solana',
  'polygon',
  'crypto',
  'trading',
  'dex',
  'nft',
  'smart-contracts'
];

const COMPATIBLE_LICENSES = [
  'MIT',
  'Apache-2.0',
  'BSD-2-Clause',
  'BSD-3-Clause',
  'ISC'
];

class MCPDiscovery {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    this.octokit = new Octokit(token ? { auth: token } : {});
    
    if (!token) {
      console.log(chalk.yellow('⚠️  Running without GITHUB_TOKEN - rate limited to 60 requests/hour'));
    }
  }

  async discoverServers(options: {
    minStars?: number;
    minActivity?: number; // days
    topics?: string[];
  } = {}): Promise<MCPServer[]> {
    const spinner = ora('Searching GitHub for MCP servers...').start();
    
    const {
      minStars = 10,
      minActivity = 180, // 6 months
      topics = CRYPTO_TOPICS
    } = options;

    const servers: MCPServer[] = [];

    try {
      // Search for repos with MCP + crypto topics
      for (const cryptoTopic of topics) {
        const query = `topic:mcp topic:${cryptoTopic} stars:>=${minStars}`;
        
        spinner.text = `Searching: ${cryptoTopic}...`;

        const { data } = await this.octokit.search.repos({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: 100
        });

        for (const repo of data.items) {
          // Check last update
          const lastUpdate = new Date(repo.updated_at);
          const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceUpdate > minActivity) {
            continue;
          }

          // Check license
          const license = repo.license?.spdx_id || null;
          if (!license || !COMPATIBLE_LICENSES.includes(license)) {
            continue;
          }

          servers.push({
            name: repo.name,
            fullName: repo.full_name,
            url: repo.html_url,
            description: repo.description || 'No description',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            license,
            lastUpdate: repo.updated_at,
            topics: repo.topics || [],
            language: repo.language || 'Unknown'
          });
        }
      }

      // Also search for "crypto mcp server"
      const { data } = await this.octokit.search.repos({
        q: `"mcp server" crypto OR web3 OR defi stars:>=${minStars}`,
        sort: 'stars',
        order: 'desc',
        per_page: 50
      });

      for (const repo of data.items) {
        const lastUpdate = new Date(repo.updated_at);
        const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        
        if (daysSinceUpdate > minActivity) continue;

        const license = repo.license?.spdx_id || null;
        if (!license || !COMPATIBLE_LICENSES.includes(license)) continue;

        // Avoid duplicates
        if (servers.some(s => s.fullName === repo.full_name)) continue;

        servers.push({
          name: repo.name,
          fullName: repo.full_name,
          url: repo.html_url,
          description: repo.description || 'No description',
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          license,
          lastUpdate: repo.updated_at,
          topics: repo.topics || [],
          language: repo.language || 'Unknown'
        });
      }

      spinner.succeed(`Found ${servers.length} compatible MCP servers`);
      
      // Sort by stars
      servers.sort((a, b) => b.stars - a.stars);

      return servers;
    } catch (error) {
      spinner.fail('Search failed');
      throw error;
    }
  }

  async getRepoDetails(fullName: string): Promise<any> {
    const [owner, repo] = fullName.split('/');
    
    const { data } = await this.octokit.repos.get({
      owner,
      repo
    });

    // Get contributors
    const { data: contributors } = await this.octokit.repos.listContributors({
      owner,
      repo,
      per_page: 10
    });

    // Get recent commits
    const { data: commits } = await this.octokit.repos.listCommits({
      owner,
      repo,
      per_page: 10
    });

    return {
      ...data,
      contributors,
      recentCommits: commits
    };
  }

  displayResults(servers: MCPServer[]): void {
    console.log(chalk.bold.blue('\n🔍 Discovered MCP Servers\n'));
    console.log(chalk.gray('─'.repeat(80)));

    for (const server of servers) {
      console.log(chalk.bold.green(`\n${server.name}`));
      console.log(chalk.gray(server.fullName));
      console.log(chalk.white(server.description));
      console.log();
      console.log(chalk.yellow('  ⭐'), server.stars, '  ', chalk.yellow('🔱'), server.forks);
      console.log(chalk.blue('  📜 License:'), server.license);
      console.log(chalk.cyan('  💻 Language:'), server.language);
      console.log(chalk.magenta('  🔗'), server.url);
      
      if (server.topics.length > 0) {
        console.log(chalk.gray('  Topics:'), server.topics.slice(0, 5).join(', '));
      }
      
      const daysSince = Math.floor(
        (Date.now() - new Date(server.lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
      );
      console.log(chalk.gray(`  Updated: ${daysSince} days ago`));
    }

    console.log(chalk.gray('\n' + '─'.repeat(80)));
    console.log(chalk.bold(`\nTotal: ${servers.length} servers\n`));
  }

  async generateIntegrationReport(servers: MCPServer[]): Promise<string> {
    let report = '# MCP Server Integration Candidates\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;
    report += '## Summary\n\n';
    report += `Found ${servers.length} compatible MCP servers for potential integration.\n\n`;
    report += '### Criteria Used\n\n';
    report += '- ✅ Compatible license (MIT, Apache 2.0, BSD)\n';
    report += '- ✅ Active development (updated within 6 months)\n';
    report += '- ✅ Crypto/Web3/DeFi related\n';
    report += '- ✅ Minimum community traction\n\n';
    report += '---\n\n';

    for (const server of servers) {
      report += `## ${server.name}\n\n`;
      report += `**Repository:** [${server.fullName}](${server.url})\n\n`;
      report += `**Description:** ${server.description}\n\n`;
      report += '**Stats:**\n';
      report += `- ⭐ Stars: ${server.stars}\n`;
      report += `- 🔱 Forks: ${server.forks}\n`;
      report += `- 📜 License: ${server.license}\n`;
      report += `- 💻 Language: ${server.language}\n`;
      report += `- 📅 Last Updated: ${server.lastUpdate}\n\n`;
      
      if (server.topics.length > 0) {
        report += `**Topics:** ${server.topics.join(', ')}\n\n`;
      }

      report += '**Integration Recommendation:**\n\n';
      report += '```bash\n';
      report += `# Method 1: Add as subtree\n`;
      report += `git subtree add --prefix=packages/integrations/${server.name} \\\n`;
      report += `  ${server.url} main --squash\n\n`;
      report += `# Method 2: Add as dependency\n`;
      report += `pnpm add ${server.fullName.replace('/', '-')}\n`;
      report += '```\n\n';
      report += '**Attribution Required:**\n\n';
      report += `- Add to [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)\n`;
      report += `- Include original license and copyright\n`;
      report += `- Document in integration docs\n\n`;
      report += '---\n\n';
    }

    report += '## Next Steps\n\n';
    report += '1. Review each candidate manually\n';
    report += '2. Check code quality and tests\n';
    report += '3. Verify license compliance\n';
    report += '4. Plan integration approach\n';
    report += '5. Add proper attribution\n';
    report += '6. Contribute back improvements\n\n';

    return report;
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);

  const discovery = new MCPDiscovery();

  const options: any = {};
  
  // Parse arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--min-stars') {
      options.minStars = parseInt(args[++i]);
    } else if (args[i] === '--topic') {
      options.topics = [args[++i]];
    } else if (args[i] === '--report') {
      options.generateReport = true;
    }
  }

  try {
    const servers = await discovery.discoverServers(options);
    
    discovery.displayResults(servers);

    if (options.generateReport || args.includes('--report')) {
      const report = await discovery.generateIntegrationReport(servers);
      const fs = await import('fs/promises');
      await fs.writeFile('./INTEGRATION_CANDIDATES.md', report);
      console.log(chalk.green('✅ Report saved to INTEGRATION_CANDIDATES.md\n'));
    }

    console.log(chalk.bold.cyan('\n📚 Next Steps:\n'));
    console.log(chalk.white('1. Review candidates in INTEGRATION_CANDIDATES.md'));
    console.log(chalk.white('2. Verify licenses: npm run verify:license -- <repo-url>'));
    console.log(chalk.white('3. Add integration: npm run add:subtree -- <repo-url> <name>'));
    console.log(chalk.white('4. Update attributions: npm run update:attributions\n'));

  } catch (error: any) {
    console.error(chalk.red('❌ Error:'), error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { MCPDiscovery };
