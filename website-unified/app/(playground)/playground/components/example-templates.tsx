'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ExampleTemplatesProps {
  onSelect: (template: string) => void
}

const TEMPLATES = [
  {
    id: 'portfolio',
    name: 'Multi-Chain Portfolio',
    code: `// Get portfolio across multiple chains
const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
const chains = ["ethereum", "base", "arbitrum", "polygon"];

let totalValue = 0;

for (const chain of chains) {
  const balance = await getBalance(address, chain);
  const ethPrice = await getTokenPrice("ETH", "USD");
  const value = parseFloat(balance) * ethPrice;
  
  console.log(\`\${chain}: \${balance} ETH ($\${value.toFixed(2)})\`);
  totalValue += value;
}

console.log(\`\\nTotal Portfolio Value: $\${totalValue.toFixed(2)}\`);`,
  },
  {
    id: 'swap-quote',
    name: 'Best Swap Quote',
    code: `// Compare swap prices across DEXs
const params = {
  from: "ETH",
  to: "USDC",
  amount: "1.0",
  chain: "ethereum"
};

// This would typically call multiple DEX aggregators
console.log(\`Finding best price for \${params.amount} \${params.from} -> \${params.to}\`);

const quote = await swapTokens(params);
console.log(\`Best rate: \${quote.amountOut} \${params.to}\`);`,
  },
  {
    id: 'gas-tracker',
    name: 'Gas Price Tracker',
    code: `// Track gas prices across chains
const chains = ["ethereum", "base", "arbitrum", "polygon"];

console.log("Current Gas Prices:\\n");

for (const chain of chains) {
  const gas = await getGasPrice(chain);
  console.log(\`\${chain}:\`);
  console.log(\`  Standard: \${gas.standard} gwei\`);
  console.log(\`  Fast: \${gas.fast} gwei\`);
  console.log(\`  Instant: \${gas.instant} gwei\\n\`);
}`,
  },
  {
    id: 'nft-gallery',
    name: 'NFT Gallery',
    code: `// Display NFT collection
const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
const chains = ["ethereum", "base", "polygon"];

let totalNFTs = 0;

for (const chain of chains) {
  const nfts = await getNFTs(address, chain);
  totalNFTs += nfts.length;
  
  console.log(\`\${chain}: \${nfts.length} NFTs\`);
  
  if (nfts.length > 0) {
    console.log(\`  First NFT: \${nfts[0].contract}#\${nfts[0].tokenId}\`);
  }
}

console.log(\`\\nTotal NFTs across all chains: \${totalNFTs}\`);`,
  },
  {
    id: 'token-info',
    name: 'Token Information',
    code: `// Get detailed token information
const tokenAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
const chain = "ethereum";

const info = await getTokenInfo(tokenAddress, chain);

console.log(\`Name: \${info.name}\`);
console.log(\`Symbol: \${info.symbol}\`);
console.log(\`Decimals: \${info.decimals}\`);
console.log(\`Total Supply: \${info.totalSupply}\`);

const price = await getTokenPrice(info.symbol, "USD");
console.log(\`Current Price: $\${price}\`);`,
  },
  {
    id: 'block-explorer',
    name: 'Block Explorer',
    code: `// Get latest block information
const chain = "ethereum";
const block = await getBlock("latest", chain);

console.log(\`Block Number: \${block.number}\`);
console.log(\`Block Hash: \${block.hash}\`);
console.log(\`Timestamp: \${new Date(block.timestamp * 1000).toISOString()}\`);
console.log(\`Transactions: \${block.transactions.length}\`);

// Show first 5 transactions
console.log(\`\\nFirst 5 transactions:\`);
block.transactions.slice(0, 5).forEach((tx, i) => {
  console.log(\`  \${i + 1}. \${tx}\`);
});`,
  },
]

export function ExampleTemplates({ onSelect }: ExampleTemplatesProps) {
  return (
    <Select onValueChange={(value) => {
      const template = TEMPLATES.find(t => t.id === value)
      if (template) onSelect(template.code)
    }}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Load example" />
      </SelectTrigger>
      <SelectContent>
        {TEMPLATES.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
