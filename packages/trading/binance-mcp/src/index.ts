/**
 * Binance MCP Server
 *
 * Original Author: ethancod1ng
 * Original Repository: https://github.com/ethancod1ng/binance-mcp-server
 * License: MIT
 *
 * Integrated and Enhanced by: Nich (@nichxbt)
 * Website: x.com/nichxbt
 * GitHub: github.com/nirholas
 *
 * This integration maintains the original MIT license while adding
 * Apache-2.0 licensed enhancements for unified API compatibility.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import * as crypto from "crypto";

// ============================================================================
// Types
// ============================================================================

export interface BinanceConfig {
  apiKey?: string;
  apiSecret?: string;
  testnet?: boolean;
}

export interface TickerPrice {
  symbol: string;
  price: number;
  priceChange24h: number;
  priceChangePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume24h: number;
}

export interface OrderBook {
  symbol: string;
  bids: [number, number][];
  asks: [number, number][];
  lastUpdateId: number;
}

export interface Kline {
  openTime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteVolume: number;
  trades: number;
}

export interface Balance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue?: number;
}

export interface Order {
  symbol: string;
  orderId: number;
  clientOrderId: string;
  price: number;
  origQty: number;
  executedQty: number;
  status: string;
  type: string;
  side: string;
  time: number;
}

export interface OrderParams {
  symbol: string;
  side: "BUY" | "SELL";
  type: "MARKET" | "LIMIT" | "STOP_LOSS" | "STOP_LOSS_LIMIT" | "TAKE_PROFIT" | "TAKE_PROFIT_LIMIT";
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: "GTC" | "IOC" | "FOK";
}

// ============================================================================
// Binance Client
// ============================================================================

export class BinanceClient {
  private apiKey?: string;
  private apiSecret?: string;
  private baseUrl: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTTL = 5000; // 5 seconds for market data

  constructor(config: BinanceConfig = {}) {
    this.apiKey = config.apiKey || process.env.BINANCE_API_KEY;
    this.apiSecret = config.apiSecret || process.env.BINANCE_API_SECRET;
    this.baseUrl = config.testnet ? "https://testnet.binance.vision/api/v3" : "https://api.binance.com/api/v3";
  }

  private sign(queryString: string): string {
    if (!this.apiSecret) {
      throw new Error("API secret required for signed requests");
    }
    return crypto.createHmac("sha256", this.apiSecret).update(queryString).digest("hex");
  }

  private async publicRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.data as T;
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Binance API error: ${error.msg || response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data as T;
  }

  private async signedRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "DELETE" = "GET",
    params: Record<string, string> = {}
  ): Promise<T> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error("API key and secret required for authenticated requests");
    }

    const timestamp = Date.now().toString();
    const queryParams = { ...params, timestamp };
    const queryString = new URLSearchParams(queryParams).toString();
    const signature = this.sign(queryString);

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.search = `${queryString}&signature=${signature}`;

    const response = await fetch(url.toString(), {
      method,
      headers: {
        "X-MBX-APIKEY": this.apiKey,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Binance API error: ${error.msg || response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Get current price for a symbol
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async getPrice(symbol: string): Promise<{ symbol: string; price: number }> {
    const data = await this.publicRequest<{ symbol: string; price: string }>("/ticker/price", { symbol });
    return {
      symbol: data.symbol,
      price: parseFloat(data.price),
    };
  }

  /**
   * Get 24h ticker statistics
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async getTicker24h(symbol: string): Promise<TickerPrice> {
    const data = await this.publicRequest<{
      symbol: string;
      priceChange: string;
      priceChangePercent: string;
      lastPrice: string;
      highPrice: string;
      lowPrice: string;
      volume: string;
      quoteVolume: string;
    }>("/ticker/24hr", { symbol });

    return {
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      priceChange24h: parseFloat(data.priceChange),
      priceChangePercent24h: parseFloat(data.priceChangePercent),
      high24h: parseFloat(data.highPrice),
      low24h: parseFloat(data.lowPrice),
      volume24h: parseFloat(data.volume),
      quoteVolume24h: parseFloat(data.quoteVolume),
    };
  }

  /**
   * Get order book
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async getOrderBook(symbol: string, limit = 20): Promise<OrderBook> {
    const data = await this.publicRequest<{
      lastUpdateId: number;
      bids: [string, string][];
      asks: [string, string][];
    }>("/depth", { symbol, limit: limit.toString() });

    return {
      symbol,
      bids: data.bids.map(([price, qty]) => [parseFloat(price), parseFloat(qty)]),
      asks: data.asks.map(([price, qty]) => [parseFloat(price), parseFloat(qty)]),
      lastUpdateId: data.lastUpdateId,
    };
  }

  /**
   * Get klines/candlestick data
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async getKlines(
    symbol: string,
    interval: string,
    limit = 100
  ): Promise<Kline[]> {
    const data = await this.publicRequest<number[][]>("/klines", {
      symbol,
      interval,
      limit: limit.toString(),
    });

    return data.map((k) => ({
      openTime: k[0] as number,
      open: parseFloat(k[1] as unknown as string),
      high: parseFloat(k[2] as unknown as string),
      low: parseFloat(k[3] as unknown as string),
      close: parseFloat(k[4] as unknown as string),
      volume: parseFloat(k[5] as unknown as string),
      closeTime: k[6] as number,
      quoteVolume: parseFloat(k[7] as unknown as string),
      trades: k[8] as number,
    }));
  }

  /**
   * Get account balances
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async getBalance(): Promise<Balance[]> {
    const data = await this.signedRequest<{
      balances: Array<{ asset: string; free: string; locked: string }>;
    }>("/account");

    return data.balances
      .filter((b) => parseFloat(b.free) > 0 || parseFloat(b.locked) > 0)
      .map((b) => ({
        asset: b.asset,
        free: parseFloat(b.free),
        locked: parseFloat(b.locked),
        total: parseFloat(b.free) + parseFloat(b.locked),
      }));
  }

  /**
   * Place an order
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async placeOrder(params: OrderParams): Promise<Order> {
    const orderParams: Record<string, string> = {
      symbol: params.symbol,
      side: params.side,
      type: params.type,
      quantity: params.quantity.toString(),
    };

    if (params.price) {
      orderParams.price = params.price.toString();
    }

    if (params.stopPrice) {
      orderParams.stopPrice = params.stopPrice.toString();
    }

    if (params.timeInForce) {
      orderParams.timeInForce = params.timeInForce;
    } else if (params.type === "LIMIT") {
      orderParams.timeInForce = "GTC";
    }

    const data = await this.signedRequest<{
      symbol: string;
      orderId: number;
      clientOrderId: string;
      price: string;
      origQty: string;
      executedQty: string;
      status: string;
      type: string;
      side: string;
      transactTime: number;
    }>("/order", "POST", orderParams);

    return {
      symbol: data.symbol,
      orderId: data.orderId,
      clientOrderId: data.clientOrderId,
      price: parseFloat(data.price),
      origQty: parseFloat(data.origQty),
      executedQty: parseFloat(data.executedQty),
      status: data.status,
      type: data.type,
      side: data.side,
      time: data.transactTime,
    };
  }

  /**
   * Cancel an order
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async cancelOrder(symbol: string, orderId: number): Promise<Order> {
    const data = await this.signedRequest<{
      symbol: string;
      orderId: number;
      clientOrderId: string;
      price: string;
      origQty: string;
      executedQty: string;
      status: string;
      type: string;
      side: string;
    }>("/order", "DELETE", { symbol, orderId: orderId.toString() });

    return {
      symbol: data.symbol,
      orderId: data.orderId,
      clientOrderId: data.clientOrderId,
      price: parseFloat(data.price),
      origQty: parseFloat(data.origQty),
      executedQty: parseFloat(data.executedQty),
      status: data.status,
      type: data.type,
      side: data.side,
      time: Date.now(),
    };
  }

  /**
   * Get open orders
   * @source Based on ethancod1ng's binance-mcp-server
   */
  async getOpenOrders(symbol?: string): Promise<Order[]> {
    const params: Record<string, string> = {};
    if (symbol) {
      params.symbol = symbol;
    }

    const data = await this.signedRequest<
      Array<{
        symbol: string;
        orderId: number;
        clientOrderId: string;
        price: string;
        origQty: string;
        executedQty: string;
        status: string;
        type: string;
        side: string;
        time: number;
      }>
    >("/openOrders", "GET", params);

    return data.map((o) => ({
      symbol: o.symbol,
      orderId: o.orderId,
      clientOrderId: o.clientOrderId,
      price: parseFloat(o.price),
      origQty: parseFloat(o.origQty),
      executedQty: parseFloat(o.executedQty),
      status: o.status,
      type: o.type,
      side: o.side,
      time: o.time,
    }));
  }
}

// ============================================================================
// MCP Tool Registration
// ============================================================================

export function registerBinanceTools(server: McpServer, config: BinanceConfig = {}): void {
  const client = new BinanceClient(config);

  // Get price
  server.tool(
    "binance_price",
    "Get current price for a trading pair",
    {
      symbol: z.string().describe("Trading pair (e.g., BTCUSDT)"),
    },
    async ({ symbol }) => {
      const data = await client.getPrice(symbol.toUpperCase());
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get 24h ticker
  server.tool(
    "binance_ticker_24h",
    "Get 24h statistics for a trading pair",
    {
      symbol: z.string().describe("Trading pair (e.g., BTCUSDT)"),
    },
    async ({ symbol }) => {
      const data = await client.getTicker24h(symbol.toUpperCase());
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get order book
  server.tool(
    "binance_order_book",
    "Get order book depth for a trading pair",
    {
      symbol: z.string().describe("Trading pair (e.g., BTCUSDT)"),
      limit: z.number().optional().describe("Depth limit (default: 20)"),
    },
    async ({ symbol, limit }) => {
      const data = await client.getOrderBook(symbol.toUpperCase(), limit);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get klines
  server.tool(
    "binance_klines",
    "Get candlestick/kline data",
    {
      symbol: z.string().describe("Trading pair (e.g., BTCUSDT)"),
      interval: z
        .enum(["1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"])
        .describe("Kline interval"),
      limit: z.number().optional().describe("Number of klines (default: 100)"),
    },
    async ({ symbol, interval, limit }) => {
      const data = await client.getKlines(symbol.toUpperCase(), interval, limit);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get balance
  server.tool("binance_balance", "Get account balances (requires API key)", {}, async () => {
    const data = await client.getBalance();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  });

  // Place order
  server.tool(
    "binance_place_order",
    "Place a new order (requires API key)",
    {
      symbol: z.string().describe("Trading pair (e.g., BTCUSDT)"),
      side: z.enum(["BUY", "SELL"]).describe("Order side"),
      type: z.enum(["MARKET", "LIMIT"]).describe("Order type"),
      quantity: z.number().describe("Order quantity"),
      price: z.number().optional().describe("Limit price (required for LIMIT orders)"),
    },
    async ({ symbol, side, type, quantity, price }) => {
      const data = await client.placeOrder({
        symbol: symbol.toUpperCase(),
        side,
        type,
        quantity,
        price,
      });
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Cancel order
  server.tool(
    "binance_cancel_order",
    "Cancel an existing order (requires API key)",
    {
      symbol: z.string().describe("Trading pair"),
      orderId: z.number().describe("Order ID to cancel"),
    },
    async ({ symbol, orderId }) => {
      const data = await client.cancelOrder(symbol.toUpperCase(), orderId);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );

  // Get open orders
  server.tool(
    "binance_open_orders",
    "Get open orders (requires API key)",
    {
      symbol: z.string().optional().describe("Trading pair (optional, all pairs if not specified)"),
    },
    async ({ symbol }) => {
      const data = await client.getOpenOrders(symbol?.toUpperCase());
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    }
  );
}

export default BinanceClient;
