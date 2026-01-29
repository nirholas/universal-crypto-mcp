#!/usr/bin/env tsx
/**
 * Performance benchmark script for x402-deploy
 * Tests API throughput, latency, and cache performance
 * 
 * Run with: pnpm tsx scripts/benchmark.ts [url] [duration] [connections]
 * Example: pnpm tsx scripts/benchmark.ts http://localhost:3402/api/status 10 100
 * 
 * @author nich
 * @github github.com/nirholas
 * @license Apache-2.0
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const process: { argv: string[]; version: string; platform: string; arch: string };

interface BenchmarkResult {
  name: string;
  requests: number;
  duration: number;
  rps: number;
  latency: {
    min: number;
    max: number;
    avg: number;
    p50: number;
    p95: number;
    p99: number;
  };
  errors: number;
  throughputBytes: number;
}

interface BenchmarkConfig {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  duration?: number; // seconds
  connections?: number;
  warmup?: number; // warmup requests
}

/**
 * Calculate percentile from sorted array
 */
function percentile(sorted: number[], p: number): number {
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Run HTTP benchmark using fetch API
 */
async function runBenchmark(config: BenchmarkConfig): Promise<BenchmarkResult> {
  const {
    url,
    method = 'GET',
    headers = {},
    body,
    duration = 10,
    connections = 50,
    warmup = 5,
  } = config;

  const parsedUrl = new URL(url);
  const latencies: number[] = [];
  let requests = 0;
  let errors = 0;
  let throughputBytes = 0;
  let running = true;

  // Single request function using fetch
  const makeRequest = async (): Promise<{ latency: number; bytes: number; error: boolean }> => {
    const start = Date.now();
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body || undefined,
      });

      const text = await response.text();
      const latency = Date.now() - start;
      
      return {
        latency,
        bytes: text.length,
        error: response.status >= 400
      };
    } catch {
      return {
        latency: Date.now() - start,
        bytes: 0,
        error: true
      };
    }
  };

  // Warmup phase
  console.log(`  Warming up with ${warmup} requests...`);
  for (let i = 0; i < warmup; i++) {
    await makeRequest();
  }

  // Benchmark phase
  console.log(`  Running benchmark for ${duration}s with ${connections} concurrent connections...`);
  const startTime = Date.now();
  const endTime = startTime + duration * 1000;

  // Worker function
  const worker = async () => {
    while (running && Date.now() < endTime) {
      const result = await makeRequest();
      requests++;
      latencies.push(result.latency);
      throughputBytes += result.bytes;
      if (result.error) errors++;
    }
  };

  // Run concurrent workers
  const workers = Array.from({ length: connections }, () => worker());
  
  // Wait for duration
  await new Promise((resolve) => setTimeout(resolve, duration * 1000));
  running = false;
  
  // Wait for all workers to finish
  await Promise.all(workers);

  const totalDuration = (Date.now() - startTime) / 1000;

  // Calculate stats
  latencies.sort((a, b) => a - b);
  const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;

  return {
    name: `${method} ${parsedUrl.pathname}`,
    requests,
    duration: totalDuration,
    rps: requests / totalDuration,
    latency: {
      min: latencies[0] || 0,
      max: latencies[latencies.length - 1] || 0,
      avg: avgLatency,
      p50: percentile(latencies, 50),
      p95: percentile(latencies, 95),
      p99: percentile(latencies, 99),
    },
    errors,
    throughputBytes,
  };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Print benchmark results
 */
function printResults(result: BenchmarkResult): void {
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Benchmark Results: ${result.name}`);
  console.log('='.repeat(60));
  
  console.log('\n📈 Throughput:');
  console.log(`   Requests:     ${result.requests.toLocaleString()}`);
  console.log(`   Duration:     ${result.duration.toFixed(2)}s`);
  console.log(`   RPS:          ${result.rps.toFixed(2)} req/s`);
  console.log(`   Data:         ${formatBytes(result.throughputBytes)}`);
  console.log(`   Throughput:   ${formatBytes(result.throughputBytes / result.duration)}/s`);
  
  console.log('\n⏱️  Latency:');
  console.log(`   Min:          ${result.latency.min.toFixed(2)}ms`);
  console.log(`   Max:          ${result.latency.max.toFixed(2)}ms`);
  console.log(`   Avg:          ${result.latency.avg.toFixed(2)}ms`);
  console.log(`   P50:          ${result.latency.p50.toFixed(2)}ms`);
  console.log(`   P95:          ${result.latency.p95.toFixed(2)}ms`);
  console.log(`   P99:          ${result.latency.p99.toFixed(2)}ms`);
  
  console.log('\n❌ Errors:');
  console.log(`   Total:        ${result.errors}`);
  console.log(`   Rate:         ${((result.errors / result.requests) * 100).toFixed(2)}%`);
  
  console.log('\n' + '='.repeat(60));
}

/**
 * Test cache performance
 */
async function benchmarkCache(): Promise<void> {
  console.log('\n🔄 Testing Cache Performance...\n');
  
  // Import the cache
  const { PaymentCache } = await import('../src/gateway/cache.js');
  const cache = new PaymentCache({ maxSize: 10000, ttl: 300000 });
  
  const iterations = 100000;
  
  // Test write performance
  console.log(`  Writing ${iterations.toLocaleString()} entries...`);
  const writeStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    cache.set(`proof_${i}`, { valid: true, payer: `0x${i.toString(16).padStart(40, '0')}` });
  }
  const writeTime = Date.now() - writeStart;
  
  // Test read performance (hits)
  console.log(`  Reading ${iterations.toLocaleString()} entries (cache hits)...`);
  const readHitStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    cache.get(`proof_${i}`);
  }
  const readHitTime = Date.now() - readHitStart;
  
  // Test read performance (misses)
  console.log(`  Reading ${iterations.toLocaleString()} entries (cache misses)...`);
  const readMissStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    cache.get(`nonexistent_${i}`);
  }
  const readMissTime = Date.now() - readMissStart;
  
  const stats = cache.getStats();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Cache Benchmark Results');
  console.log('='.repeat(60));
  console.log(`\n   Write Performance:`);
  console.log(`     Time:       ${writeTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${((iterations / writeTime) * 1000).toFixed(0).toLocaleString()}`);
  console.log(`     Per-op:     ${(writeTime / iterations * 1000).toFixed(3)}µs`);
  
  console.log(`\n   Read (Hit) Performance:`);
  console.log(`     Time:       ${readHitTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${((iterations / readHitTime) * 1000).toFixed(0).toLocaleString()}`);
  console.log(`     Per-op:     ${(readHitTime / iterations * 1000).toFixed(3)}µs`);
  
  console.log(`\n   Read (Miss) Performance:`);
  console.log(`     Time:       ${readMissTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${((iterations / readMissTime) * 1000).toFixed(0).toLocaleString()}`);
  console.log(`     Per-op:     ${(readMissTime / iterations * 1000).toFixed(3)}µs`);
  
  console.log(`\n   Cache Stats:`);
  console.log(`     Size:       ${stats.size.toLocaleString()}`);
  console.log(`     Hit Rate:   ${(stats.hitRate * 100).toFixed(2)}%`);
  console.log(`     Hits:       ${stats.hits.toLocaleString()}`);
  console.log(`     Misses:     ${stats.misses.toLocaleString()}`);
  console.log('\n' + '='.repeat(60));
  
  cache.destroy();
}

/**
 * Test security middleware performance
 */
async function benchmarkSecurity(): Promise<void> {
  console.log('\n🔒 Testing Security Utilities Performance...\n');
  
  const { sanitizeInput, sanitizeObject, isValidAddress, isValidTxHash } = await import('../src/utils/security.js');
  
  const iterations = 100000;
  
  // Test sanitizeInput
  const testString = '<script>alert("xss")</script>Hello World! This is a test string with <html> tags.';
  console.log(`  Sanitizing ${iterations.toLocaleString()} strings...`);
  const sanitizeStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    sanitizeInput(testString);
  }
  const sanitizeTime = Date.now() - sanitizeStart;
  
  // Test address validation
  const testAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f7fAcE';
  console.log(`  Validating ${iterations.toLocaleString()} addresses...`);
  const addressStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    isValidAddress(testAddress);
  }
  const addressTime = Date.now() - addressStart;
  
  // Test tx hash validation
  const testHash = '0x' + 'a'.repeat(64);
  console.log(`  Validating ${iterations.toLocaleString()} tx hashes...`);
  const hashStart = Date.now();
  for (let i = 0; i < iterations; i++) {
    isValidTxHash(testHash);
  }
  const hashTime = Date.now() - hashStart;
  
  // Test object sanitization
  const testObj = {
    name: '<script>test</script>',
    address: testAddress,
    nested: { value: 'hello<br>world' }
  };
  console.log(`  Sanitizing ${(iterations / 10).toLocaleString()} objects...`);
  const objStart = Date.now();
  for (let i = 0; i < iterations / 10; i++) {
    sanitizeObject(testObj);
  }
  const objTime = Date.now() - objStart;
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Security Benchmark Results');
  console.log('='.repeat(60));
  console.log(`\n   String Sanitization:`);
  console.log(`     Time:       ${sanitizeTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${((iterations / sanitizeTime) * 1000).toFixed(0).toLocaleString()}`);
  
  console.log(`\n   Address Validation:`);
  console.log(`     Time:       ${addressTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${((iterations / addressTime) * 1000).toFixed(0).toLocaleString()}`);
  
  console.log(`\n   TX Hash Validation:`);
  console.log(`     Time:       ${hashTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${((iterations / hashTime) * 1000).toFixed(0).toLocaleString()}`);
  
  console.log(`\n   Object Sanitization:`);
  console.log(`     Time:       ${objTime.toFixed(2)}ms`);
  console.log(`     Ops/sec:    ${(((iterations / 10) / objTime) * 1000).toFixed(0).toLocaleString()}`);
  console.log('\n' + '='.repeat(60));
}

/**
 * Main benchmark entry point
 */
async function main(): Promise<void> {
  console.log('\n🚀 Universal Crypto MCP Performance Benchmark');
  console.log('='.repeat(60));
  console.log(`Date: ${new Date().toISOString()}`);
  console.log(`Node: ${process.version}`);
  console.log(`Platform: ${process.platform} ${process.arch}`);
  console.log('='.repeat(60));
  
  const args = process.argv.slice(2);
  const targetUrl = args[0];
  
  // Always run internal benchmarks
  await benchmarkCache();
  await benchmarkSecurity();
  
  // Run HTTP benchmark if URL provided
  if (targetUrl) {
    console.log(`\n🌐 HTTP Benchmark: ${targetUrl}`);
    
    try {
      const result = await runBenchmark({
        url: targetUrl,
        duration: parseInt(args[1]) || 10,
        connections: parseInt(args[2]) || 100,
      });
      printResults(result);
    } catch (error) {
      console.error(`\n❌ Failed to benchmark ${targetUrl}:`);
      console.error(error instanceof Error ? error.message : error);
      console.log('\nMake sure the server is running and accessible.');
    }
  } else {
    console.log('\n💡 Tip: Run with a URL to benchmark HTTP endpoints:');
    console.log('   pnpm tsx scripts/benchmark.ts http://localhost:3402/api/status [duration] [connections]');
  }
  
  console.log('\n✅ Benchmark complete!\n');
}

main().catch(console.error);
