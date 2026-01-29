'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Tool {
  id: string
  name: string
  category: string
  template: string
}

interface ToolSelectorProps {
  onSelect: (tool: Tool) => void
}

const TOOLS: Tool[] = [
  {
    id: 'balance',
    name: 'Get Balance',
    category: 'Wallet',
    template: `// Get wallet balance
const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
const balance = await getBalance(address, "ethereum");
console.log(\`Balance: \${balance} ETH\`);`,
  },
  {
    id: 'token-balance',
    name: 'Get Token Balance',
    category: 'Wallet',
    template: `// Get ERC20 token balance
const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
const token = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
const balance = await getTokenBalance(address, token, "ethereum");
console.log(\`USDC Balance: \${balance}\`);`,
  },
  {
    id: 'price',
    name: 'Get Token Price',
    category: 'Market Data',
    template: `// Get current token prices
const ethPrice = await getTokenPrice("ETH", "USD");
const btcPrice = await getTokenPrice("BTC", "USD");

console.log(\`ETH: $\${ethPrice}\`);
console.log(\`BTC: $\${btcPrice}\`);`,
  },
  {
    id: 'gas',
    name: 'Get Gas Price',
    category: 'Network',
    template: `// Get current gas prices
const gas = await getGasPrice("ethereum");

console.log(\`Standard: \${gas.standard} gwei\`);
console.log(\`Fast: \${gas.fast} gwei\`);
console.log(\`Instant: \${gas.instant} gwei\`);`,
  },
  {
    id: 'nfts',
    name: 'Get NFTs',
    category: 'NFT',
    template: `// Get all NFTs owned by address
const address = "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb";
const nfts = await getNFTs(address, "ethereum");

console.log(\`Total NFTs: \${nfts.length}\`);
nfts.slice(0, 5).forEach(nft => {
  console.log(\`\${nft.contract}#\${nft.tokenId}\`);
});`,
  },
  {
    id: 'tx-status',
    name: 'Transaction Status',
    category: 'Network',
    template: `// Check transaction status
const txHash = "0x...";
const status = await getTransactionStatus(txHash, "ethereum");

console.log(\`Status: \${status.status}\`);
console.log(\`Confirmations: \${status.confirmations}\`);`,
  },
]

export function ToolSelector({ onSelect }: ToolSelectorProps) {
  return (
    <Select onValueChange={(value) => {
      const tool = TOOLS.find(t => t.id === value)
      if (tool) onSelect(tool)
    }}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a tool" />
      </SelectTrigger>
      <SelectContent>
        {TOOLS.map((tool) => (
          <SelectItem key={tool.id} value={tool.id}>
            <span className="flex flex-col items-start">
              <span className="font-medium">{tool.name}</span>
              <span className="text-xs text-gray-500">{tool.category}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
