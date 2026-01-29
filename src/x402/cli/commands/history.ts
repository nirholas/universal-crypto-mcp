/* history.ts | nichxbt | 0xN1CH */

/**
 * x402 CLI - History Command
 * @description View payment history
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import Table from 'cli-table3';
import { loadX402Config, isEvmConfigured, SUPPORTED_CHAINS, type X402Network } from '../../config.js';
import { X402Client } from '../../sdk/client.js';
import type { X402Chain } from '../../sdk/types.js';
import { formatUSD, formatDate, shortenAddress, formatTxLink } from '../utils/format.js';

interface HistoryOptions {
  limit?: string;
  chain?: string;
  sent?: boolean;
  received?: boolean;
  json?: boolean;
}

export const historyCommand = new Command('history')
  .description('View payment history')
  .option('-n, --limit <number>', 'Number of transactions to show', '10')
  .option('-c, --chain <chain>', 'Filter by chain')
  .option('--sent', 'Show only sent payments')
  .option('--received', 'Show only received payments')
  .option('--json', 'Output as JSON')
  .action(async (options: HistoryOptions) => {
    const config = loadX402Config();

    if (!isEvmConfigured()) {
      console.log(chalk.red('\n❌ Wallet not configured\n'));
      console.log(chalk.white('Set your private key:'));
      console.log(chalk.cyan('  export X402_EVM_PRIVATE_KEY=0x...\n'));
      process.exit(1);
    }

    const spinner = ora('Fetching payment history...').start();

    try {
      const chain = (options.chain || config.defaultChain || 'base-sepolia') as X402Chain;
      const chainConfig = SUPPORTED_CHAINS[chain as X402Network];

      if (!chainConfig) {
        spinner.fail(`Unknown chain: ${chain}`);
        process.exit(1);
      }

      const client = new X402Client({
        chain,
        privateKey: config.evmPrivateKey,
      });

      const address = await client.getAddress();

      // Note: In a real implementation, this would query blockchain events
      // or a database of payment records. For now, we'll show a placeholder.
      spinner.text = 'Querying blockchain events...';

      // Simulated history data - in production this would come from:
      // 1. Indexed blockchain events
      // 2. Local payment database
      // 3. The facilitator's API
      const history = await getPaymentHistory(client, address, {
        limit: parseInt(options.limit || '10'),
        direction: options.sent ? 'sent' : options.received ? 'received' : 'all',
      });

      spinner.stop();

      if (options.json) {
        console.log(JSON.stringify(history, null, 2));
        return;
      }

      console.log(chalk.cyan('\n📜 Payment History\n'));
      console.log(chalk.gray(`  Wallet: ${shortenAddress(address)}`));
      console.log(chalk.gray(`  Chain:  ${chainConfig.name}\n`));

      if (history.length === 0) {
        console.log(chalk.yellow('  No payment history found.\n'));
        console.log(chalk.gray('  Make your first payment with:'));
        console.log(chalk.gray('    x402 send <address> <amount>\n'));
        return;
      }

      // Create table
      const table = new Table({
        head: [
          chalk.cyan('Date'),
          chalk.cyan('Type'),
          chalk.cyan('Amount'),
          chalk.cyan('To/From'),
          chalk.cyan('Status'),
        ],
        style: {
          head: [],
          border: ['gray'],
        },
        colWidths: [20, 10, 15, 18, 12],
      });

      let totalSent = 0;
      let totalReceived = 0;

      for (const tx of history) {
        const isSent = tx.direction === 'sent';
        const amount = parseFloat(tx.amount);
        
        if (isSent) {
          totalSent += amount;
        } else {
          totalReceived += amount;
        }

        table.push([
          formatDate(tx.timestamp),
          isSent ? chalk.red('↑ Sent') : chalk.green('↓ Recv'),
          isSent ? chalk.red(`-${formatUSD(tx.amount)}`) : chalk.green(`+${formatUSD(tx.amount)}`),
          shortenAddress(isSent ? tx.to : tx.from),
          tx.status === 'confirmed' ? chalk.green('✓') : chalk.yellow('⏳'),
        ]);
      }

      console.log(table.toString());

      // Summary
      console.log(chalk.gray('\n  Summary:'));
      console.log(chalk.red(`    Sent:     ${formatUSD(totalSent.toFixed(2))}`));
      console.log(chalk.green(`    Received: ${formatUSD(totalReceived.toFixed(2))}`));
      console.log(chalk.white(`    Net:      ${formatUSD((totalReceived - totalSent).toFixed(2))}`));
      console.log();

    } catch (error) {
      spinner.fail('Failed to fetch history');
      console.error(chalk.red(`\nError: ${error instanceof Error ? error.message : error}\n`));
      process.exit(1);
    }
  });

interface PaymentRecord {
  hash: string;
  timestamp: Date;
  direction: 'sent' | 'received';
  amount: string;
  token: string;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  description?: string;
}

async function getPaymentHistory(
  client: X402Client,
  address: string,
  options: { limit: number; direction: 'sent' | 'received' | 'all' }
): Promise<PaymentRecord[]> {
  // Query Transfer events from the token contract
  const records: PaymentRecord[] = [];
  
  try {
    const publicClient = client.getPublicClient();
    const tokenAddress = client.getTokenAddress();
    
    if (!publicClient || !tokenAddress) {
      return records;
    }

    // ERC20 Transfer event signature
    const transferEventSig = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    
    // Get recent block range (last ~10000 blocks)
    const latestBlock = await publicClient.getBlockNumber();
    const fromBlock = latestBlock > 10000n ? latestBlock - 10000n : 0n;

    // Query logs
    const logs = await publicClient.getLogs({
      address: tokenAddress,
      event: {
        type: 'event',
        name: 'Transfer',
        inputs: [
          { type: 'address', name: 'from', indexed: true },
          { type: 'address', name: 'to', indexed: true },
          { type: 'uint256', name: 'value', indexed: false },
        ],
      },
      fromBlock,
      toBlock: 'latest',
    });

    // Filter and process logs
    const addressLower = address.toLowerCase();
    
    for (const log of logs) {
      const from = log.args.from as string;
      const to = log.args.to as string;
      const value = log.args.value as bigint;
      
      const fromLower = from.toLowerCase();
      const toLower = to.toLowerCase();
      
      // Check if this transaction involves our address
      const isSent = fromLower === addressLower;
      const isReceived = toLower === addressLower;
      
      if (!isSent && !isReceived) continue;
      
      // Apply direction filter
      if (options.direction === 'sent' && !isSent) continue;
      if (options.direction === 'received' && !isReceived) continue;

      // Get block for timestamp
      const block = await publicClient.getBlock({ blockNumber: log.blockNumber });
      
      // Format amount (assuming 6 decimals for USDC/USDS)
      const amount = (Number(value) / 1e6).toFixed(2);

      records.push({
        hash: log.transactionHash,
        timestamp: new Date(Number(block.timestamp) * 1000),
        direction: isSent ? 'sent' : 'received',
        amount,
        token: 'USDC',
        from,
        to,
        status: 'confirmed',
      });

      // Respect limit
      if (records.length >= options.limit) break;
    }
  } catch (error) {
    // Log error but return empty array rather than failing
    console.error('Error fetching history:', error);
  }
  
  // Sort by timestamp descending (newest first)
  records.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  
  return records.slice(0, options.limit);
}


/* ucm:n1ch0a8a5074 */