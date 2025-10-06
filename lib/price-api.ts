// lib/price-api.ts - CoinGecko + DEXScreener Integration
import axios from 'axios';

interface TokenPrice {
  usd: number;
  usd_24h_change: number;
  usd_market_cap: number;
  usd_24h_vol: number;
}

interface DEXData {
  priceUsd: string;
  liquidity: {
    usd: number;
  };
  fdv: number;
  marketCap: number;
  volume24h: number;
  priceChange24h: number;
  txns24h: {
    buys: number;
    sells: number;
  };
}

class PriceAPI {
  private geckoBaseUrl = 'https://api.coingecko.com/api/v3';
  
  async getTokenPrice(chainId: string, address: string): Promise<TokenPrice | null> {
    try {
      const platformMap: Record<string, string> = {
        '1': 'ethereum',
        '8453': 'base',
        '56': 'binance-smart-chain',
        '137': 'polygon-pos',
        '42161': 'arbitrum-one',
      };
      
      const platform = platformMap[chainId];
      if (!platform) return null;
      
      const response = await axios.get(
        `${this.geckoBaseUrl}/simple/token_price/${platform}`,
        {
          params: {
            contract_addresses: address,
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_vol: true,
            include_24hr_change: true,
          }
        }
      );
      
      const data = response.data[address.toLowerCase()];
      return data || null;
    } catch (error) {
      console.error('CoinGecko API error:', error);
      return null;
    }
  }
  
  async getDEXData(chainId: string, address: string): Promise<DEXData | null> {
    try {
      const response = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${address}`
      );
      
      const pairs = response.data.pairs;
      if (!pairs || pairs.length === 0) return null;
      
      const mainPair = pairs.sort((a: { liquidity: { usd: number } }, b: { liquidity: { usd: number } }) => 
        b.liquidity.usd - a.liquidity.usd
      )[0];
      
      return {
        priceUsd: mainPair.priceUsd,
        liquidity: mainPair.liquidity,
        fdv: mainPair.fdv,
        marketCap: mainPair.marketCap,
        volume24h: mainPair.volume.h24,
        priceChange24h: mainPair.priceChange.h24,
        txns24h: mainPair.txns.h24,
      };
    } catch (error) {
      console.error('DEXScreener API error:', error);
      return null;
    }
  }
}

export const priceAPI = new PriceAPI();
