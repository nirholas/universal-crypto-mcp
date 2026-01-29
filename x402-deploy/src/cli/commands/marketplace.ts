/**
 * CLI Marketplace Commands
 *
 * Commands to interact with the x402 API marketplace from the CLI.
 */

import chalk from "chalk";
import Table from "cli-table3";
import { prompt } from "enquirer";
import ora from "ora";
import type { X402Config } from "../../types/config.js";

const MARKETPLACE_API_URL =
  process.env.X402_MARKETPLACE_URL || "https://marketplace.x402.org/api/v1";

interface MarketplaceListOptions {
  category?: string;
  verified?: boolean;
  json?: boolean;
}

interface MarketplaceSearchOptions {
  json?: boolean;
}

/**
 * List marketplace APIs
 */
export async function marketplaceListCommand(
  options: MarketplaceListOptions
): Promise<void> {
  const spinner = ora("Fetching marketplace listings...").start();

  try {
    const params = new URLSearchParams();
    if (options.category) params.set("category", options.category);
    if (options.verified !== undefined)
      params.set("verified", String(options.verified));

    const url = `${MARKETPLACE_API_URL}/listings?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const { listings } = await response.json();
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(listings, null, 2));
      return;
    }

    if (listings.length === 0) {
      console.log(chalk.yellow("\nNo APIs found matching your criteria.\n"));
      return;
    }

    console.log(
      chalk.bold.cyan(`\n🏪 x402 Marketplace (${listings.length} APIs)\n`)
    );

    const table = new Table({
      head: ["Name", "Category", "Price", "Rating", "Calls", "✓"],
      colWidths: [25, 20, 15, 10, 10, 5],
      style: {
        head: ["cyan"],
        border: ["gray"],
      },
    });

    for (const listing of listings.slice(0, 20)) {
      table.push([
        listing.featured
          ? chalk.yellow("⭐ ") + listing.name
          : listing.name,
        listing.category.join(", "),
        `$${listing.pricing.basePrice}`,
        "⭐".repeat(Math.round(listing.stats.rating)),
        listing.stats.totalCalls.toLocaleString(),
        listing.verified ? chalk.green("✓") : "",
      ]);
    }

    console.log(table.toString());
    console.log(
      chalk.dim(
        `\nShowing ${Math.min(20, listings.length)} of ${listings.length} results`
      )
    );
    console.log(
      chalk.dim('Run "x402-deploy marketplace view <api-id>" for details\n')
    );
  } catch (error) {
    spinner.fail("Failed to fetch marketplace");
    console.error(chalk.red(String(error)));
  }
}

/**
 * View a specific API's details
 */
export async function marketplaceViewCommand(apiId: string): Promise<void> {
  const spinner = ora("Fetching API details...").start();

  try {
    const response = await fetch(`${MARKETPLACE_API_URL}/listings/${apiId}`);

    if (!response.ok) {
      if (response.status === 404) {
        spinner.fail("API not found");
        return;
      }
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const api = await response.json();
    spinner.stop();

    console.log("\n" + chalk.bold.cyan("═".repeat(60)));
    console.log(chalk.bold(api.featured ? "⭐ " + api.name : api.name));
    console.log(chalk.dim(api.description));
    console.log(chalk.bold.cyan("═".repeat(60)) + "\n");

    console.log(chalk.bold("📊 Stats:"));
    console.log(
      `  Rating:  ${"⭐".repeat(Math.round(api.stats.rating))} (${api.stats.rating.toFixed(1)}/5) from ${api.stats.reviews} reviews`
    );
    console.log(`  Calls:   ${api.stats.totalCalls.toLocaleString()}`);
    console.log(`  Revenue: $${api.stats.totalRevenue}`);
    console.log(
      `  Owner:   ${api.owner.slice(0, 10)}...${api.owner.slice(-8)}`
    );

    console.log(chalk.bold("\n💰 Pricing:"));
    console.log(`  Model:    ${api.pricing.model}`);
    console.log(`  Price:    $${api.pricing.basePrice} ${api.pricing.currency}`);

    console.log(chalk.bold("\n🔗 Access:"));
    console.log(`  URL:      ${chalk.cyan(api.url)}`);

    if (api.reviews && api.reviews.length > 0) {
      console.log(chalk.bold("\n💬 Recent Reviews:"));
      for (const review of api.reviews.slice(0, 3)) {
        console.log(`  ${"⭐".repeat(review.rating)} - ${review.comment}`);
        console.log(
          chalk.dim(
            `    by ${review.reviewer.slice(0, 8)}... on ${new Date(review.timestamp).toLocaleDateString()}`
          )
        );
      }
    }

    console.log("\n" + chalk.bold.cyan("═".repeat(60)) + "\n");
  } catch (error) {
    spinner.fail("Failed to fetch API details");
    console.error(chalk.red(String(error)));
  }
}

/**
 * Search marketplace APIs
 */
export async function marketplaceSearchCommand(
  query: string,
  options: MarketplaceSearchOptions
): Promise<void> {
  const spinner = ora(`Searching for "${query}"...`).start();

  try {
    const params = new URLSearchParams({ search: query });
    const response = await fetch(
      `${MARKETPLACE_API_URL}/listings?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const { listings } = await response.json();
    spinner.stop();

    if (options.json) {
      console.log(JSON.stringify(listings, null, 2));
      return;
    }

    if (listings.length === 0) {
      console.log(chalk.yellow(`\nNo APIs found for "${query}".\n`));
      return;
    }

    console.log(
      chalk.bold.cyan(`\n🔍 Search Results for "${query}" (${listings.length} APIs)\n`)
    );

    const table = new Table({
      head: ["Name", "Category", "Price", "Rating", "✓"],
      colWidths: [30, 20, 12, 10, 5],
      style: {
        head: ["cyan"],
        border: ["gray"],
      },
    });

    for (const listing of listings.slice(0, 15)) {
      table.push([
        listing.featured ? chalk.yellow("⭐ ") + listing.name : listing.name,
        listing.category.join(", "),
        `$${listing.pricing.basePrice}`,
        "⭐".repeat(Math.round(listing.stats.rating)),
        listing.verified ? chalk.green("✓") : "",
      ]);
    }

    console.log(table.toString());
    console.log(
      chalk.dim('Run "x402-deploy marketplace view <api-id>" for details\n')
    );
  } catch (error) {
    spinner.fail("Failed to search marketplace");
    console.error(chalk.red(String(error)));
  }
}

/**
 * Publish an API to the marketplace
 */
export async function marketplacePublishCommand(): Promise<void> {
  console.log(chalk.bold.cyan("\n🚀 Publish to x402 Marketplace\n"));

  // Check if config exists
  let config: X402Config | null = null;
  try {
    const { loadConfig } = await import("../../utils/detect.js");
    config = (await loadConfig?.(process.cwd())) || null;
  } catch {
    // Config not found, will prompt for wallet
  }

  const answers = await prompt<{
    name: string;
    description: string;
    category: string;
    url: string;
    pricing: string;
    wallet?: string;
  }>([
    {
      type: "input",
      name: "name",
      message: "API Name:",
      validate: (v) => (v.length > 0 ? true : "Name is required"),
    },
    {
      type: "input",
      name: "description",
      message: "Description:",
      validate: (v) => (v.length > 0 ? true : "Description is required"),
    },
    {
      type: "select",
      name: "category",
      message: "Category:",
      choices: [
        "AI/ML",
        "Trading",
        "Data",
        "Analytics",
        "Blockchain",
        "Social",
        "Media",
        "Other",
      ],
    },
    {
      type: "input",
      name: "url",
      message: "API URL:",
      validate: (v) => {
        try {
          new URL(v);
          return true;
        } catch {
          return "Please enter a valid URL";
        }
      },
    },
    {
      type: "input",
      name: "pricing",
      message: "Base price per call (e.g., 0.001):",
      validate: (v) =>
        !isNaN(parseFloat(v)) && parseFloat(v) > 0
          ? true
          : "Please enter a valid price",
    },
    ...(config?.payment?.wallet
      ? []
      : [
          {
            type: "input" as const,
            name: "wallet" as const,
            message: "Your wallet address (0x...):",
            validate: (v: string) =>
              /^0x[a-fA-F0-9]{40}$/.test(v)
                ? true
                : "Please enter a valid Ethereum address",
          },
        ]),
  ]);

  const walletAddress =
    config?.payment?.wallet || (answers.wallet as `0x${string}`);

  const spinner = ora("Publishing to marketplace...").start();

  try {
    const response = await fetch(`${MARKETPLACE_API_URL}/listings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: answers.name,
        description: answers.description,
        owner: walletAddress,
        url: answers.url,
        category: [answers.category],
        pricing: {
          model: "per-call",
          basePrice: answers.pricing,
          currency: "USDC",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const listing = await response.json();
    spinner.succeed("Published to marketplace!");

    console.log(chalk.green("\n✓ Your API is now live on the marketplace!"));
    console.log(
      chalk.cyan(
        `  View at: https://marketplace.x402.org/api/${listing.id}\n`
      )
    );
    console.log(chalk.dim("Tips:"));
    console.log(chalk.dim("  • Add a .well-known/x402 discovery document"));
    console.log(chalk.dim("  • Register with x402scan for better visibility"));
    console.log(chalk.dim("  • Ask users to leave reviews\n"));
  } catch (error) {
    spinner.fail("Failed to publish");
    console.error(chalk.red(String(error)));
  }
}

/**
 * Show marketplace categories
 */
export async function marketplaceCategoriesCommand(): Promise<void> {
  const spinner = ora("Fetching categories...").start();

  try {
    const response = await fetch(`${MARKETPLACE_API_URL}/categories`);

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    const { categories } = await response.json();
    spinner.stop();

    console.log(chalk.bold.cyan("\n📁 Marketplace Categories\n"));

    const table = new Table({
      head: ["Category", "APIs"],
      colWidths: [30, 10],
      style: {
        head: ["cyan"],
        border: ["gray"],
      },
    });

    for (const cat of categories) {
      table.push([cat.category, cat.count.toString()]);
    }

    console.log(table.toString());
    console.log(
      chalk.dim(
        '\nUse "x402-deploy marketplace list --category <name>" to filter\n'
      )
    );
  } catch (error) {
    spinner.fail("Failed to fetch categories");
    console.error(chalk.red(String(error)));
  }
}

/**
 * Submit a review for an API
 */
export async function marketplaceReviewCommand(apiId: string): Promise<void> {
  console.log(chalk.bold.cyan("\n⭐ Submit a Review\n"));

  // First, get the API details
  const spinner = ora("Fetching API details...").start();
  try {
    const response = await fetch(`${MARKETPLACE_API_URL}/listings/${apiId}`);
    if (!response.ok) {
      spinner.fail("API not found");
      return;
    }
    const api = await response.json();
    spinner.stop();
    console.log(chalk.dim(`Reviewing: ${api.name}\n`));
  } catch {
    spinner.fail("Failed to fetch API details");
    return;
  }

  const answers = await prompt<{
    rating: string;
    comment: string;
    wallet: string;
  }>([
    {
      type: "select",
      name: "rating",
      message: "Your rating:",
      choices: [
        { name: "5", message: "⭐⭐⭐⭐⭐ Excellent" },
        { name: "4", message: "⭐⭐⭐⭐ Good" },
        { name: "3", message: "⭐⭐⭐ Average" },
        { name: "2", message: "⭐⭐ Below Average" },
        { name: "1", message: "⭐ Poor" },
      ],
    },
    {
      type: "input",
      name: "comment",
      message: "Your review (optional):",
    },
    {
      type: "input",
      name: "wallet",
      message: "Your wallet address (for attribution):",
      validate: (v) =>
        /^0x[a-fA-F0-9]{40}$/.test(v)
          ? true
          : "Please enter a valid Ethereum address",
    },
  ]);

  const submitSpinner = ora("Submitting review...").start();

  try {
    const response = await fetch(
      `${MARKETPLACE_API_URL}/listings/${apiId}/reviews`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewer: answers.wallet,
          rating: parseInt(answers.rating, 10),
          comment: answers.comment || "No comment",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`);
    }

    submitSpinner.succeed("Review submitted!");
    console.log(chalk.green("\n✓ Thank you for your review!\n"));
  } catch (error) {
    submitSpinner.fail("Failed to submit review");
    console.error(chalk.red(String(error)));
  }
}
