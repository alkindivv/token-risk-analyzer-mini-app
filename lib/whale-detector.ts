// lib/whale-detector.ts - Advanced whale analysis
import { TokenSecurityData } from '@/types';

interface WhaleAnalysis {
  hasWhales: boolean;
  whaleCount: number;
  whalePercentage: number;
  topWhales: Array<{
    address: string;
    percentage: number;
    isContract: boolean;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  }>;
  concentration: 'HEALTHY' | 'MODERATE' | 'DANGEROUS';
  warnings: string[];
}

class WhaleDetector {
  analyzeWhales(securityData: TokenSecurityData): WhaleAnalysis {
    const holders = securityData.holders || [];
    
    // Identify whales (>1% ownership)
    const whales = holders.filter(h => parseFloat(h.percent) > 1);
    
    const top10Percent = holders
      .slice(0, 10)
      .reduce((sum, h) => sum + parseFloat(h.percent || '0'), 0);
    
    const topWhales = whales.slice(0, 5).map(whale => ({
      address: whale.address,
      percentage: parseFloat(whale.percent),
      isContract: whale.isContract || false,
      risk: this.assessWhaleRisk(parseFloat(whale.percent), whale.isContract || false),
    }));
    
    const concentration = this.getConcentration(top10Percent);
    const warnings = this.generateWhaleWarnings(topWhales, top10Percent);
    
    return {
      hasWhales: whales.length > 0,
      whaleCount: whales.length,
      whalePercentage: top10Percent,
      topWhales,
      concentration,
      warnings,
    };
  }
  
  private assessWhaleRisk(percentage: number, isContract: boolean): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (isContract) return 'LOW'; // Likely DEX or protocol
    if (percentage > 10) return 'HIGH';
    if (percentage > 5) return 'MEDIUM';
    return 'LOW';
  }
  
  private getConcentration(top10: number): 'HEALTHY' | 'MODERATE' | 'DANGEROUS' {
    if (top10 < 30) return 'HEALTHY';
    if (top10 < 60) return 'MODERATE';
    return 'DANGEROUS';
  }
  
  private generateWhaleWarnings(whales: Array<{
    address: string;
    percentage: number;
    isContract: boolean;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  }>, top10: number): string[] {
    const warnings: string[] = [];
    
    if (top10 > 70) {
      warnings.push('⚠️ EXTREME concentration: Top 10 holders control ' + top10.toFixed(1) + '%');
    }
    
    const highRiskWhales = whales.filter(w => w.risk === 'HIGH');
    if (highRiskWhales.length > 0) {
      warnings.push(`🐋 ${highRiskWhales.length} high-risk whales detected (>10% each)`);
    }
    
    if (whales.length > 10) {
      warnings.push(`📊 ${whales.length} whales identified (>1% ownership)`);
    }
    
    return warnings;
  }
}

export const whaleDetector = new WhaleDetector();
