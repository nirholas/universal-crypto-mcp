/**
 * Retry utility examples
 * Demonstrates retry logic with exponential backoff
 */

import { retry, retryOnNetworkError, retryOnHttpError } from '../../src/utils/retry.js';

// Example 1: Basic retry with default options
async function example1() {
  console.log('\n--- Example 1: Basic Retry ---');
  
  let attempts = 0;
  
  try {
    const result = await retry(async () => {
      attempts++;
      console.log(`Attempt ${attempts}`);
      
      if (attempts < 3) {
        throw new Error('Temporary failure');
      }
      
      return 'Success!';
    });
    
    console.log('Result:', result);
  } catch (error) {
    console.error('Failed after retries:', error);
  }
}

// Example 2: Custom retry options
async function example2() {
  console.log('\n--- Example 2: Custom Options ---');
  
  let attempts = 0;
  
  try {
    await retry(
      async () => {
        attempts++;
        console.log(`Attempt ${attempts}`);
        throw new Error('Always fails');
      },
      {
        maxAttempts: 5,
        initialDelay: 500,
        backoffMultiplier: 1.5,
        onRetry: (error, attempt) => {
          console.log(`Retrying after error: ${error.message} (attempt ${attempt})`);
        },
      }
    );
  } catch (error) {
    console.error('Final error:', (error as Error).message);
  }
}

// Example 3: Retry network requests
async function example3() {
  console.log('\n--- Example 3: Network Retry ---');
  
  try {
    const data = await retryOnNetworkError(
      async () => {
        // Simulate network request
        const response = await fetch('https://api.example.com/data');
        return await response.json();
      },
      { maxAttempts: 3, initialDelay: 2000 }
    );
    
    console.log('Data:', data);
  } catch (error) {
    console.error('Network request failed:', error);
  }
}

// Example 4: Retry HTTP errors
async function example4() {
  console.log('\n--- Example 4: HTTP Error Retry ---');
  
  try {
    const response = await retryOnHttpError(
      async () => {
        const res = await fetch('https://api.example.com/data');
        if (!res.ok) {
          const err: any = new Error('HTTP error');
          err.status = res.status;
          throw err;
        }
        return res;
      },
      [429, 500, 502, 503], // Retry on these status codes
      { maxAttempts: 5, initialDelay: 1000 }
    );
    
    console.log('Response:', await response.json());
  } catch (error) {
    console.error('HTTP request failed:', error);
  }
}

// Example 5: Conditional retry
async function example5() {
  console.log('\n--- Example 5: Conditional Retry ---');
  
  try {
    await retry(
      async () => {
        throw new Error('FATAL_ERROR');
      },
      {
        maxAttempts: 3,
        isRetryable: (error) => {
          // Don't retry fatal errors
          return !error.message.includes('FATAL');
        },
      }
    );
  } catch (error) {
    console.log('Not retryable error:', (error as Error).message);
  }
}

// Example 6: Blockchain transaction retry
async function example6() {
  console.log('\n--- Example 6: Blockchain Transaction Retry ---');
  
  try {
    const txHash = await retry(
      async () => {
        console.log('Attempting to send transaction...');
        
        // Simulate transaction send that might fail
        const success = Math.random() > 0.5;
        if (!success) {
          throw new Error('Transaction failed: network congestion');
        }
        
        return '0x1234567890abcdef';
      },
      {
        maxAttempts: 5,
        initialDelay: 3000,
        maxDelay: 30000,
        backoffMultiplier: 2,
        onRetry: (error, attempt) => {
          console.log(`Transaction failed (attempt ${attempt}), retrying...`);
        },
      }
    );
    
    console.log('Transaction successful:', txHash);
  } catch (error) {
    console.error('Transaction ultimately failed:', error);
  }
}

// Run all examples
async function main() {
  await example1();
  await example2();
  // Uncomment to run network examples (require internet)
  // await example3();
  // await example4();
  await example5();
  await example6();
}

main().catch(console.error);
