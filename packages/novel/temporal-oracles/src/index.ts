/**
 * Temporal Oracles - Time-locked data revelation system
 * 
 * Allows data to be committed on-chain but only revealed after specific conditions:
 * - Block number thresholds
 * - Time delays
 * - Event triggers
 * 
 * Use cases:
 * - Fair NFT reveals
 * - Delayed price discovery
 * - Commitment schemes for games
 * - Prediction market resolution
 */

import { keccak256, encodePacked, type Address, type Hash } from 'viem';

export interface TemporalCommitment {
  commitment: Hash;
  revealBlock: bigint;
  creator: Address;
  revealed: boolean;
  data?: string;
}

export class TemporalOracle {
  private commitments: Map<Hash, TemporalCommitment> = new Map();
  
  /**
   * Create a time-locked commitment
   */
  createCommitment(
    data: string,
    revealBlock: bigint,
    creator: Address,
    salt: string
  ): Hash {
    const commitment = keccak256(
      encodePacked(
        ['string', 'uint256', 'address', 'string'],
        [data, revealBlock, creator, salt]
      )
    );
    
    this.commitments.set(commitment, {
      commitment,
      revealBlock,
      creator,
      revealed: false
    });
    
    return commitment;
  }
  
  /**
   * Reveal data after time-lock expires
   */
  reveal(
    commitment: Hash,
    data: string,
    currentBlock: bigint,
    salt: string
  ): boolean {
    const record = this.commitments.get(commitment);
    if (!record) throw new Error('Commitment not found');
    if (record.revealed) throw new Error('Already revealed');
    if (currentBlock < record.revealBlock) {
      throw new Error(`Cannot reveal before block ${record.revealBlock}`);
    }
    
    // Verify commitment
    const reconstructed = keccak256(
      encodePacked(
        ['string', 'uint256', 'address', 'string'],
        [data, record.revealBlock, record.creator, salt]
      )
    );
    
    if (reconstructed !== commitment) {
      throw new Error('Invalid reveal data');
    }
    
    record.revealed = true;
    record.data = data;
    return true;
  }
  
  getCommitment(commitment: Hash): TemporalCommitment | undefined {
    return this.commitments.get(commitment);
  }
}

export default TemporalOracle;
