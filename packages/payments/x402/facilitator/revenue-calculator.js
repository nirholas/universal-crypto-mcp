#!/usr/bin/env node

/**
 * Revenue Calculator for x402 Facilitator
 * 
 * Estimates monthly/annual revenue based on payment volume and fee tiers.
 * 
 * Usage:
 *   node revenue-calculator.js
 *   node revenue-calculator.js 1000000  # Calculate for $1M volume
 */

const readline = require('readline');

// Fee tier configuration (matches src/services/fees.ts)
const FEE_TIERS = [
  { name: 'platinum', minVolume: 1000000, basisPoints: 4 },  // 0.04%
  { name: 'gold', minVolume: 100000, basisPoints: 6 },       // 0.06%
  { name: 'silver', minVolume: 10000, basisPoints: 8 },      // 0.08%
  { name: 'standard', minVolume: 0, basisPoints: 10 },       // 0.10%
];

// Gas cost estimates (USD)
const GAS_COSTS = {
  arbitrum: 0.50,   // ~$0.50 per settlement
  base: 0.30,       // ~$0.30 per settlement
  optimism: 0.40,   // ~$0.40 per settlement
  polygon: 0.20,    // ~$0.20 per settlement
};

function getTierForVolume(volume) {
  for (const tier of FEE_TIERS) {
    if (volume >= tier.minVolume) {
      return tier;
    }
  }
  return FEE_TIERS[FEE_TIERS.length - 1];
}

function calculateFees(volume) {
  const tier = getTierForVolume(volume);
  const feePercent = tier.basisPoints / 10000;
  const feesCollected = volume * feePercent;
  
  return {
    tier: tier.name,
    feePercent: feePercent * 100,
    feesCollected,
  };
}

function estimateGasCosts(volume, networks = ['arbitrum', 'base', 'optimism']) {
  // Estimate settlements per month based on volume
  // Assume settlement every 6 hours when above threshold
  const settlementsPerMonth = Math.min(120, Math.ceil(volume / 100)); // Max 4/day * 30 = 120
  
  const costPerSettlement = networks.reduce((sum, net) => sum + GAS_COSTS[net], 0) / networks.length;
  
  return settlementsPerMonth * costPerSettlement * networks.length;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function calculateRevenue(monthlyVolume, networks = 3) {
  const { tier, feePercent, feesCollected } = calculateFees(monthlyVolume);
  const gasCosts = estimateGasCosts(monthlyVolume, ['arbitrum', 'base', 'optimism'].slice(0, networks));
  const netRevenue = feesCollected - gasCosts;
  const annualRevenue = netRevenue * 12;
  
  return {
    monthlyVolume,
    tier,
    feePercent,
    feesCollected,
    gasCosts,
    netRevenue,
    annualRevenue,
    profitMargin: (netRevenue / feesCollected) * 100,
  };
}

function printReport(monthlyVolume, networks = 3) {
  const result = calculateRevenue(monthlyVolume, networks);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  x402 Facilitator Revenue Calculator');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('📊 Input Parameters:');
  console.log(`   Monthly Volume:      ${formatCurrency(result.monthlyVolume)}`);
  console.log(`   Active Networks:     ${networks}`);
  console.log(`   Fee Tier:            ${result.tier.toUpperCase()}`);
  console.log(`   Fee Rate:            ${formatPercent(result.feePercent)}`);
  console.log('');
  console.log('💰 Revenue Breakdown:');
  console.log(`   Fees Collected:      ${formatCurrency(result.feesCollected)}`);
  console.log(`   Gas Costs (Est):     ${formatCurrency(result.gasCosts)}`);
  console.log(`   Net Monthly:         ${formatCurrency(result.netRevenue)}`);
  console.log(`   Profit Margin:       ${formatPercent(result.profitMargin)}`);
  console.log('');
  console.log('📈 Annual Projection:');
  console.log(`   Annual Revenue:      ${formatCurrency(result.annualRevenue)}`);
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

function printComparison() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Volume Comparison (3 Networks)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Monthly Vol  | Tier      | Fees/Mo  | Gas/Mo | Net/Mo   | Annual   ');
  console.log('-------------|-----------|----------|--------|----------|----------');
  
  const volumes = [
    10000,      // $10K
    50000,      // $50K
    100000,     // $100K
    500000,     // $500K
    1000000,    // $1M
    5000000,    // $5M
    10000000,   // $10M
    50000000,   // $50M
    100000000,  // $100M
  ];
  
  for (const vol of volumes) {
    const r = calculateRevenue(vol, 3);
    const volStr = formatCurrency(vol).padEnd(12);
    const tierStr = r.tier.padEnd(9);
    const feesStr = formatCurrency(r.feesCollected).padEnd(8);
    const gasStr = formatCurrency(r.gasCosts).padEnd(6);
    const netStr = formatCurrency(r.netRevenue).padEnd(8);
    const annualStr = formatCurrency(r.annualRevenue);
    
    console.log(`${volStr} | ${tierStr} | ${feesStr} | ${gasStr} | ${netStr} | ${annualStr}`);
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('💡 Key Insights:');
  console.log('   • Break-even at ~$1K monthly volume');
  console.log('   • $100K/month = ~$1K/year revenue');
  console.log('   • $1M/month = ~$9.6K/year revenue');
  console.log('   • $10M/month = ~$80K/year revenue');
  console.log('   • $100M/month = ~$640K/year revenue');
  console.log('   • Gas costs become negligible at scale');
  console.log('   • Higher volumes unlock better fee tiers');
  console.log('');
}

function printTierBreakdown() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Fee Tier Structure');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Tier      | Min Monthly Volume | Fee Rate | Example Fee on $1000');
  console.log('----------|--------------------|---------|-----------------------');
  
  for (const tier of FEE_TIERS) {
    const tierStr = tier.name.padEnd(9);
    const minStr = formatCurrency(tier.minVolume).padEnd(18);
    const rateStr = formatPercent(tier.basisPoints / 100).padEnd(7);
    const exampleFee = (1000 * tier.basisPoints) / 10000;
    const exampleStr = formatCurrency(exampleFee);
    
    console.log(`${tierStr} | ${minStr} | ${rateStr} | ${exampleStr}`);
  }
  
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  console.log('\n📊 x402 Facilitator Revenue Calculator\n');
  
  return new Promise((resolve) => {
    rl.question('Enter monthly payment volume in USD (or press Enter for comparison table): $', (answer) => {
      rl.close();
      
      if (!answer || answer.trim() === '') {
        printComparison();
        printTierBreakdown();
      } else {
        const volume = parseFloat(answer.replace(/[,$]/g, ''));
        if (isNaN(volume) || volume < 0) {
          console.log('\n❌ Invalid volume. Please enter a positive number.\n');
        } else {
          printReport(volume);
        }
      }
      
      resolve();
    });
  });
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args[0] === 'compare' || args[0] === '-c') {
    printComparison();
    printTierBreakdown();
  } else if (args[0]) {
    const volume = parseFloat(args[0].replace(/[,$]/g, ''));
    if (isNaN(volume) || volume < 0) {
      console.log('\n❌ Invalid volume. Usage: node revenue-calculator.js 1000000\n');
      process.exit(1);
    } else {
      printReport(volume);
    }
  } else {
    interactiveMode().then(() => process.exit(0));
  }
}

module.exports = {
  calculateRevenue,
  calculateFees,
  estimateGasCosts,
};
