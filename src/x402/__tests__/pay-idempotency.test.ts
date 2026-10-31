/**
 * X402Client.pay() idempotency: retrying a payment with the same key must not
 * sign a second authorization (issue #36).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { X402Client } from '../sdk/client.js';
import {
  TEST_PRIVATE_KEY,
  TEST_ADDRESSES,
  createMockRPC,
  createMockWalletClient,
  createMockPaymentResult,
} from './mocks/index.js';

vi.mock('viem', async () => {
  const actual = await vi.importActual('viem');
  return {
    ...actual,
    createPublicClient: vi.fn(() => createMockRPC()),
    createWalletClient: vi.fn(() => createMockWalletClient()),
  };
});

vi.mock('viem/accounts', () => ({
  privateKeyToAccount: vi.fn(() => ({
    address: '0x1111111111111111111111111111111111111111',
    signMessage: vi.fn(),
    signTypedData: vi.fn(),
  })),
}));

function makeClient() {
  const client = new X402Client({ chain: 'arbitrum', privateKey: TEST_PRIVATE_KEY, enableGasless: true });
  const tx = createMockPaymentResult().transaction;
  const executeGasless = vi.fn().mockResolvedValue(tx);
  const execute = vi.fn().mockResolvedValue(tx);
  const isNonceUsed = vi.fn().mockResolvedValue(false);
  (client as any).gaslessPayment = { supportsGasless: () => true, executeGasless, isNonceUsed };
  (client as any).standardPayment = { execute };
  vi.spyOn(client, 'estimateYield').mockResolvedValue(undefined as any);
  return { client, executeGasless, execute, isNonceUsed };
}

describe('X402Client.pay() idempotency', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns the original result for a repeat of the same key without signing again', async () => {
    const { client, executeGasless } = makeClient();
    const opts = { idempotencyKey: 'order-1' };
    const first = await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts);
    const second = await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts);
    expect(executeGasless).toHaveBeenCalledTimes(1);
    expect(second.transaction.hash).toBe(first.transaction.hash);
    expect(second.replayed).toBe(true);
    expect(first.replayed).toBeUndefined();
  });

  it('joins a concurrent retry to the call already in flight', async () => {
    const { client, executeGasless } = makeClient();
    const opts = { idempotencyKey: 'order-2' };
    await Promise.all([
      client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts),
      client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts),
    ]);
    expect(executeGasless).toHaveBeenCalledTimes(1);
  });

  it('does not collapse different purchases that reuse a key', async () => {
    const { client, executeGasless } = makeClient();
    const opts = { idempotencyKey: 'order-3' };
    await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts);
    await client.pay(TEST_ADDRESSES.recipient, '2.00', 'USDC', opts);
    expect(executeGasless).toHaveBeenCalledTimes(2);
  });

  it('still signs every call when no key is given', async () => {
    const { client, executeGasless } = makeClient();
    await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC');
    await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC');
    expect(executeGasless).toHaveBeenCalledTimes(2);
  });

  it('lets the caller retry the same key after a failed payment', async () => {
    const { client, executeGasless, execute } = makeClient();
    executeGasless.mockRejectedValueOnce(new Error('rpc down'));
    execute.mockRejectedValueOnce(new Error('rpc down'));
    const opts = { idempotencyKey: 'order-4' };
    await expect(client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts)).rejects.toThrow();
    const retry = await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', opts);
    expect(retry.replayed).toBeUndefined();
  });

  it('derives the same EIP-3009 nonce for the same key so the token rejects a double settlement', async () => {
    const { client, executeGasless } = makeClient();
    await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', { idempotencyKey: 'order-5' });
    (client as any).ledger = new (Object.getPrototypeOf((client as any).ledger).constructor)();
    await client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', { idempotencyKey: 'order-5' });
    const [a, b] = executeGasless.mock.calls.map((c) => c[1]?.nonce);
    expect(a).toMatch(/^0x[0-9a-f]{64}$/);
    expect(a).toBe(b);
  });

  it('does not fall back to a standard payment when the keyed authorization was already consumed', async () => {
    const { client, executeGasless, execute, isNonceUsed } = makeClient();
    executeGasless.mockRejectedValueOnce(new Error('response lost'));
    isNonceUsed.mockResolvedValueOnce(true);
    await expect(
      client.pay(TEST_ADDRESSES.recipient, '1.00', 'USDC', { idempotencyKey: 'order-6' })
    ).rejects.toThrow(/already consumed/);
    expect(execute).not.toHaveBeenCalled();
  });

  it('handlePaymentRequired reuses the server payment reference as the key', async () => {
    const { client, executeGasless } = makeClient();
    const response = {
      status: 402 as const,
      headers: {
        'www-authenticate': `X402 price="1.00 USDC" chain="arbitrum" recipient="${TEST_ADDRESSES.recipient}" reference="ref-abc123"`,
      },
    };
    await client.handlePaymentRequired(response, { autoPayUnder: '5.00' });
    await client.handlePaymentRequired(response, { autoPayUnder: '5.00' });
    expect(executeGasless).toHaveBeenCalledTimes(1);
  });
});
