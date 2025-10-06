// types/index.ts
export interface TokenSecurityData {
    contractAddress: string;
    chainId: string;
    tokenName: string;
    tokenSymbol: string;
    holderCount?: number;
    totalSupply?: string;
    
    // Contract Security
    isOpenSource: '0' | '1';
    isProxy: '0' | '1';
    isMintable: '0' | '1';
    canTakeBackOwnership: '0' | '1';
    ownerChangeBalance: '0' | '1';
    hiddenOwner: '0' | '1';
    selfDestruct: '0' | '1';
    externalCall: '0' | '1';
    
    // Trading
    buyTax?: string;
    sellTax?: string;
    cannotBuy: '0' | '1';
    cannotSellAll: '0' | '1';
    slippageModifiable: '0' | '1';
    isHoneypot: '0' | '1';
    transferPausable: '0' | '1';
    isBlacklisted: '0' | '1';
    
    // Liquidity
    lpHolderCount?: number;
    lpTotalSupply?: string;
    
    // Holders
    holders?: Array<{
      address: string;
      balance: string;
      percent: string;
      isContract?: boolean;
    }>;
    creatorPercent?: string;
  }
  
  export interface RiskScore {
    overall: number;
    category: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK' | 'CRITICAL_RISK';
    factors: {
      contractSecurity: number;
      liquiditySafety: number;
      holderDistribution: number;
      tradingRestrictions: number;
    };
    warnings: string[];
    criticalIssues: string[];
  }
  
  export interface AdvancedData {
    price?: {
      usd: number;
      usd_24h_change: number;
      usd_market_cap: number;
      usd_24h_vol: number;
    };
    dex?: {
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
    };
    whales: {
      whaleCount: number;
      concentration: 'HEALTHY' | 'MODERATE' | 'DANGEROUS';
      warnings: string[];
    };
    rugPull: {
      probability: number;
      risk: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      recommendation: string;
      indicators: Array<{
        description: string;
      }>;
    };
    smartMoney: {
      insights: string[];
    };
    liquidity: {
      healthScore: number;
      status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
      recommendations: string[];
    };
    social: {
      sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
      trends: string[];
    };
  }

  export interface Verdict {
    rating: 'SAFE' | 'MODERATE' | 'RISKY' | 'DANGEROUS';
    confidence: number;
    recommendation: string;
  }

  export interface ScanResult {
    tokenAddress: string;
    chainId: string;
    securityData: TokenSecurityData;
    riskScore: RiskScore;
    scannedAt: string;
    advanced?: AdvancedData;
    verdict?: Verdict;
  }
  
  export const CHAINS = {
    '1': { name: 'Ethereum', icon: '⟠', explorer: 'https://etherscan.io' },
    '8453': { name: 'Base', icon: '🔵', explorer: 'https://basescan.org' },
    '56': { name: 'BSC', icon: '🟡', explorer: 'https://bscscan.com' },
    '137': { name: 'Polygon', icon: '🟣', explorer: 'https://polygonscan.com' },
    '42161': { name: 'Arbitrum', icon: '🔷', explorer: 'https://arbiscan.io' },
  } as const;
  