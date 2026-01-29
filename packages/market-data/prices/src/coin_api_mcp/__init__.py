from . import server
import asyncio

def main():

    """MCP coin-api Server - A CoinMarketCap API wrapper for MCP."""
    import argparse
    import asyncio
    import os
    
    parser = argparse.ArgumentParser(
        description="give a model the ability to get coin/crypto data"
    )
    parser.add_argument(
        "--api-key",
        type=str,
        help="CoinMarketCap API key (can also be set via COINMARKETCAP_API_KEY environment variable)",
    )

    args = parser.parse_args()
    
    # Check for API key in args first, then environment
    api_key = args.api_key or os.getenv("COINMARKETCAP_API_KEY")
    if not api_key:
        parser.error("CoinMarketCap API key must be provided either via --api-key or COINMARKETCAP_API_KEY environment variable")
    
    """Main entry point for the package."""
    asyncio.run(server.main(api_key))

# Optionally expose other important items at package level
__all__ = ['main', 'server']
