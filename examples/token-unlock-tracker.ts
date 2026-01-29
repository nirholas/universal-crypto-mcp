/**
 * Token Unlock Tracker - Example Usage
 * 
 * This example demonstrates how to use the Token Unlock & Vesting Schedule Tracker
 * to monitor token unlocks and analyze their potential market impact.
 */

import { createUnlockTracker } from '../src/modules/token-unlocks/index.js';

async function main() {
  console.log('🔓 Token Unlock Tracker - Example Usage\n');

  // Create a new tracker instance
  const tracker = createUnlockTracker({
    alertThresholds: {
      minUnlockPercentage: 5,
      daysBeforeAlert: 7,
      minMarketCapForAlert: 10_000_000,
    },
  });

  // Example 1: Track Arbitrum ARB token
  console.log('📊 Example 1: Tracking Arbitrum ARB\n');

  const arbProject = {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ARB',
    chain: 'arbitrum',
    tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
    totalSupply: '10000000000',
    circulatingSupply: '1275000000',
    marketCap: '1500000000',
    currentPrice: '1.18',
    launchDate: new Date('2023-03-23'),
  };

  tracker.addProject(arbProject);
  console.log(`✅ Added ${arbProject.name} (${arbProject.symbol}) to tracker`);

  // Add team vesting schedule
  const teamSchedule = {
    id: 'arb-team',
    projectId: 'arbitrum',
    beneficiaryType: 'team' as const,
    totalTokens: '1762800000',
    cliffDuration: 365,
    cliffEnd: new Date('2024-03-23'),
    vestingDuration: 1461,
    vestingStart: new Date('2023-03-23'),
    vestingEnd: new Date('2027-03-23'),
    initialUnlock: '0',
    linearVesting: true,
  };

  tracker.addVestingSchedule(teamSchedule);
  console.log(`✅ Added team vesting schedule (${teamSchedule.totalTokens} tokens)\n`);

  // Add investor vesting schedule
  const investorSchedule = {
    id: 'arb-investors',
    projectId: 'arbitrum',
    beneficiaryType: 'investors' as const,
    totalTokens: '1750000000',
    cliffDuration: 365,
    cliffEnd: new Date('2024-03-23'),
    vestingDuration: 1461,
    vestingStart: new Date('2023-03-23'),
    vestingEnd: new Date('2027-03-23'),
    initialUnlock: '0',
    linearVesting: true,
  };

  tracker.addVestingSchedule(investorSchedule);
  console.log(`✅ Added investor vesting schedule (${investorSchedule.totalTokens} tokens)\n`);

  // Example 2: Get upcoming unlocks
  console.log('📅 Example 2: Upcoming Unlocks\n');

  const upcomingUnlocks = tracker.getUpcomingUnlocks('arbitrum', 5);
  console.log(`Next ${upcomingUnlocks.length} unlock events:`);
  upcomingUnlocks.forEach((unlock, i) => {
    const daysUntil = Math.ceil((unlock.date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    console.log(`  ${i + 1}. ${unlock.date.toISOString().split('T')[0]}`);
    console.log(`     • ${unlock.tokensUnlocked} tokens (${unlock.percentageOfCirculating.toFixed(2)}% of supply)`);
    console.log(`     • ${unlock.beneficiaryType} ${unlock.isCliffEvent ? '(CLIFF EVENT)' : ''}`);
    console.log(`     • ${daysUntil} days from now`);
  });
  console.log();

  // Example 3: Market Impact Analysis
  console.log('⚠️  Example 3: Market Impact Analysis\n');

  const marketImpact = tracker.getMarketImpactAnalysis('arbitrum');
  console.log(`Analyzing ${marketImpact.length} upcoming unlocks:\n`);

  marketImpact.slice(0, 3).forEach((analysis, i) => {
    console.log(`📊 Unlock #${i + 1}:`);
    console.log(`   Date: ${analysis.unlockEvent.date.toISOString().split('T')[0]}`);
    console.log(`   Risk Level: ${analysis.riskLevel.toUpperCase()}`);
    console.log(`   Impact Score: ${analysis.impactScore}/100`);
    console.log(`   Tokens: ${analysis.unlockEvent.tokensUnlocked} (${analysis.factors.unlockSize.toFixed(2)}% of supply)`);
    console.log(`   Hodl Probability: ${analysis.factors.hodlProbability}%`);
    console.log(`   Estimated Price Impact: ${analysis.estimatedPriceImpact.neutral}`);
    console.log(`   Recommendations:`);
    analysis.recommendations.forEach(rec => {
      console.log(`     • ${rec}`);
    });
    console.log();
  });

  // Example 4: Vesting Analytics
  console.log('📈 Example 4: Vesting Analytics\n');

  const analytics = tracker.getVestingAnalytics('arbitrum');
  if (analytics) {
    console.log(`Project: ${analytics.project.name} (${analytics.project.symbol})`);
    console.log(`Total Supply: ${analytics.project.totalSupply}`);
    console.log(`Circulating: ${analytics.project.circulatingSupply}`);
    console.log();
    console.log(`Vesting Statistics:`);
    console.log(`  • Total Vested: ${analytics.statistics.totalVested}`);
    console.log(`  • Total Unlocked: ${analytics.statistics.totalUnlocked}`);
    console.log(`  • Percentage Vested: ${analytics.statistics.percentageVested.toFixed(2)}%`);
    console.log(`  • Unlock Frequency: ${analytics.statistics.unlockFrequency}`);
    console.log(`  • Next Unlock: ${analytics.statistics.nextUnlockDate?.toISOString().split('T')[0]}`);
    console.log(`  • Fully Unlocked By: ${analytics.fullyUnlockedDate.toISOString().split('T')[0]}`);
    console.log();
    console.log(`Remaining Tokens:`);
    console.log(`  • Team: ${analytics.teamTokensRemaining}`);
    console.log(`  • Investors: ${analytics.investorTokensRemaining}`);
    console.log();
    console.log(`Risk Assessment:`);
    const highRiskCount = analytics.marketImpact.filter(a => a.riskLevel === 'high' || a.riskLevel === 'critical').length;
    console.log(`  • High Risk Unlocks: ${highRiskCount}/${analytics.marketImpact.length}`);
  }
  console.log();

  // Example 5: Calendar View
  console.log('📅 Example 5: Unlock Calendar (Next 90 Days)\n');

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 90);

  const calendar = tracker.getUnlockCalendar(startDate, endDate);
  console.log(`Found ${calendar.length} days with unlock events:\n`);

  calendar.slice(0, 5).forEach(day => {
    console.log(`${day.date.toISOString().split('T')[0]}:`);
    console.log(`  • ${day.events.length} events affecting ${day.projectsAffected} project(s)`);
    day.events.forEach(event => {
      const project = tracker.getProject(event.projectId);
      console.log(`    - ${project?.name}: ${event.tokensUnlocked} tokens (${event.beneficiaryType})`);
    });
  });
  console.log();

  // Example 6: Search & Filter
  console.log('🔍 Example 6: Search for High-Risk Unlocks\n');

  const searchResults = tracker.searchUnlocks({
    startDate: new Date(),
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // next 180 days
    riskLevels: ['high', 'critical'],
  });

  console.log(`Found ${searchResults.length} high-risk unlock events in the next 6 months`);
  searchResults.slice(0, 3).forEach(event => {
    const project = tracker.getProject(event.projectId);
    console.log(`  • ${project?.name} - ${event.date.toISOString().split('T')[0]}`);
    console.log(`    ${event.percentageOfCirculating.toFixed(2)}% of supply, ${event.beneficiaryType}`);
  });
  console.log();

  // Example 7: Alerts
  console.log('🔔 Example 7: Active Alerts\n');

  const alerts = tracker.getAlerts(false);
  console.log(`You have ${alerts.length} active alerts:`);

  alerts.slice(0, 5).forEach(alert => {
    const icon = alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${alert.severity.toUpperCase()}] ${alert.message}`);
    console.log(`   ${alert.daysUntil} days until event`);
  });
  console.log();

  // Example 8: Tracker Statistics
  console.log('📊 Example 8: Tracker Statistics\n');

  const stats = tracker.getTrackerStats();
  console.log(`Tracker Overview:`);
  console.log(`  • Total Projects: ${stats.totalProjects}`);
  console.log(`  • Total Schedules: ${stats.totalSchedules}`);
  console.log(`  • Upcoming Unlocks: ${stats.upcomingUnlocks}`);
  console.log(`  • Critical Alerts: ${stats.criticalAlerts}`);

  if (stats.nextMajorUnlock) {
    console.log();
    console.log(`Next Major Unlock:`);
    console.log(`  • Project: ${stats.nextMajorUnlock.project}`);
    console.log(`  • Date: ${stats.nextMajorUnlock.date.toISOString().split('T')[0]}`);
    console.log(`  • Amount: ${stats.nextMajorUnlock.amount} tokens`);
  }
  console.log();

  console.log('✅ Example completed successfully!');
}

main().catch(console.error);
