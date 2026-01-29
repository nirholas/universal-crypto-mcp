/**
 * Web3 MCP Server
 * Multi-chain Web3 utilities and blockchain interactions
 * 
 * Author: nich (@nirholas) - x.com/nichxbt
 */

import { ethers } from 'ethers'

export interface Web3Config {
  rpcUrl: string
  chainId?: number
}

export class Web3MCP {
  private provider: ethers.JsonRpcProvider
  
  constructor(config: Web3Config) {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl)
  }
  
  async getBalance(address: string): Promise<string> {
    const balance = await this.provider.getBalance(address)
    return ethers.formatEther(balance)
  }
  
  async getBlockNumber(): Promise<number> {
    return await this.provider.getBlockNumber()
  }
  
  async getGasPrice(): Promise<string> {
    const gasPrice = (await this.provider.getFeeData()).gasPrice
    return gasPrice ? ethers.formatUnits(gasPrice, 'gwei') : '0'
  }
}

export default Web3MCP
