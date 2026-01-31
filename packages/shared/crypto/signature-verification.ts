/**
 * @file signature-verification.ts
 * @author nirholas
 * @copyright (c) 2026 nichxbt
 * @repository universal-crypto-mcp
 * @version 0.4.14.3
 *
 * Cryptographic signature verification for EVM and Solana
 * Implements: x402-gateway.ts#L339 TODO
 */

import {
  recoverMessageAddress,
  hashMessage,
  type Hex,
  type Address,
  createPublicClient,
  http,
} from "viem";
import { base, arbitrum, mainnet, optimism } from "viem/chains";
import * as crypto from "crypto";

// ERC-1271 magic value for valid signatures
const ERC1271_MAGIC_VALUE = "0x1626ba7e";

/**
 * Verify an Ethereum signature (EIP-191 personal sign)
 */
export async function verifyEthereumSignature(
  message: string | Uint8Array,
  signature: Hex,
  expectedSigner: Address
): Promise<boolean> {
  try {
    const messageStr =
      typeof message === "string"
        ? message
        : Buffer.from(message).toString("utf-8");

    const recoveredAddress = await recoverMessageAddress({
      message: messageStr,
      signature,
    });

    return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
  } catch (error) {
    console.error("Signature verification failed:", error);
    return false;
  }
}

/**
 * Verify an EIP-712 typed data signature
 */
export async function verifyTypedDataSignature(
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: Address;
  },
  types: Record<string, Array<{ name: string; type: string }>>,
  primaryType: string,
  message: Record<string, unknown>,
  signature: Hex,
  expectedSigner: Address
): Promise<boolean> {
  try {
    const { recoverTypedDataAddress } = await import("viem");

    const recoveredAddress = await recoverTypedDataAddress({
      domain,
      types,
      primaryType,
      message,
      signature,
    });

    return recoveredAddress.toLowerCase() === expectedSigner.toLowerCase();
  } catch (error) {
    console.error("Typed data signature verification failed:", error);
    return false;
  }
}

/**
 * Verify an ERC-1271 smart contract signature
 */
export async function verifySmartContractSignature(
  contractAddress: Address,
  messageHash: Hex,
  signature: Hex,
  chainId: number = 1
): Promise<boolean> {
  const chains: Record<number, (typeof mainnet)> = {
    1: mainnet,
    8453: base,
    42161: arbitrum,
    10: optimism,
  };

  const chain = chains[chainId];
  if (!chain) {
    console.error(`Unsupported chain ID: ${chainId}`);
    return false;
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: [
        {
          name: "isValidSignature",
          type: "function",
          inputs: [
            { name: "hash", type: "bytes32" },
            { name: "signature", type: "bytes" },
          ],
          outputs: [{ name: "magicValue", type: "bytes4" }],
          stateMutability: "view",
        },
      ],
      functionName: "isValidSignature",
      args: [messageHash, signature],
    });

    return result === ERC1271_MAGIC_VALUE;
  } catch (error) {
    console.error("Smart contract signature verification failed:", error);
    return false;
  }
}

/**
 * Verify a Solana signature (ed25519)
 * Note: Requires tweetnacl and @solana/web3.js
 */
export async function verifySolanaSignature(
  message: Uint8Array,
  signature: Uint8Array | string,
  publicKeyStr: string
): Promise<boolean> {
  try {
    // Dynamic imports for optional Solana dependencies
    const nacl = await import("tweetnacl");
    const bs58 = await import("bs58");
    const { PublicKey } = await import("@solana/web3.js");

    const sig =
      typeof signature === "string" ? bs58.default.decode(signature) : signature;
    const pubkey = new PublicKey(publicKeyStr);

    return nacl.default.sign.detached.verify(message, sig, pubkey.toBytes());
  } catch (error) {
    console.error("Solana signature verification failed:", error);
    return false;
  }
}

/**
 * Unified signature verification for x402 payment proofs
 * This is the main function used by the x402 gateway
 */
export async function verifyPaymentSignature(proof: {
  payer: string;
  amount: string;
  token: string;
  chain: string;
  nonce: string;
  timestamp: number;
  signature: string;
}): Promise<{ valid: boolean; error?: string }> {
  // Reconstruct message that was signed
  const message = `${proof.payer}:${proof.amount}:${proof.token}:${proof.chain}:${proof.nonce}:${proof.timestamp}`;
  const messageBytes = new TextEncoder().encode(message);

  // Check timestamp (5 minute window)
  const now = Date.now();
  if (Math.abs(now - proof.timestamp) > 5 * 60 * 1000) {
    return { valid: false, error: "Signature timestamp expired" };
  }

  // Verify based on chain type
  if (
    proof.chain === "solana" ||
    proof.chain === "svm" ||
    proof.chain.startsWith("solana:")
  ) {
    try {
      const valid = await verifySolanaSignature(
        messageBytes,
        proof.signature,
        proof.payer
      );
      return valid
        ? { valid: true }
        : { valid: false, error: "Invalid Solana signature" };
    } catch {
      return { valid: false, error: "Solana signature verification failed" };
    }
  }

  // EVM chains (ethereum, base, arbitrum, optimism, polygon, etc.)
  try {
    const valid = await verifyEthereumSignature(
      message,
      proof.signature as Hex,
      proof.payer as Address
    );
    return valid
      ? { valid: true }
      : { valid: false, error: "Invalid Ethereum signature" };
  } catch (error) {
    return {
      valid: false,
      error: `Signature verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

/**
 * Create a signature for testing purposes
 */
export function createTestSignatureMessage(
  payer: string,
  amount: string,
  token: string,
  chain: string,
  nonce: string
): { message: string; timestamp: number } {
  const timestamp = Date.now();
  const message = `${payer}:${amount}:${token}:${chain}:${nonce}:${timestamp}`;
  return { message, timestamp };
}

export default {
  verifyEthereumSignature,
  verifyTypedDataSignature,
  verifySmartContractSignature,
  verifySolanaSignature,
  verifyPaymentSignature,
  createTestSignatureMessage,
};
