/**
 * Multi-Dimensional Reputation Graphs
 * 
 * Novel approach to on-chain reputation:
 * - Context-specific scores (DeFi, NFT, DAO participation)
 * - Time-decay mechanisms
 * - Negative reputation tracking
 * - Sybil resistance through graph analysis
 * - Weighted attestations from trusted entities
 */

import type { Address } from 'viem';

export enum ReputationDimension {
  DEFI_ACTIVITY = 'defi',
  NFT_TRADING = 'nft',
  DAO_PARTICIPATION = 'dao',
  DEVELOPER = 'dev',
  LIQUIDITY_PROVIDER = 'lp',
  COMMUNITY = 'community'
}

export interface ReputationScore {
  dimension: ReputationDimension;
  score: number;
  lastUpdate: bigint;
  decayRate: number; // percentage per day
  attestations: Attestation[];
}

export interface Attestation {
  from: Address;
  weight: number;
  timestamp: bigint;
  positive: boolean;
  metadata?: string;
}

export class ReputationGraph {
  private scores: Map<Address, Map<ReputationDimension, ReputationScore>> = new Map();
  private trustedAttestors: Map<Address, number> = new Map(); // weight mapping
  
  /**
   * Initialize reputation for an address
   */
  initializeReputation(address: Address): void {
    if (!this.scores.has(address)) {
      this.scores.set(address, new Map());
    }
  }
  
  /**
   * Add attestation from another address
   */
  attest(
    from: Address,
    to: Address,
    dimension: ReputationDimension,
    positive: boolean,
    timestamp: bigint,
    metadata?: string
  ): void {
    this.initializeReputation(to);
    const addressScores = this.scores.get(to)!;
    
    if (!addressScores.has(dimension)) {
      addressScores.set(dimension, {
        dimension,
        score: 0,
        lastUpdate: timestamp,
        decayRate: 0.01, // 1% per day default
        attestations: []
      });
    }
    
    const reputationScore = addressScores.get(dimension)!;
    const attesterWeight = this.trustedAttestors.get(from) || 1;
    
    const attestation: Attestation = {
      from,
      weight: attesterWeight,
      timestamp,
      positive,
      metadata
    };
    
    reputationScore.attestations.push(attestation);
    
    // Update score
    const delta = positive ? attesterWeight : -attesterWeight;
    reputationScore.score += delta;
    reputationScore.lastUpdate = timestamp;
  }
  
  /**
   * Calculate time-decayed reputation score
   */
  getDecayedScore(
    address: Address,
    dimension: ReputationDimension,
    currentTimestamp: bigint
  ): number {
    const addressScores = this.scores.get(address);
    if (!addressScores) return 0;
    
    const reputationScore = addressScores.get(dimension);
    if (!reputationScore) return 0;
    
    const daysPassed = Number(currentTimestamp - reputationScore.lastUpdate) / 86400;
    const decayFactor = Math.pow(1 - reputationScore.decayRate, daysPassed);
    
    return Math.max(0, reputationScore.score * decayFactor);
  }
  
  /**
   * Get composite reputation across all dimensions
   */
  getCompositeScore(address: Address, currentTimestamp: bigint): number {
    const addressScores = this.scores.get(address);
    if (!addressScores) return 0;
    
    let total = 0;
    for (const dimension of Object.values(ReputationDimension)) {
      total += this.getDecayedScore(address, dimension as ReputationDimension, currentTimestamp);
    }
    
    return total / Object.keys(ReputationDimension).length;
  }
  
  /**
   * Add trusted attestor with weight
   */
  addTrustedAttestor(address: Address, weight: number): void {
    this.trustedAttestors.set(address, weight);
  }
  
  /**
   * Detect potential Sybil clusters using graph analysis
   */
  detectSybilCluster(addresses: Address[], threshold: number): Address[][] {
    // Simplified Sybil detection: look for circular attestations
    const clusters: Address[][] = [];
    const visited = new Set<Address>();
    
    for (const addr of addresses) {
      if (visited.has(addr)) continue;
      
      const cluster = this.findConnectedAddresses(addr, addresses, threshold);
      if (cluster.length > 1) {
        clusters.push(cluster);
        cluster.forEach(a => visited.add(a));
      }
    }
    
    return clusters;
  }
  
  private findConnectedAddresses(
    start: Address,
    candidates: Address[],
    threshold: number
  ): Address[] {
    const cluster = [start];
    const addressScores = this.scores.get(start);
    if (!addressScores) return cluster;
    
    // Find addresses that attest to each other
    for (const [, reputationScore] of addressScores) {
      for (const attestation of reputationScore.attestations) {
        if (candidates.includes(attestation.from) && !cluster.includes(attestation.from)) {
          // Check if reciprocal attestation exists
          const otherScores = this.scores.get(attestation.from);
          if (otherScores) {
            for (const [, otherRep] of otherScores) {
              const reciprocal = otherRep.attestations.find(a => a.from === start);
              if (reciprocal && attestation.weight >= threshold) {
                cluster.push(attestation.from);
              }
            }
          }
        }
      }
    }
    
    return cluster;
  }
}

export default ReputationGraph;
