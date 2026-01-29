import chalk from "chalk";
import { 
  DashboardAPI, 
  formatDashboardCLI, 
  formatEarningsJSON, 
  formatCompactSummary,
  formatTrendsChart,
  formatNoData,
  formatError,
  formatLoading
} from "../../dashboard/index.js";

interface DashboardOptions {
  json?: boolean;
  days?: string;
  period?: "day" | "week" | "month" | "all";
  compact?: boolean;
  trends?: boolean;
}

export async function dashboardCommand(
  projectName?: string,
  options: DashboardOptions = {}
): Promise<void> {
  const api = new DashboardAPI();
  
  // If no project name provided, try to read from config
  const project = projectName || process.env.X402_PROJECT_NAME;
  
  if (!project) {
    console.log(formatError("No project specified. Use: x402 dashboard <project-name>"));
    console.log(chalk.dim("\nOr set X402_PROJECT_NAME environment variable."));
    return;
  }

  console.log(formatLoading(`Fetching dashboard for ${project}`));

  try {
    const dashboardData = await api.getFullDashboard(project);

    if (dashboardData.summary.totalPayments === 0) {
      console.log(formatNoData());
      console.log(chalk.dim("\nOnce you receive payments, they will appear here."));
      console.log(chalk.dim("Visit https://x402scan.com for more details.\n"));
      return;
    }

    // Output based on options
    if (options.json) {
      console.log(formatEarningsJSON(dashboardData));
    } else if (options.compact) {
      console.log("\n" + formatCompactSummary(dashboardData.summary) + "\n");
    } else if (options.trends) {
      console.log(formatTrendsChart(dashboardData.trends.daily));
    } else {
      console.log(formatDashboardCLI(dashboardData));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(formatError(message));
    console.log(chalk.dim("\nMake sure you have a valid API key set via X402_API_KEY."));
    console.log(chalk.dim("Visit https://x402scan.com to view your dashboard online.\n"));
  }
}
