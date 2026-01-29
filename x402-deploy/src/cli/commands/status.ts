import chalk from "chalk";

export async function statusCommand(): Promise<void> {
  console.log(chalk.bold("\n📡 Deployment Status\n"));
  console.log(chalk.dim("Status check coming soon..."));
}
