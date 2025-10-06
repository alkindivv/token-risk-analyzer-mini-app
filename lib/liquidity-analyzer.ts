// lib/liquidity-analyzer.ts - Advanced LP health check
import { TokenSecurityData } from '@/types';

interface LiquidityHealth {
  healthScore: number; // 0-100
  status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
  metrics: {
    lpHolders: number;
    concentration: number; // % held by top 5 LP holders
    diversity: 'HIGH' | 'MEDIUM' | 'LOW';
  };
  risks: string[];
  recommendations: string[];
}

class LiquidityAnalyzer {
  analyzeLiquidity(securityData: TokenSecurityData): LiquidityHealth {
    const lpCount = securityData.lpHolderCount || 0;
    const lpSupply = parseFloat(securityData.lpTotalSupply || '0');
    
    // Calculate health score
    let healthScore = 0;
    
    // LP holder count (40 points max)
    if (lpCount >= 100) healthScore += 40;
    else if (lpCount >= 50) healthScore += 30;
    else if (lpCount >= 20) healthScore += 20;
    else if (lpCount >= 10) healthScore += 10;
    
    // LP diversity (30 points max)
    const diversity = this.calculateDiversity(lpCount);
    if (diversity === 'HIGH') healthScore += 30;
    else if (diversity === 'MEDIUM') healthScore += 20;
    else healthScore += 10;
    
    // Supply locked (30 points max)
    if (lpSupply > 0) healthScore += 30;
    else healthScore += 15;
    
    const status = this.getStatus(healthScore);
    const concentration = this.calculateConcentration(lpCount);
    const risks = this.identifyRisks(lpCount, concentration);
    const recommendations = this.generateRecommendations(status, lpCount);

    return {
      healthScore,
      status,
      metrics: {
        lpHolders: lpCount,
        concentration,
        diversity,
      },
      risks,
      recommendations,
    };
  }

  private calculateDiversity(lpCount: number): LiquidityHealth['metrics']['diversity'] {
    if (lpCount >= 50) return 'HIGH';
    if (lpCount >= 20) return 'MEDIUM';
    return 'LOW';
  }

  private calculateConcentration(lpCount: number): number {
    // Estimate concentration (in production use real holder data)
    if (lpCount < 5) return 90; // Very concentrated
    if (lpCount < 20) return 70;
    if (lpCount < 50) return 50;
    return 30; // Well distributed
  }

  private getStatus(score: number): LiquidityHealth['status'] {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 50) return 'FAIR';
    if (score >= 30) return 'POOR';
    return 'CRITICAL';
  }

  private identifyRisks(lpCount: number, concentration: number): string[] {
    const risks: string[] = [];

    if (lpCount < 10) {
      risks.push('⚠️ CRITICAL: Very few LP holders - liquidity can be pulled anytime');
    } else if (lpCount < 20) {
      risks.push('⚠️ LOW LP holder count - vulnerable to rug pull');
    }

    if (concentration > 70) {
      risks.push('🔴 High concentration - few holders control most liquidity');
    }

    if (lpCount === 1) {
      risks.push('🚨 SINGLE LP PROVIDER - EXTREME RUG PULL RISK!');
    }

    return risks;
  }

  private generateRecommendations(
    status: LiquidityHealth['status'],
    _lpCount: number
  ): string[] {
    const recommendations: string[] = [];

    if (status === 'CRITICAL' || status === 'POOR') {
      recommendations.push('❌ DO NOT INVEST - Liquidity structure is unsafe');
      recommendations.push('Wait for more LP providers before considering investment');
    } else if (status === 'FAIR') {
      recommendations.push('⚠️ Use extreme caution - only invest small amounts');
      recommendations.push('Set tight stop losses and monitor liquidity changes');
    } else if (status === 'GOOD') {
      recommendations.push('✅ Acceptable liquidity - proceed with normal caution');
    } else {
      recommendations.push('✅ Excellent liquidity health - safer for investment');
    }

    return recommendations;
  }
}

export const liquidityAnalyzer = new LiquidityAnalyzer();
