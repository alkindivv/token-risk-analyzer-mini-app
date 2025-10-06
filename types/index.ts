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
  
  export interface ScanResult {
    tokenAddress: string;
    chainId: string;
    securityData: TokenSecurityData;
    riskScore: RiskScore;
    scannedAt: string;
  }
  
  export const CHAINS = {
    '1': { name: 'Ethereum', icon: '⟠', explorer: 'https://etherscan.io' },
    '8453': { name: 'Base', icon: '🔵', explorer: 'https://basescan.org' },
    '56': { name: 'BSC', icon: '🟡', explorer: 'https://bscscan.com' },
    '137': { name: 'Polygon', icon: '🟣', explorer: 'https://polygonscan.com' },
    '42161': { name: 'Arbitrum', icon: '🔷', explorer: 'https://arbiscan.io' },
  } as const;
  