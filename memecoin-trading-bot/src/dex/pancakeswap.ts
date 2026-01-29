import { ethers } from 'ethers';
import { TokenInfo, PriceData } from '../types.js';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export interface IDexClient {
  getTokenPrice(tokenAddress: string): Promise<PriceData>;
  executeBuy(token: TokenInfo, amountIn: number, minAmountOut: number): Promise<string>;
  executeSell(token: TokenInfo, amountIn: number, minAmountOut: number): Promise<string>;
  getTokenBalance(tokenAddress: string): Promise<number>;
}

export class PancakeSwapClient implements IDexClient {
  private provider: ethers.Provider;
  private wallet: ethers.Wallet;
  private routerAddress: string;
  private routerAbi = [
    'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
    'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
  ];
  private erc20Abi = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
    'function approve(address spender, uint256 amount) returns (bool)',
    'function allowance(address owner, address spender) view returns (uint256)',
  ];
  private pairAbi = [
    'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
    'function token0() external view returns (address)',
    'function token1() external view returns (address)',
  ];
  private wbnbAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';

  constructor() {
    if (!config.ethRpcUrl || !config.privateKey) {
      throw new Error('ETH_RPC_URL and PRIVATE_KEY must be set for BSC trading');
    }

    this.provider = new ethers.JsonRpcProvider(config.ethRpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.routerAddress = config.pancakeswapRouter || '0x10ED43C718714eb63d5aA57B78B54704E256024E';
    
    logger.info(`PancakeSwap client initialized with wallet: ${this.wallet.address}`);
  }

  async getTokenPrice(tokenAddress: string): Promise<PriceData> {
    try {
      const router = new ethers.Contract(this.routerAddress, this.routerAbi, this.provider);
      const amountIn = ethers.parseEther('1');
      const path = [this.wbnbAddress, tokenAddress];
      
      const amounts = await router.getAmountsOut(amountIn, path);
      const tokenAmount = amounts[1];
      
      // Get token decimals
      const tokenContract = new ethers.Contract(tokenAddress, this.erc20Abi, this.provider);
      const decimals = await tokenContract.decimals();
      
      const price = Number(ethers.formatUnits(amountIn, 18)) / Number(ethers.formatUnits(tokenAmount, decimals));
      
      // Get liquidity from pair
      const factoryAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
      const factoryAbi = ['function getPair(address tokenA, address tokenB) external view returns (address pair)'];
      const factory = new ethers.Contract(factoryAddress, factoryAbi, this.provider);
      const pairAddress = await factory.getPair(this.wbnbAddress, tokenAddress);
      
      let liquidity = 0;
      let volume24h = 0;
      
      if (pairAddress !== ethers.ZeroAddress) {
        const pair = new ethers.Contract(pairAddress, this.pairAbi, this.provider);
        const reserves = await pair.getReserves();
        const token0 = await pair.token0();
        
        const wbnbReserve = token0.toLowerCase() === this.wbnbAddress.toLowerCase() 
          ? reserves.reserve0 
          : reserves.reserve1;
        
        liquidity = Number(ethers.formatEther(wbnbReserve)) * 2 * 600; // Approximate BNB price at $600
      }

      return {
        price,
        volume24h,
        liquidity,
        priceChange24h: 0,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error(`Failed to get token price for ${tokenAddress}:`, error);
      throw error;
    }
  }

  async executeBuy(token: TokenInfo, amountIn: number, minAmountOut: number): Promise<string> {
    try {
      const router = new ethers.Contract(this.routerAddress, this.routerAbi, this.wallet);
      const path = [this.wbnbAddress, token.address];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
      
      const amountInWei = ethers.parseEther(amountIn.toString());
      const minAmountOutWei = ethers.parseUnits(minAmountOut.toString(), token.decimals);

      logger.info(`Executing buy: ${amountIn} BNB for ${token.symbol} (min ${minAmountOut})`);

      const tx = await router.swapExactETHForTokens(
        minAmountOutWei,
        path,
        this.wallet.address,
        deadline,
        { value: amountInWei, gasLimit: 500000 }
      );

      logger.info(`Buy transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      logger.info(`Buy transaction confirmed: ${tx.hash}`);

      return tx.hash;
    } catch (error) {
      logger.error('Buy execution failed:', error);
      throw error;
    }
  }

  async executeSell(token: TokenInfo, amountIn: number, minAmountOut: number): Promise<string> {
    try {
      const tokenContract = new ethers.Contract(token.address, this.erc20Abi, this.wallet);
      
      // Check and approve if needed
      const allowance = await tokenContract.allowance(this.wallet.address, this.routerAddress);
      const amountInWei = ethers.parseUnits(amountIn.toString(), token.decimals);
      
      if (allowance < amountInWei) {
        logger.info(`Approving ${token.symbol} for trading`);
        const approveTx = await tokenContract.approve(this.routerAddress, ethers.MaxUint256);
        await approveTx.wait();
        logger.info('Approval confirmed');
      }

      const router = new ethers.Contract(this.routerAddress, this.routerAbi, this.wallet);
      const path = [token.address, this.wbnbAddress];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
      
      const minAmountOutWei = ethers.parseEther(minAmountOut.toString());

      logger.info(`Executing sell: ${amountIn} ${token.symbol} for BNB (min ${minAmountOut})`);

      const tx = await router.swapExactTokensForETH(
        amountInWei,
        minAmountOutWei,
        path,
        this.wallet.address,
        deadline,
        { gasLimit: 500000 }
      );

      logger.info(`Sell transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();
      logger.info(`Sell transaction confirmed: ${tx.hash}`);

      return tx.hash;
    } catch (error) {
      logger.error('Sell execution failed:', error);
      throw error;
    }
  }

  async getTokenBalance(tokenAddress: string): Promise<number> {
    try {
      if (tokenAddress === this.wbnbAddress || tokenAddress === 'BNB') {
        const balance = await this.provider.getBalance(this.wallet.address);
        return Number(ethers.formatEther(balance));
      }

      const tokenContract = new ethers.Contract(tokenAddress, this.erc20Abi, this.provider);
      const balance = await tokenContract.balanceOf(this.wallet.address);
      const decimals = await tokenContract.decimals();
      return Number(ethers.formatUnits(balance, decimals));
    } catch (error) {
      logger.error(`Failed to get token balance for ${tokenAddress}:`, error);
      return 0;
    }
  }

  async getNativeBalance(): Promise<number> {
    const balance = await this.provider.getBalance(this.wallet.address);
    return Number(ethers.formatEther(balance));
  }
}
