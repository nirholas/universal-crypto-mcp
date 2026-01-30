# Attribution and Licenses

This project integrates code and concepts from several battle-tested open-source trading projects to ensure safety and reliability.

## Integrated Projects

### 1. Freqtrade (MIT License)
**Repository:** https://github.com/freqtrade/freqtrade  
**Stars:** 15,000+  
**License:** MIT

**What we use:**
- Risk management system (`src/risk-manager.ts`)
- Position sizing algorithms
- Protection mechanisms (max drawdown, daily loss limits, cooldown periods)
- Emergency stop functionality
- Stake amount calculation
- Trade validation logic

**Copyright:** Copyright (c) 2017 - present, Freqtrade Development Team

### 2. Jesse (MIT License)
**Repository:** https://github.com/jesse-ai/jesse  
**Stars:** 5,000+  
**License:** MIT

**What we use:**
- Backtesting framework concepts (`src/backtester.ts`)
- Trading simulation patterns
- Performance metrics calculation
- Trade record structures

**Copyright:** Copyright (c) 2020 - present, Jesse AI

### 3. CCXT (MIT License)
**Repository:** https://github.com/ccxt/ccxt  
**Stars:** 28,000+  
**License:** MIT

**What we use:**
- Exchange API abstraction concepts
- Order type handling patterns
- Market data structures

**Copyright:** Copyright (c) 2017 - present, Igor Kroitor

## Original Code

The following modules are original implementations for this project:
- Solana blockchain integration (`src/solana-client.ts`)
- Pump.fun DEX client (`src/pump-fun-client.ts`)
- Jupiter aggregator client (`src/jupiter-client.ts`)
- Token analysis (`src/token-analyzer.ts`)
- Trading strategy (`src/strategy.ts`)
- Main bot orchestration (`src/bot.ts`)

## Full License Compliance

This project is MIT licensed and complies with all upstream licenses. All integrated code is properly attributed and follows the terms of their respective MIT licenses.

### MIT License Summary
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

## Disclaimer

This software is for educational purposes only. Do not risk money which you are afraid to lose. USE THE SOFTWARE AT YOUR OWN RISK. THE AUTHORS AND ALL AFFILIATES ASSUME NO RESPONSIBILITY FOR YOUR TRADING RESULTS.

Always start by running a trading bot in dry-run mode and do not engage money before you understand how it works and what profit/loss you should expect.

## Contributing

If you wish to contribute to this project, please ensure:
1. All new code is compatible with the MIT license
2. Proper attribution is given for any integrated code
3. Safety and risk management features are maintained
4. Tests are provided for new features

## Contact

For questions about attribution or licensing, please open an issue on GitHub.
