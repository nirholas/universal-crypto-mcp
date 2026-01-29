/**
 * Cache utility examples
 * Demonstrates caching with TTL and LRU eviction
 */

import { Cache, createCache, memoize } from '../../src/utils/cache.js';

// Example 1: Basic caching
async function example1() {
  console.log('\n--- Example 1: Basic Caching ---');
  
  const cache = new Cache<string>();
  
  // Set values
  cache.set('user:1', 'Alice');
  cache.set('user:2', 'Bob');
  cache.set('user:3', 'Charlie');
  
  // Get values
  console.log('user:1 =', cache.get('user:1'));
  console.log('user:2 =', cache.get('user:2'));
  
  // Check existence
  console.log('Has user:1?', cache.has('user:1'));
  console.log('Has user:4?', cache.has('user:4'));
  
  // Stats
  console.log('Cache stats:', cache.stats());
}

// Example 2: TTL (Time-To-Live)
async function example2() {
  console.log('\n--- Example 2: TTL Expiration ---');
  
  const cache = createCache<string>({ ttl: 2000 }); // 2 seconds
  
  cache.set('session:abc', 'active');
  console.log('Initial:', cache.get('session:abc'));
  
  // Wait for expiration
  console.log('Waiting 2.5 seconds...');
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  console.log('After expiration:', cache.get('session:abc') || 'EXPIRED');
}

// Example 3: LRU eviction
async function example3() {
  console.log('\n--- Example 3: LRU Eviction ---');
  
  const cache = createCache<number>({
    maxSize: 3,
    onEvict: (key, value) => {
      console.log(`Evicted: ${key} = ${value}`);
    },
  });
  
  // Fill cache
  cache.set('a', 1);
  cache.set('b', 2);
  cache.set('c', 3);
  console.log('Cache size:', cache.size());
  
  // Access 'a' to make it recently used
  cache.get('a');
  
  // Add new item (should evict 'b' as LRU)
  cache.set('d', 4);
  
  console.log('Has a?', cache.has('a')); // true
  console.log('Has b?', cache.has('b')); // false (evicted)
  console.log('Has c?', cache.has('c')); // true
  console.log('Has d?', cache.has('d')); // true
}

// Example 4: Memoization
async function example4() {
  console.log('\n--- Example 4: Memoization ---');
  
  let callCount = 0;
  
  const expensiveOperation = memoize(
    async (n: number) => {
      callCount++;
      console.log(`Computing factorial(${n})...`);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    },
    { ttl: 5000 }
  );
  
  // First calls (not cached)
  console.log('Result:', await expensiveOperation(5));
  console.log('Result:', await expensiveOperation(6));
  
  // Cached calls
  console.log('Result (cached):', await expensiveOperation(5));
  console.log('Result (cached):', await expensiveOperation(6));
  
  console.log(`Total expensive calls: ${callCount}`);
}

// Example 5: API response caching
async function example5() {
  console.log('\n--- Example 5: API Response Caching ---');
  
  const apiCache = createCache<any>({ ttl: 60000 }); // 1 minute
  
  async function fetchUserData(userId: string) {
    const cacheKey = `user:${userId}`;
    
    // Check cache
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${userId}`);
      return cached;
    }
    
    // Simulate API call
    console.log(`API call for ${userId}`);
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const data = {
      id: userId,
      name: `User ${userId}`,
      email: `user${userId}@example.com`,
    };
    
    // Store in cache
    apiCache.set(cacheKey, data);
    return data;
  }
  
  // Multiple requests
  await fetchUserData('123');
  await fetchUserData('456');
  await fetchUserData('123'); // Cached
  await fetchUserData('456'); // Cached
  
  console.log('Cache size:', apiCache.size());
}

// Example 6: Session management
async function example6() {
  console.log('\n--- Example 6: Session Management ---');
  
  interface Session {
    userId: string;
    token: string;
    createdAt: Date;
  }
  
  const sessions = createCache<Session>({
    ttl: 3600000, // 1 hour
    maxSize: 1000,
    onEvict: (sessionId) => {
      console.log(`Session expired: ${sessionId}`);
    },
  });
  
  // Create sessions
  sessions.set('sess_abc', {
    userId: '123',
    token: 'token_abc',
    createdAt: new Date(),
  });
  
  sessions.set('sess_def', {
    userId: '456',
    token: 'token_def',
    createdAt: new Date(),
  });
  
  // Validate session
  const session = sessions.get('sess_abc');
  if (session) {
    console.log(`Valid session for user ${session.userId}`);
  }
  
  // List all sessions
  console.log('Active sessions:', sessions.keys());
}

// Example 7: Computed value caching
async function example7() {
  console.log('\n--- Example 7: Computed Values ---');
  
  const computeCache = createCache<number>({ ttl: 10000 });
  
  function fibonacci(n: number): number {
    const cacheKey = `fib:${n}`;
    
    // Check cache
    const cached = computeCache.get(cacheKey);
    if (cached !== undefined) {
      return cached;
    }
    
    // Compute
    let result: number;
    if (n <= 1) {
      result = n;
    } else {
      result = fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    // Cache result
    computeCache.set(cacheKey, result);
    return result;
  }
  
  console.time('First calculation');
  console.log('fib(30) =', fibonacci(30));
  console.timeEnd('First calculation');
  
  console.time('Cached calculation');
  console.log('fib(30) =', fibonacci(30));
  console.timeEnd('Cached calculation');
  
  console.log('Cache entries:', computeCache.size());
}

// Run all examples
async function main() {
  await example1();
  await example2();
  await example3();
  await example4();
  await example5();
  await example6();
  await example7();
}

main().catch(console.error);
