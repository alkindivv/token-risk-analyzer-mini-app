// lib/smart-money.ts - Track smart money movements
import { TokenSecurityData } from '@/types';

interface SmartMoneyAnalysis {
  smartMoneyPresence: boolean;
  knownWallets: Array<{
    type: 'DEX' | 'CEX' | 'WHALE' | 'DEVELOPER' | 'UNKNOWN';
    address: string;
    percentage: number;
  }>;
  buyPressure: 'STRONG' | 'MODERATE' | 'WEAK';
  sellPressure: 'STRONG' | 'MODERATE' | 'WEAK';
  insights: string[];
}

class SmartMoneyTracker {
  // Known smart contract addresses (DEX, bridges, etc)
  private knownContracts: Record<string, string> = {
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': 'Uniswap V2 Router',
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': 'Uniswap V3 Router',
    '0x1111111254fb6c44bac0bed2854e76f90643097d': '1inch Aggregator',
  };

  analyzeSmartMoney(securityData: TokenSecurityData): SmartMoneyAnalysis {
    const holders = securityData.holders || [];
    
    const knownWallets = holders
      .filter(h => h.isContract || this.isKnownWallet(h.address))
      .map(h => ({
        type: this.classifyWallet(h.address, h.isContract || false),
        address: h.address,
        percentage: parseFloat(h.percent),
      }));

    const smartMoneyPresence = knownWallets.length > 0;
    
    // Analyze buy/sell pressure from holder distribution
    const { buyPressure, sellPressure } = this.analyzePressure(holders);
    
    const insights = this.generateInsights(knownWallets, buyPressure, sellPressure);

    return {
      smartMoneyPresence,
      knownWallets,
      buyPressure,
      sellPressure,
      insights,
    };
  }

  private isKnownWallet(address: string): boolean {
    return address.toLowerCase() in this.knownContracts;
  }

  private classifyWallet(
    address: string, 
    isContract: boolean
  ): SmartMoneyAnalysis['knownWallets'][0]['type'] {
    if (this.knownContracts[address.toLowerCase()]) return 'DEX';
    if (isContract) return 'DEX';
    return 'UNKNOWN';
  }

  private analyzePressure(holders: Array<{
    address: string;
    balance: string;
    percent: string;
    isContract?: boolean;
  }>): { 
    buyPressure: SmartMoneyAnalysis['buyPressure']; 
    sellPressure: SmartMoneyAnalysis['sellPressure'];
  } {
    // Simplified analysis based on holder count growth
    // In production, would use real tx data
    const holderCount = holders.length;
    
    let buyPressure: SmartMoneyAnalysis['buyPressure'] = 'MODERATE';
    let sellPressure: SmartMoneyAnalysis['sellPressure'] = 'MODERATE';
    
    if (holderCount > 1000) {
      buyPressure = 'STRONG';
      sellPressure = 'WEAK';
    } else if (holderCount < 100) {
      buyPressure = 'WEAK';
      sellPressure = 'STRONG';
    }
    
    return { buyPressure, sellPressure };
  }

  private generateInsights(
    knownWallets: SmartMoneyAnalysis['knownWallets'],
    buyPressure: SmartMoneyAnalysis['buyPressure'],
    sellPressure: SmartMoneyAnalysis['sellPressure']
  ): string[] {
    const insights: string[] = [];

    if (knownWallets.length > 0) {
      insights.push(`🔍 Detected ${knownWallets.length} known addresses (DEX/protocols)`);
    }

    if (buyPressure === 'STRONG') {
      insights.push('📈 Strong buying pressure detected - positive sentiment');
    } else if (buyPressure === 'WEAK') {
      insights.push('📉 Weak buying pressure - caution advised');
    }

    if (sellPressure === 'STRONG') {
      insights.push('⚠️ High selling pressure - potential price decline');
    }

    return insights;
  }
}

export const smartMoneyTracker = new SmartMoneyTracker();
