import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getChains, getChainById } from "../services/chainService.js";
import { getBalance } from "../services/accountService.js";
import { readContract } from "../services/contractService.js";
import { prepareTransaction, getTransaction, submitTransaction } from "../services/transactionService.js";
import { logger } from "../utils/logger.js";

// Create MCP server instance
export const server = new McpServer({
  name: "mcp-blockchain-server",
  version: "0.1.0",
});

// Initialize tools
export function initializeTools() {
  // Get supported chains
  server.tool(
    "get-chains",
    "Get list of supported blockchain networks",
    {},
    async () => {
      try {
        const chains = await getChains();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(chains, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error("Error in get-chains tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error fetching chains: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get account balance
  server.tool(
    "get-balance",
    "Get account balance for an address on a specific chain",
    {
      chainId: z.string().describe("Chain ID (e.g., '1' for Ethereum Mainnet)"),
      address: z.string().describe("Wallet address to check balance for"),
    },
    async ({ chainId, address }) => {
      try {
        const balance = await getBalance(chainId, address);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(balance, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error("Error in get-balance tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error fetching balance: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Read contract
  server.tool(
    "read-contract",
    "Read data from a smart contract",
    {
      chainId: z.string().describe("Chain ID (e.g., '1' for Ethereum Mainnet)"),
      address: z.string().describe("Contract address"),
      method: z.string().describe("Contract method to call"),
      args: z.array(z.any()).optional().describe("Arguments for the contract method (optional)"),
    },
    async ({ chainId, address, method, args }) => {
      try {
        const result = await readContract(chainId, address, method, args || []);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error("Error in read-contract tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error reading contract: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Prepare transaction
  server.tool(
    "prepare-transaction",
    "Prepare an unsigned transaction for user approval",
    {
      chainId: z.string().describe("Chain ID (e.g., '1' for Ethereum Mainnet)"),
      to: z.string().describe("Recipient address"),
      value: z.string().optional().describe("Amount to send in ETH/native token (optional)"),
      data: z.string().optional().describe("Transaction data for contract interactions (optional)"),
      gasLimit: z.string().optional().describe("Gas limit for the transaction (optional)"),
    },
    async ({ chainId, to, value, data, gasLimit }) => {
      try {
        const chain = await getChainById(chainId);
        if (!chain) {
          return {
            content: [
              {
                type: "text",
                text: `Chain with ID ${chainId} not found.`,
              },
            ],
            isError: true,
          };
        }

        const transaction = await prepareTransaction({
          chainId,
          to,
          value: value || "0",
          data: data || "0x",
          gasLimit: gasLimit || undefined,
          userId: "system", // In a real implementation, this would come from authentication
        });

        const transactionUrl = `${process.env.WEB_DAPP_URL}/tx/${transaction.id}`;

        return {
          content: [
            {
              type: "text",
              text: `Transaction prepared successfully.\n\nTransaction URL: ${transactionUrl}\n\nPlease share this URL with the user to review and approve the transaction.`,
            },
          ],
        };
      } catch (error) {
        logger.error("Error in prepare-transaction tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error preparing transaction: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Get transaction status
  server.tool(
    "get-transaction-status",
    "Get the current status of a transaction",
    {
      uuid: z.string().uuid().describe("Transaction UUID"),
    },
    async ({ uuid }) => {
      try {
        const transaction = await getTransaction(uuid);
        if (!transaction) {
          return {
            content: [
              {
                type: "text",
                text: `Transaction with UUID ${uuid} not found.`,
              },
            ],
            isError: true,
          };
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(transaction, null, 2),
            },
          ],
        };
      } catch (error) {
        logger.error("Error in get-transaction-status tool:", error);
        return {
          content: [
            {
              type: "text",
              text: `Error fetching transaction: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  logger.info("MCP tools initialized");
}

// Start the MCP server
export async function startMcpServer() {
  // Initialize tools
  initializeTools();

  // Create transport
  const transport = new StdioServerTransport();

  // Connect server to transport
  await server.connect(transport);
  
  logger.info("MCP Server started on stdio transport");
  
  return server;
}
