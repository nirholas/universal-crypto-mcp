
![ChatGPT Image May 23, 2025, 10_25_41 AM](https://github.com/user-attachments/assets/fe40d718-d1d8-44e9-a8a4-a5ad39153218)

# Dune API MCP Server

This project implements a Model Context Protocol (MCP) server that exposes functionality from the Dune API, allowing LLM agents and other MCP clients to analyze blockchain information.

## Features

The server provides the following MCP tools and resources based on the Dune API:

**EVM Tools:**
*   `get_evm_balances`: Fetches EVM token balances for a wallet.
*   `get_evm_activity`: Fetches EVM account activity.
*   `get_evm_collectibles`: Fetches EVM NFT collectibles.
*   `get_evm_transactions`: Retrieves granular EVM transaction details.
*   `get_evm_token_info`: Fetches metadata and price for EVM tokens.
*   `get_evm_token_holders`: Discovers EVM token holder distributions.

**SVM Tools:**
*   `get_svm_balances`: Fetches SVM token balances.
*   `get_svm_transactions`: Fetches SVM transactions (Solana only).

**Resources:**
*   `dune://evm/supported-chains`: Provides a list of EVM chains supported by the Dune API.

**Prompts:**
*   `/evm_wallet_overview {walletAddress}`: Get a quick overview of an EVM wallet.
*   `/analyze_erc20_token {chainId} {tokenAddress}`: Analyze a specific ERC20 token.
*   `/svm_address_check {walletAddress}`: Check basic information for an SVM address.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/crazyrabbitLTC/mcp-web3-stats.git
cd mcp-web3-stats

# Install dependencies
bun install

# Create .env file with your Dune API key
echo "DUNE_API_KEY=your_actual_dune_api_key_here" > .env

# Start the server
bun start

# In a separate terminal, run the MCP Inspector to test the tools
npx @modelcontextprotocol/inspector bun run index.ts
```

## Installation from npm

You can install the Web3 Stats Server globally via npm:

```bash
# Install globally
npm install -g mcp-web3-stats

# Set your Dune API key as an environment variable
export DUNE_API_KEY=your_actual_dune_api_key_here

# Run the server
mcp-web3-stats

# In a separate terminal, test with the MCP Inspector
npx @modelcontextprotocol/inspector mcp-web3-stats
```

Alternatively, you can run it directly with npx:

```bash
# Set your Dune API key as an environment variable
export DUNE_API_KEY=your_actual_dune_api_key_here

# Run the server with npx
npx mcp-web3-stats

# In a separate terminal, test with the MCP Inspector
npx @modelcontextprotocol/inspector npx mcp-web3-stats
```

## What You Can Do With This

This MCP server allows you and your AI assistant to analyze blockchain data and wallet information directly. Here are some example use cases:

### 1. Check Wallet Balances

You can quickly view all tokens (including ERC20s and NFTs) held by any wallet address:

```
Assistant: Let me check the balances in this wallet for you.

[Uses get_evm_balances with walletAddress=0xYourWalletAddress]

This wallet contains:
- 1.25 ETH (~$3,800)
- 500 USDC ($500)
- Several NFTs including a CryptoPunk and two Bored Apes
```

### 2. Analyze Token Information and Holders

You can research specific tokens and their distribution:

```
Assistant: Let me analyze this token for you.

[Uses get_evm_token_info with chainId=1 and tokenAddress=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984]

UNI Token Information:
- Current price: $5.32
- Market cap: $2.7B 
- 24h trading volume: $89M

[Uses get_evm_token_holders with chainId=1 and tokenAddress=0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984]

Top UNI Token Holders:
1. 0x47173B170C64d16393a52e6C480b3Ad8c302ba1e: 5.2% of supply
2. 0x1a9C8182C09F50C8318d769245beA52c32BE35BC: 3.8% of supply
...
```

### 3. Review Recent Transactions

You can analyze transaction history for any address:

```
Assistant: Here's a summary of recent transactions.

[Uses get_evm_transactions with walletAddress=0xYourWalletAddress]

Recent activity:
- Yesterday: Swapped 2 ETH for 3,500 UNI on Uniswap
- 3 days ago: Withdrew 5 ETH from Binance
- Last week: Minted an NFT for 0.08 ETH
```

### 4. Check Solana Balances

You can also analyze Solana wallets:

```
Assistant: Let me check your Solana wallet balances.

[Uses get_svm_balances with walletAddress=YourSolanaAddress]

This wallet contains:
- 12.5 SOL (~$875)
- 2,500 USDC ($2,500)
- Several SPL tokens including 150 BONK
```

Configure this server with Claude Desktop or other MCP clients to enable your AI assistant to retrieve and analyze on-chain data in real time.

## Prerequisites

*   [Bun](https://bun.sh/) (latest version recommended)
*   A Dune API Key from [Sim API](https://docs.sim.dune.com/)

## Setup

1.  **Clone the repository (if applicable) or ensure you have the project files.**

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the project root and add your Dune API key:
    ```env
    DUNE_API_KEY=your_actual_dune_api_key_here
    ```
    Replace `your_actual_dune_api_key_here` with your valid key.

## Running the Server

*   **To run the server directly using Bun (for development/testing):**
    ```bash
    bun start
    ```
    The server will start and listen for MCP messages via stdio.

*   **To build the server to JavaScript (for environments that require JS):**
    Use the configured build script which utilizes the TypeScript compiler (`tsc`):
    ```bash
    bun run build
    ```
    This command executes `bunx tsc` as defined in `package.json`. `tsc` uses the `tsconfig.json` file to determine entry points (like `index.ts`) and compilation options, outputting the JavaScript files to the `./dist` directory.

    You can then run the built server with Node.js or Bun:
    ```bash
    node dist/index.js 
    # or
    bun dist/index.js
    ```

    *Alternatively, if you wish to use Bun's built-in bundler directly (which may have different behavior or configuration needs than `tsc`), you would typically specify the entry point explicitly:* 
    *`bun build ./index.ts --outdir ./dist`* 
    *However, this project is set up to use `tsc` for builds via the `bun run build` script.*

## Testing with MCP Inspector

Once the server is running (e.g., via `bun start` in one terminal), you can connect to it using the MCP Inspector in another terminal:

```bash
# If running the TypeScript source directly
npx @modelcontextprotocol/inspector bun run index.ts
```
Or, if you have built the server and are running the JavaScript version:
```bash
# If running the built JavaScript version from ./dist
npx @modelcontextprotocol/inspector node dist/index.js
```

This will launch the Inspector UI, allowing you to discover and test the tools, resources, and prompts provided by this server.

## Integrating with MCP Clients (e.g., Claude Desktop)

To use this server with an MCP client like Claude Desktop, you'll need to configure the client to launch this server. For Claude Desktop, you would modify its `claude_desktop_config.json` file (typically found at `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows).

Below are example configurations. You can choose a server name (e.g., `dune_api_server` or `web3_stats_server`) that makes sense to you.

**Example 1: Running the built JavaScript version with Node.js (Recommended for stability)**

This assumes you have already run `bun run build` to create the `./dist` directory.

```json
{
  "mcpServers": {
    "dune_api_server": { // You can name this server entry whatever you like
      "command": "node",
      "args": [
        "/ABSOLUTE/PATH/TO/YOUR/mcp-web3-stats/dist/index.js"
      ],
      "env": {
        "DUNE_API_KEY": "your_actual_dune_api_key_here" // Replace with your key
      }
    }
  }
}
```

**Example 2: Running the TypeScript source directly with Bun**

This is convenient for development but might require specifying the full path to your Bun executable.

```json
{
  "mcpServers": {
    "dune_api_server_dev": { // You can name this server entry whatever you like
      "command": "/full/path/to/your/bun/executable", // e.g., /Users/username/.bun/bin/bun or C:\Users\username\.bun\bin\bun.exe
      "args": [
        "run",
        "/ABSOLUTE/PATH/TO/YOUR/mcp-web3-stats/index.ts"
      ],
      "env": {
        "DUNE_API_KEY": "your_actual_dune_api_key_here" // Replace with your key
      }
    }
  }
}
```

**Important Configuration Notes:**

*   **API Key:** You **MUST** replace `"your_actual_dune_api_key_here"` in the `env` block with your actual Dune API key. While the server script includes `dotenv` to load a local `.env` file, relying on the client (like Claude Desktop) to pass the environment variable via its configuration is more reliable for servers launched by external hosts.
*   **Absolute Paths:** You **MUST** replace `/ABSOLUTE/PATH/TO/YOUR/...` with the correct and full absolute path to the `dist/index.js` file (for Node) or `index.ts` file (for Bun direct execution) and to the Bun executable if running TypeScript directly.
*   **Bun Executable Path:** If using Bun directly (Example 2), the `command` might need to be the full, absolute path to your Bun executable (e.g., `~/.bun/bin/bun` on macOS/Linux, or the equivalent path on Windows) if it's not universally in the PATH for applications like Claude Desktop.
*   **Restart Client:** After saving changes to `claude_desktop_config.json`, you must restart Claude Desktop for the changes to take effect.
