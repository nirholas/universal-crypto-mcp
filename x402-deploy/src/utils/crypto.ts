import { createWalletClient, http, type PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { arbitrum } from "viem/chains";

/**
 * Generate an ownership proof signature for x402scan
 */
export async function generateOwnershipProof(
  origin: string,
  privateKey: `0x${string}`
): Promise<string> {
  const account = privateKeyToAccount(privateKey);
  
  const client = createWalletClient({
    account,
    chain: arbitrum,
    transport: http(),
  });
  
  const signature = await client.signMessage({
    message: origin,
  });
  
  return signature;
}

/**
 * Get wallet address from private key
 */
export function getAddressFromPrivateKey(privateKey: `0x${string}`): `0x${string}` {
  const account = privateKeyToAccount(privateKey);
  return account.address;
}
