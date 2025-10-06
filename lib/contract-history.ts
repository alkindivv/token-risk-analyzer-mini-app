// lib/contract-history.ts - Blockchain history analysis
import axios from 'axios';

interface ContractHistory {
  age: number; // days
  firstBlock: number;
  transactionCount: number;
  lastActivity: Date;
  isNew: boolean;
  trustScore: number; // 0-100
  warnings: string[];
}

class ContractHistoryAnalyzer {
  async analyzeHistory(chainId: string, address: string): Promise<ContractHistory | null> {
    try {
      const explorerAPIs: Record<string, string> = {
        '1': 'https://api.etherscan.io/api',
        '8453': 'https://api.basescan.org/api',
        '56': 'https://api.bscscan.com/api',
        '137': 'https://api.polygonscan.com/api',
        '42161': 'https://api.arbiscan.io/api',
      };
      
      const apiUrl = explorerAPIs[chainId];
      if (!apiUrl) return null;
      
      // Get contract creation info
      const response = await axios.get(apiUrl, {
        params: {
          module: 'account',
          action: 'txlist',
          address: address,
          startblock: 0,
          endblock: 99999999,
          page: 1,
          offset: 1,
          sort: 'asc',
        }
      });
      
      const data = response.data;
      if (data.status !== '1' || !data.result[0]) return null;
      
      const firstTx = data.result[0];
      const firstBlock = parseInt(firstTx.blockNumber);
      const firstTimestamp = parseInt(firstTx.timeStamp);
      
      const age = Math.floor((Date.now() / 1000 - firstTimestamp) / 86400); // days
      const isNew = age < 7; // Less than 1 week
      
      const trustScore = this.calculateTrustScore(age, isNew);
      const warnings = this.generateHistoryWarnings(age, isNew);
      
      return {
        age,
        firstBlock,
        transactionCount: 0, // Would need additional API call
        lastActivity: new Date(),
        isNew,
        trustScore,
        warnings,
      };
    } catch (error) {
      console.error('Contract history error:', error);
      return null;
    }
  }
  
  private calculateTrustScore(age: number, isNew: boolean): number {
    if (isNew) return 20; // Very new = low trust
    if (age < 30) return 40; // Less than 1 month
    if (age < 90) return 60; // Less than 3 months
    if (age < 180) return 75; // Less than 6 months
    return 90; // Over 6 months = high trust
  }
  
  private generateHistoryWarnings(age: number, isNew: boolean): string[] {
    const warnings: string[] = [];
    
    if (isNew) {
      warnings.push('🆕 VERY NEW TOKEN (less than 7 days old) - EXTREME CAUTION!');
    } else if (age < 30) {
      warnings.push('⏱️ Recently deployed (less than 1 month) - higher risk');
    }
    
    if (age > 365) {
      warnings.push('✅ Established token (over 1 year old) - more reliable');
    }
    
    return warnings;
  }
}

export const contractHistory = new ContractHistoryAnalyzer();
