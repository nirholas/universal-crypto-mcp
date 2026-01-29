# Ethers.js MCP Integration

Integration of ethers.js into Universal Crypto MCP.

## Original Project

**ethers.js** by Richard Moore  
License: MIT  
Repository: https://github.com/ethers-io/ethers.js

## Attribution

- **Core functionality**: Provided by ethers.js (Richard Moore)
- **MCP integration**: Nicholas (github.com/nirholas)

See `vendor/ethers-integration/ATTRIBUTION.md` for full attribution.

## Usage

```typescript
import { EthersAdapter } from '@/integrations/ethers'

const adapter = new EthersAdapter({
  rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR-KEY',
  chainId: 1
})

const balance = await adapter.getBalance('0x...')
```

## License Compliance

This integration complies with the MIT license by:
- ✅ Including original copyright notice
- ✅ Including MIT license text
- ✅ Crediting original author
- ✅ Maintaining proper attribution

---

**Integrated by**: Nicholas (github.com/nirholas, x.com/nichxbt)
