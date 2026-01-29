/**
 * Circuit breaker examples
 * Demonstrates circuit breaker pattern for resilience
 */

import { CircuitBreaker, createCircuitBreaker } from '../../src/utils/circuit-breaker.js';

// Example 1: Basic circuit breaker
async function example1() {
  console.log('\n--- Example 1: Basic Circuit Breaker ---');
  
  const breaker = new CircuitBreaker({
    failureThreshold: 3,
    timeout: 5000,
  });
  
  // Simulate failing service
  for (let i = 0; i < 5; i++) {
    try {
      await breaker.execute(async () => {
        console.log(`Request ${i + 1}`);
        throw new Error('Service unavailable');
      });
    } catch (error) {
      console.log(`Failed: ${(error as Error).message}`);
      console.log(`Circuit state: ${breaker.getState()}`);
    }
  }
}

// Example 2: Circuit recovery
async function example2() {
  console.log('\n--- Example 2: Circuit Recovery ---');
  
  const breaker = createCircuitBreaker({
    failureThreshold: 2,
    successThreshold: 2,
    timeout: 2000,
    onStateChange: (from, to) => {
      console.log(`Circuit state changed: ${from} -> ${to}`);
    },
  });
  
  let requestCount = 0;
  
  // Fail first few requests
  for (let i = 0; i < 3; i++) {
    try {
      await breaker.execute(async () => {
        requestCount++;
        if (requestCount <= 2) {
          throw new Error('Failing');
        }
        return 'Success';
      });
    } catch (error) {
      console.log(`Request ${i + 1} failed`);
    }
  }
  
  console.log(`Circuit is ${breaker.getState()}`);
  
  // Wait for timeout
  console.log('Waiting for circuit to go half-open...');
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Try again (should work now)
  try {
    const result = await breaker.execute(async () => {
      console.log('Service recovered!');
      return 'Success';
    });
    console.log('Result:', result);
    console.log(`Circuit is ${breaker.getState()}`);
  } catch (error) {
    console.log('Still failing');
  }
}

// Example 3: API call protection
async function example3() {
  console.log('\n--- Example 3: API Call Protection ---');
  
  const breaker = createCircuitBreaker({
    failureThreshold: 5,
    timeout: 10000,
  });
  
  async function callExternalAPI() {
    return breaker.execute(async () => {
      // Simulate API call
      const success = Math.random() > 0.7;
      if (!success) {
        throw new Error('API error');
      }
      return { data: 'API response' };
    });
  }
  
  // Make multiple requests
  for (let i = 0; i < 10; i++) {
    try {
      const result = await callExternalAPI();
      console.log(`Request ${i + 1}: Success -`, result);
    } catch (error) {
      console.log(`Request ${i + 1}: Failed -`, (error as Error).message);
    }
    
    const metrics = breaker.getMetrics();
    console.log(`  State: ${metrics.state}, Failures: ${metrics.failureCount}`);
  }
}

// Example 4: Database connection protection
async function example4() {
  console.log('\n--- Example 4: Database Protection ---');
  
  const dbBreaker = createCircuitBreaker({
    failureThreshold: 3,
    successThreshold: 2,
    timeout: 5000,
    onStateChange: (from, to) => {
      if (to === 'OPEN') {
        console.log('⚠️  Database circuit opened - stopping requests');
      } else if (to === 'CLOSED') {
        console.log('✅ Database circuit closed - resuming normal operations');
      }
    },
  });
  
  async function queryDatabase(query: string) {
    return dbBreaker.execute(async () => {
      // Simulate database query
      console.log(`Executing query: ${query}`);
      
      // Simulate occasional failures
      if (Math.random() > 0.6) {
        throw new Error('Database connection timeout');
      }
      
      return [{ id: 1, name: 'Result' }];
    });
  }
  
  // Make database queries
  const queries = [
    'SELECT * FROM users',
    'SELECT * FROM products',
    'SELECT * FROM orders',
    'SELECT * FROM payments',
    'SELECT * FROM transactions',
  ];
  
  for (const query of queries) {
    try {
      const results = await queryDatabase(query);
      console.log(`✓ Query succeeded, returned ${results.length} rows`);
    } catch (error) {
      console.log(`✗ Query failed: ${(error as Error).message}`);
    }
  }
  
  console.log('\nFinal metrics:', dbBreaker.getMetrics());
}

// Example 5: Multiple service breakers
async function example5() {
  console.log('\n--- Example 5: Multiple Services ---');
  
  const breakers = {
    auth: createCircuitBreaker({ failureThreshold: 5 }),
    payment: createCircuitBreaker({ failureThreshold: 3 }),
    notification: createCircuitBreaker({ failureThreshold: 10 }),
  };
  
  async function callService(name: string, breaker: CircuitBreaker) {
    try {
      return await breaker.execute(async () => {
        // Simulate service call
        if (Math.random() > 0.5) {
          throw new Error(`${name} service error`);
        }
        return `${name} success`;
      });
    } catch (error) {
      return null;
    }
  }
  
  // Make calls to different services
  for (let i = 0; i < 5; i++) {
    console.log(`\nRound ${i + 1}:`);
    
    const [auth, payment, notification] = await Promise.all([
      callService('Auth', breakers.auth),
      callService('Payment', breakers.payment),
      callService('Notification', breakers.notification),
    ]);
    
    console.log('Auth:', auth || 'FAILED', `(${breakers.auth.getState()})`);
    console.log('Payment:', payment || 'FAILED', `(${breakers.payment.getState()})`);
    console.log('Notification:', notification || 'FAILED', `(${breakers.notification.getState()})`);
  }
}

// Run all examples
async function main() {
  await example1();
  await example2();
  await example3();
  await example4();
  await example5();
}

main().catch(console.error);
