/**
 * Quick Start: x402 API with Marketplace
 * 
 * The simplest way to get started with x402 marketplace and discovery
 */

import express from "express";
import { createMarketplaceRouter, discoveryMiddleware } from "x402-deploy";

const app = express();
app.use(express.json());

// Config
const config = {
  name: "My API",
  description: "A simple x402-enabled API",
  url: "https://api.example.com",
  payment: {
    wallet: "0x1234...",
    network: "eip155:8453",
  },
  pricing: {
    model: "per-call",
    default: "$0.001",
  },
};

// Add discovery (serves /.well-known/x402)
app.use(discoveryMiddleware({ config }));

// Add marketplace endpoints
app.use("/marketplace", createMarketplaceRouter());

// Your API routes
app.get("/api/data", (req, res) => {
  res.json({ data: "Hello x402!" });
});

app.listen(3000, () => {
  console.log("🚀 API running on http://localhost:3000");
  console.log("📍 Discovery: http://localhost:3000/.well-known/x402");
  console.log("🏪 Marketplace: http://localhost:3000/marketplace");
});
