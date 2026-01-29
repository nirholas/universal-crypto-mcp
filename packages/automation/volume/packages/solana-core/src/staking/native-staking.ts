/**
 * Native Staking Operations
 * SOL staking with validators and liquid staking protocols
 */

import {
  Connection,
  PublicKey,
  Keypair,
  TransactionInstruction,
  StakeProgram,
  Authorized,
  Lockup,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import { logger } from '../utils/logger.js';

// Marinade Finance addresses (reserved for future liquid staking integration)
// const MARINADE_PROGRAM_ID = new PublicKey('MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD');
const MSOL_MINT = new PublicKey('mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So');

// Jito addresses (reserved for future liquid staking integration)
// const JITO_STAKE_POOL = new PublicKey('Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb');
const JITOSOL_MINT = new PublicKey('J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn');

export interface StakeAccountInfo {
  address: PublicKey;
  lamports: number;
  state: 'inactive' | 'activating' | 'active' | 'deactivating';
  voter?: PublicKey;
  staker: PublicKey;
  withdrawer: PublicKey;
  activationEpoch?: number;
  deactivationEpoch?: number;
  rentExemptReserve: number;
  delegatedStake: number;
}

export interface ValidatorInfo {
  votePubkey: PublicKey;
  nodePubkey: PublicKey;
  commission: number;
  activatedStake: number;
  epochCredits: Array<[number, number, number]>;
  lastVote: number;
  rootSlot: number;
}

export interface StakePoolInfo {
  name: string;
  mint: PublicKey;
  tvl: number;
  apy: number;
  fee: number;
}

/**
 * Get stake account info
 */
export async function getStakeAccountInfo(
  connection: Connection,
  stakeAccount: PublicKey
): Promise<StakeAccountInfo | null> {
  try {
    const accountInfo = await connection.getAccountInfo(stakeAccount);
    if (!accountInfo || !accountInfo.owner.equals(StakeProgram.programId)) {
      return null;
    }

    const stakeMeta = await connection.getStakeActivation(stakeAccount);

    // Parse stake account data from raw buffer
    const data = accountInfo.data;
    
    // Simplified parsing - full implementation would decode all fields
    return {
      address: stakeAccount,
      lamports: accountInfo.lamports,
      state: stakeMeta.state as 'inactive' | 'activating' | 'active' | 'deactivating',
      staker: new PublicKey(data.slice(12, 44)),
      withdrawer: new PublicKey(data.slice(44, 76)),
      rentExemptReserve: LAMPORTS_PER_SOL * 0.00203928, // Approximate
      delegatedStake: stakeMeta.active,
    };
  } catch (error) {
    logger.debug('Failed to get stake account info', { 
      stakeAccount: stakeAccount.toBase58(),
      error: (error as Error).message 
    });
    return null;
  }
}

/**
 * Get all stake accounts for a wallet
 */
export async function getStakeAccountsByOwner(
  connection: Connection,
  owner: PublicKey
): Promise<StakeAccountInfo[]> {
  const stakeAccounts = await connection.getParsedProgramAccounts(
    StakeProgram.programId,
    {
      filters: [
        { dataSize: 200 }, // Stake account size
        {
          memcmp: {
            offset: 12, // Offset of staker authority
            bytes: owner.toBase58(),
          },
        },
      ],
    }
  );

  const results: StakeAccountInfo[] = [];

  for (const { pubkey } of stakeAccounts) {
    const info = await getStakeAccountInfo(connection, pubkey);
    if (info) {
      results.push(info);
    }
  }

  return results;
}

/**
 * Create stake account and delegate instructions
 */
export function createStakeAccountInstructions(
  fromPubkey: PublicKey,
  stakeAccountKeypair: Keypair,
  authorized: { staker: PublicKey; withdrawer: PublicKey },
  lamports: number,
  votePubkey: PublicKey
): TransactionInstruction[] {
  const instructions: TransactionInstruction[] = [];

  // Create stake account
  instructions.push(
    ...StakeProgram.createAccount({
      fromPubkey,
      stakePubkey: stakeAccountKeypair.publicKey,
      authorized: new Authorized(authorized.staker, authorized.withdrawer),
      lockup: new Lockup(0, 0, fromPubkey), // No lockup
      lamports,
    }).instructions
  );

  // Delegate to validator
  const delegateIx = StakeProgram.delegate({
      stakePubkey: stakeAccountKeypair.publicKey,
      authorizedPubkey: authorized.staker,
      votePubkey,
    }).instructions[0];
  if (delegateIx) {
    instructions.push(delegateIx);
  }

  return instructions;
}

/**
 * Create deactivate stake instruction
 */
export function createDeactivateStakeInstruction(
  stakePubkey: PublicKey,
  authorizedPubkey: PublicKey
): TransactionInstruction {
  const ix = StakeProgram.deactivate({
    stakePubkey,
    authorizedPubkey,
  }).instructions[0];
  if (!ix) {
    throw new Error('Failed to create deactivate instruction');
  }
  return ix;
}

/**
 * Create withdraw stake instruction
 */
export function createWithdrawStakeInstruction(
  stakePubkey: PublicKey,
  authorizedPubkey: PublicKey,
  toPubkey: PublicKey,
  lamports: number
): TransactionInstruction {
  const ix = StakeProgram.withdraw({
    stakePubkey,
    authorizedPubkey,
    toPubkey,
    lamports,
  }).instructions[0];
  if (!ix) {
    throw new Error('Failed to create withdraw instruction');
  }
  return ix;
}

/**
 * Get top validators by stake
 */
export async function getTopValidators(
  connection: Connection,
  limit: number = 20
): Promise<ValidatorInfo[]> {
  const voteAccounts = await connection.getVoteAccounts();
  
  const validators: ValidatorInfo[] = voteAccounts.current
    .sort((a, b) => b.activatedStake - a.activatedStake)
    .slice(0, limit)
    .map(v => ({
      votePubkey: new PublicKey(v.votePubkey),
      nodePubkey: new PublicKey(v.nodePubkey),
      commission: v.commission,
      activatedStake: v.activatedStake,
      epochCredits: v.epochCredits,
      lastVote: v.lastVote,
      rootSlot: (v as { rootSlot?: number }).rootSlot ?? 0,
    }));

  return validators;
}

/**
 * Get validator info by vote account
 */
export async function getValidatorInfo(
  connection: Connection,
  votePubkey: PublicKey
): Promise<ValidatorInfo | null> {
  const voteAccounts = await connection.getVoteAccounts();
  
  const validator = [...voteAccounts.current, ...voteAccounts.delinquent]
    .find(v => v.votePubkey === votePubkey.toBase58());

  if (!validator) {
    return null;
  }

  return {
    votePubkey: new PublicKey(validator.votePubkey),
    nodePubkey: new PublicKey(validator.nodePubkey),
    commission: validator.commission,
    activatedStake: validator.activatedStake,
    epochCredits: validator.epochCredits,
    lastVote: validator.lastVote,
    rootSlot: (validator as { rootSlot?: number }).rootSlot ?? 0,
  };
}

/**
 * Get liquid staking pool info
 */
export async function getLiquidStakingPools(): Promise<StakePoolInfo[]> {
  // Fetch real data from DeFiLlama or direct pool queries
  try {
    const response = await fetch('https://api.llama.fi/protocol/marinade-finance');
    const marinade = await response.json() as { tvl: number };

    const jitoResponse = await fetch('https://api.llama.fi/protocol/jito');
    const jito = await jitoResponse.json() as { tvl: number };

    return [
      {
        name: 'Marinade (mSOL)',
        mint: MSOL_MINT,
        tvl: marinade.tvl || 0,
        apy: 7.2, // Approximate, should fetch real APY
        fee: 0,
      },
      {
        name: 'Jito (JitoSOL)',
        mint: JITOSOL_MINT,
        tvl: jito.tvl || 0,
        apy: 7.8, // Approximate, includes MEV rewards
        fee: 0.1,
      },
    ];
  } catch (error) {
    logger.debug('Failed to fetch liquid staking info', { error: (error as Error).message });
    return [];
  }
}

/**
 * Calculate stake rewards estimate
 */
export function estimateStakeRewards(
  stakedAmount: number,
  apy: number,
  durationDays: number
): {
  estimatedRewards: number;
  estimatedTotal: number;
  dailyRewards: number;
} {
  const dailyRate = apy / 100 / 365;
  const dailyRewards = stakedAmount * dailyRate;
  const estimatedRewards = dailyRewards * durationDays;
  
  return {
    estimatedRewards,
    estimatedTotal: stakedAmount + estimatedRewards,
    dailyRewards,
  };
}

/**
 * Get current epoch info
 */
export async function getEpochInfo(connection: Connection): Promise<{
  epoch: number;
  slotIndex: number;
  slotsInEpoch: number;
  absoluteSlot: number;
  epochProgress: number;
  estimatedTimeRemaining: number;
}> {
  const epochInfo = await connection.getEpochInfo();
  
  const epochProgress = (epochInfo.slotIndex / epochInfo.slotsInEpoch) * 100;
  const slotsRemaining = epochInfo.slotsInEpoch - epochInfo.slotIndex;
  const estimatedTimeRemaining = slotsRemaining * 0.4; // ~400ms per slot

  return {
    epoch: epochInfo.epoch,
    slotIndex: epochInfo.slotIndex,
    slotsInEpoch: epochInfo.slotsInEpoch,
    absoluteSlot: epochInfo.absoluteSlot,
    epochProgress,
    estimatedTimeRemaining,
  };
}
