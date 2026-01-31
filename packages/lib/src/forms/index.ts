/**
 * Forms Layer
 * 
 * Form handling with Zod validation.
 * 
 * Reference: /vendor/forms/
 */

import { z } from 'zod';

// ============================================================
// Re-exports
// ============================================================

export { z } from 'zod';
export type { ZodSchema, ZodType, ZodError } from 'zod';

// ============================================================
// Common Schemas
// ============================================================

export const AddressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

export const TransactionHashSchema = z.string().regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash');

export const ChainIdSchema = z.number().int().positive();

export const AmountSchema = z.string().regex(/^\d+(\.\d+)?$/, 'Invalid amount');

export const TokenSymbolSchema = z.string().min(1).max(10);

// ============================================================
// Form Utilities
// ============================================================

export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }
  return errors;
}
