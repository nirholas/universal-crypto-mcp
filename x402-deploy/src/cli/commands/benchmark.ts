/**
 * Benchmark Command - Performance testing for monetized APIs
 * Load testing with payment simulation
 */

import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import path from "path";
import { X402ConfigSchema, X402Config } from "../../types/config.js";

interface BenchmarkOptions {
  url?: string;
  requests?: string;
  concurrency?: string;
  duration?: string;
  route?: string;
}

interface BenchmarkResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalDuration: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  requestsPerSecond: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  paymentOverhead: number;
}

export async function benchmarkCommand(options: BenchmarkOptions): Promise<void> {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════════╗
║   ⚡ x402 Performance Benchmark                               ║
╚═══════════════════════════════════════════════════════════════╝
  `));

  const configPath = path.join(process.cwd(), "x402.config.json");
  
  if (!await fs.pathExists(configPath)) {
    console.error(chalk.red("No x402.config.json found. Run 'x402-deploy init' first."));
    process.exit(1);
  }

  let config: X402Config;
  try {
    const rawConfig = await fs.readJSON(configPath);
    config = X402ConfigSchema.parse(rawConfig);
  } catch (error) {
    console.error(chalk.red(`Failed to load configuration: ${error}`));
    process.exit(1);
  }

  const targetUrl = options.url || "http://localhost:3402";
  const totalRequests = parseInt(options.requests || "100", 10);
  const concurrency = parseInt(options.concurrency || "10", 10);
  const testRoute = options.route || "/api/test";

  console.log(chalk.bold("\n📋 Test Configuration:\n"));
  console.log(`  Target:       ${chalk.cyan(targetUrl + testRoute)}`);
  console.log(`  Requests:     ${chalk.white(totalRequests.toLocaleString())}`);
  console.log(`  Concurrency:  ${chalk.white(concurrency.toString())}`);
  console.log(`  With Payment: ${chalk.green("Yes")}`);

  console.log(chalk.bold("\n🔄 Running Benchmark...\n"));

  const spinner = ora("Warming up...").start();

  // Warmup request
  try {
    await fetch(targetUrl + testRoute);
    spinner.succeed("Warmup complete");
  } catch (error) {
    spinner.fail("Could not reach server");
    console.error(chalk.red(`\nError: ${error}\n`));
    process.exit(1);
  }

  // Run benchmark without payment
  spinner.start("Testing without payment...");
  const baselineResult = await runLoadTest(targetUrl + testRoute, totalRequests, concurrency, false);
  spinner.succeed(`Baseline: ${baselineResult.requestsPerSecond.toFixed(2)} req/s`);

  // Run benchmark with payment
  spinner.start("Testing with x402 payment...");
  const withPaymentResult = await runLoadTest(targetUrl + testRoute, totalRequests, concurrency, true);
  spinner.succeed(`With payment: ${withPaymentResult.requestsPerSecond.toFixed(2)} req/s`);

  // Display results
  console.log(chalk.bold("\n📊 Benchmark Results:\n"));

  displayResultComparison(baselineResult, withPaymentResult);

  // Detailed stats
  console.log(chalk.bold("\n📈 Latency Percentiles (ms):\n"));
  displayLatencyTable(baselineResult, withPaymentResult);

  // Performance analysis
  console.log(chalk.bold("\n💡 Analysis:\n"));
  analyzePerformance(baselineResult, withPaymentResult);

  console.log();
}

async function runLoadTest(
  url: string,
  totalRequests: number,
  concurrency: number,
  includePayment: boolean
): Promise<BenchmarkResult> {
  const results: number[] = [];
  const startTime = Date.now();
  let successCount = 0;
  let failCount = 0;

  const batches = Math.ceil(totalRequests / concurrency);

  for (let batch = 0; batch < batches; batch++) {
    const batchSize = Math.min(concurrency, totalRequests - batch * concurrency);
    const promises: Promise<number>[] = [];

    for (let i = 0; i < batchSize; i++) {
      promises.push(
        (async () => {
          const reqStart = Date.now();
          try {
            const headers: HeadersInit = includePayment
              ? { "x-payment": generateMockPayment() }
              : {};

            const response = await fetch(url, {
              headers,
              signal: AbortSignal.timeout(10000),
            });

            if (response.ok || response.status === 402) {
              successCount++;
              return Date.now() - reqStart;
            } else {
              failCount++;
              return -1;
            }
          } catch {
            failCount++;
            return -1;
          }
        })()
      );
    }

    const batchResults = await Promise.all(promises);
    results.push(...batchResults.filter(r => r > 0));
  }

  const totalDuration = Date.now() - startTime;
  const validResults = results.filter(r => r > 0);
  
  validResults.sort((a, b) => a - b);

  return {
    totalRequests,
    successfulRequests: successCount,
    failedRequests: failCount,
    totalDuration,
    avgLatency: validResults.reduce((a, b) => a + b, 0) / validResults.length,
    minLatency: validResults[0] || 0,
    maxLatency: validResults[validResults.length - 1] || 0,
    requestsPerSecond: (successCount / totalDuration) * 1000,
    p50Latency: validResults[Math.floor(validResults.length * 0.5)] || 0,
    p95Latency: validResults[Math.floor(validResults.length * 0.95)] || 0,
    p99Latency: validResults[Math.floor(validResults.length * 0.99)] || 0,
    paymentOverhead: 0,
  };
}

function displayResultComparison(baseline: BenchmarkResult, withPayment: BenchmarkResult): void {
  const overheadPercent = ((withPayment.avgLatency - baseline.avgLatency) / baseline.avgLatency) * 100;
  withPayment.paymentOverhead = overheadPercent;

  console.log(`  ${chalk.dim("Metric".padEnd(25))} ${chalk.dim("Baseline".padEnd(15))} ${chalk.dim("With Payment".padEnd(15))} ${chalk.dim("Overhead")}`);
  console.log(`  ${chalk.dim("─".repeat(70))}`);
  
  console.log(`  ${"Requests/sec".padEnd(25)} ${chalk.cyan(baseline.requestsPerSecond.toFixed(2).padEnd(15))} ${chalk.green(withPayment.requestsPerSecond.toFixed(2).padEnd(15))} ${formatOverhead(overheadPercent)}`);
  console.log(`  ${"Avg Latency (ms)".padEnd(25)} ${chalk.cyan(baseline.avgLatency.toFixed(2).padEnd(15))} ${chalk.green(withPayment.avgLatency.toFixed(2).padEnd(15))} ${formatOverhead(overheadPercent)}`);
  console.log(`  ${"Success Rate".padEnd(25)} ${chalk.cyan((baseline.successfulRequests / baseline.totalRequests * 100).toFixed(1) + "%").padEnd(15)} ${chalk.green((withPayment.successfulRequests / withPayment.totalRequests * 100).toFixed(1) + "%").padEnd(15)}`);
}

function displayLatencyTable(baseline: BenchmarkResult, withPayment: BenchmarkResult): void {
  console.log(`  ${chalk.dim("Percentile".padEnd(15))} ${chalk.dim("Baseline".padEnd(15))} ${chalk.dim("With Payment")}`);
  console.log(`  ${chalk.dim("─".repeat(45))}`);
  
  console.log(`  ${"Min".padEnd(15)} ${chalk.cyan(baseline.minLatency.toFixed(2) + " ms").padEnd(15)} ${chalk.green(withPayment.minLatency.toFixed(2) + " ms")}`);
  console.log(`  ${"P50 (median)".padEnd(15)} ${chalk.cyan(baseline.p50Latency.toFixed(2) + " ms").padEnd(15)} ${chalk.green(withPayment.p50Latency.toFixed(2) + " ms")}`);
  console.log(`  ${"P95".padEnd(15)} ${chalk.cyan(baseline.p95Latency.toFixed(2) + " ms").padEnd(15)} ${chalk.green(withPayment.p95Latency.toFixed(2) + " ms")}`);
  console.log(`  ${"P99".padEnd(15)} ${chalk.cyan(baseline.p99Latency.toFixed(2) + " ms").padEnd(15)} ${chalk.green(withPayment.p99Latency.toFixed(2) + " ms")}`);
  console.log(`  ${"Max".padEnd(15)} ${chalk.cyan(baseline.maxLatency.toFixed(2) + " ms").padEnd(15)} ${chalk.green(withPayment.maxLatency.toFixed(2) + " ms")}`);
}

function analyzePerformance(baseline: BenchmarkResult, withPayment: BenchmarkResult): void {
  const insights: string[] = [];

  // Overhead analysis
  if (withPayment.paymentOverhead < 10) {
    insights.push(`${chalk.green("✓")} Excellent: Payment overhead is minimal (${withPayment.paymentOverhead.toFixed(1)}%)`);
  } else if (withPayment.paymentOverhead < 25) {
    insights.push(`${chalk.yellow("⚠")} Good: Payment overhead is acceptable (${withPayment.paymentOverhead.toFixed(1)}%)`);
  } else {
    insights.push(`${chalk.red("!")} High: Payment overhead may impact UX (${withPayment.paymentOverhead.toFixed(1)}%)`);
  }

  // Throughput analysis
  if (withPayment.requestsPerSecond > 100) {
    insights.push(`${chalk.green("✓")} High throughput: ${withPayment.requestsPerSecond.toFixed(0)} req/s`);
  } else if (withPayment.requestsPerSecond > 50) {
    insights.push(`${chalk.yellow("⚠")} Moderate throughput: ${withPayment.requestsPerSecond.toFixed(0)} req/s`);
  } else {
    insights.push(`${chalk.yellow("⚠")} Consider optimizing: ${withPayment.requestsPerSecond.toFixed(0)} req/s`);
  }

  // Success rate
  const successRate = (withPayment.successfulRequests / withPayment.totalRequests) * 100;
  if (successRate >= 99) {
    insights.push(`${chalk.green("✓")} Excellent reliability: ${successRate.toFixed(1)}% success rate`);
  } else if (successRate >= 95) {
    insights.push(`${chalk.yellow("⚠")} Good reliability: ${successRate.toFixed(1)}% success rate`);
  } else {
    insights.push(`${chalk.red("!")} Check for errors: ${successRate.toFixed(1)}% success rate`);
  }

  // Latency consistency
  const latencySpread = withPayment.p99Latency - withPayment.p50Latency;
  if (latencySpread < withPayment.avgLatency * 2) {
    insights.push(`${chalk.green("✓")} Consistent latency: P99-P50 spread is ${latencySpread.toFixed(0)}ms`);
  } else {
    insights.push(`${chalk.yellow("⚠")} Variable latency: P99-P50 spread is ${latencySpread.toFixed(0)}ms`);
  }

  for (const insight of insights) {
    console.log(`  ${insight}`);
  }
}

function formatOverhead(percent: number): string {
  if (percent < 10) return chalk.green(`+${percent.toFixed(1)}%`);
  if (percent < 25) return chalk.yellow(`+${percent.toFixed(1)}%`);
  return chalk.red(`+${percent.toFixed(1)}%`);
}

function generateMockPayment(): string {
  // Generate a mock payment header for testing
  return "mock_payment_" + Math.random().toString(36).substring(7);
}
