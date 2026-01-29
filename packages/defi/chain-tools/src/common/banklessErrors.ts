/**
 * Base Bankless error class
 */
export class BanklessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BanklessError';
  }
}

/**
 * Error for invalid inputs
 */
export class BanklessValidationError extends BanklessError {
  response?: any;
  
  constructor(message: string, response?: any) {
    super(message);
    this.name = 'BanklessValidationError';
    this.response = response;
  }
}

/**
 * Error for authentication failures
 */
export class BanklessAuthenticationError extends BanklessError {
  constructor(message: string) {
    super(message);
    this.name = 'BanklessAuthenticationError';
  }
}

/**
 * Error for rate limit issues
 */
export class BanklessRateLimitError extends BanklessError {
  resetAt: Date;
  
  constructor(message: string, resetAt: Date) {
    super(message);
    this.name = 'BanklessRateLimitError';
    this.resetAt = resetAt;
  }
}

/**
 * Error for resource not found
 */
export class BanklessResourceNotFoundError extends BanklessError {
  constructor(message: string) {
    super(message);
    this.name = 'BanklessResourceNotFoundError';
  }
}

/**
 * Function to check if an error is a Bankless error
 */
export function isBanklessError(error: any): error is BanklessError {
  return error instanceof BanklessError;
}
