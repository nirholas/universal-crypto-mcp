/**
 * Input sanitization and validation utilities
 * @module utils/sanitize
 */

/**
 * Sanitize string input by removing dangerous characters
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim();
}

/**
 * Sanitize HTML input
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize SQL input (basic - use parameterized queries instead)
 */
export function sanitizeSql(input: string): string {
  return input
    .replace(/['";]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '');
}

/**
 * Sanitize file path to prevent directory traversal
 */
export function sanitizePath(input: string): string {
  return input
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[<>:"|?*]/g, '') // Remove invalid path characters
    .replace(/^\/+/, '') // Remove leading slashes
    .normalize();
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Validate amount (positive number)
 */
export function isValidAmount(amount: string | number): boolean {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return !isNaN(num) && num > 0 && isFinite(num);
}

/**
 * Validate JSON string
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate UUID
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Sanitize object by removing null/undefined values
 */
export function sanitizeObject<T extends Record<string, any>>(
  obj: T,
  removeEmpty = true
): Partial<T> {
  const result: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }
    
    if (removeEmpty && value === '') {
      continue;
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      result[key] = sanitizeObject(value, removeEmpty);
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Truncate string to maximum length
 */
export function truncate(str: string, maxLength: number, suffix = '...'): string {
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Rate limit key generator
 */
export function generateRateLimitKey(
  identifier: string,
  prefix = 'ratelimit'
): string {
  return `${prefix}:${sanitizeString(identifier)}`;
}

/**
 * Validate and parse integer
 */
export function parseIntSafe(value: string | number, defaultValue = 0): number {
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate and parse float
 */
export function parseFloatSafe(value: string | number, defaultValue = 0): number {
  if (typeof value === 'number') {
    return value;
  }
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Validate object against schema
 */
export function validateSchema<T>(
  data: unknown,
  schema: Record<string, (value: any) => boolean>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Data must be an object'] };
  }
  
  const obj = data as Record<string, any>;
  
  for (const [key, validator] of Object.entries(schema)) {
    if (!(key in obj)) {
      errors.push(`Missing required field: ${key}`);
      continue;
    }
    
    if (!validator(obj[key])) {
      errors.push(`Invalid value for field: ${key}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if value is within range
 */
export function inRange(
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
}

/**
 * Normalize whitespace in string
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Remove special characters from string
 */
export function alphanumericOnly(str: string, allowSpaces = false): string {
  const pattern = allowSpaces ? /[^a-zA-Z0-9\s]/g : /[^a-zA-Z0-9]/g;
  return str.replace(pattern, '');
}

/**
 * Validate hex string
 */
export function isValidHex(hex: string): boolean {
  return /^0x[a-fA-F0-9]+$/.test(hex);
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 255);
}

/**
 * Deep freeze object
 */
export function deepFreeze<T>(obj: T): Readonly<T> {
  Object.freeze(obj);
  
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });
  
  return obj;
}
