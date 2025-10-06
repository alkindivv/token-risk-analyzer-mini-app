
import { TokenSecurityData, RiskScore } from '../types';

class RiskEngine {
  calculateRiskScore(data: TokenSecurityData): RiskScore {
    const factors = {
      contractSecurity: this.scoreContractSecurity(data),
      liquiditySafety: this.scoreLiquiditySafety(data),
      holderDistribution: this.scoreHolderDistribution(data),
      tradingRestrictions: this.scoreTradingRestrictions(data),
    };

    const overall = Math.round(
      factors.contractSecurity * 0.3 +
      factors.liquiditySafety * 0.25 +
      factors.holderDistribution * 0.2 +
      factors.tradingRestrictions * 0.25
    );

    return {
      overall,
      category: this.getCategory(overall),
      factors,
      warnings: this.getWarnings(data),
      criticalIssues: this.getCriticalIssues(data),
    };
  }

  private scoreContractSecurity(data: TokenSecurityData): number {
    let score = 0;
    if (data.isOpenSource === '0') score += 20;
    if (data.isProxy === '1') score += 10;
    if (data.isMintable === '1') score += 15;
    if (data.canTakeBackOwnership === '1') score += 25;
    if (data.ownerChangeBalance === '1') score += 30;
    if (data.hiddenOwner === '1') score += 20;
    if (data.selfDestruct === '1') score += 40;
    if (data.externalCall === '1') score += 10;
    return Math.min(score, 100);
  }

  private scoreLiquiditySafety(data: TokenSecurityData): number {
    let score = 0;
    const lpCount = data.lpHolderCount || 0;
    if (lpCount < 10) score += 40;
    else if (lpCount < 50) score += 20;
    else if (lpCount < 100) score += 10;
    return Math.min(score, 100);
  }

  private scoreHolderDistribution(data: TokenSecurityData): number {
    let score = 0;
    if (data.holders && data.holders.length > 0) {
      const top10 = data.holders.slice(0, 10).reduce((sum, h) => sum + parseFloat(h.percent || '0'), 0);
      if (top10 > 80) score += 40;
      else if (top10 > 60) score += 25;
      else if (top10 > 40) score += 10;
    }
    const creatorPercent = parseFloat(data.creatorPercent || '0');
    if (creatorPercent > 50) score += 30;
    else if (creatorPercent > 30) score += 15;
    else if (creatorPercent > 10) score += 5;
    const holderCount = data.holderCount || 0;
    if (holderCount < 100) score += 25;
    else if (holderCount < 500) score += 10;
    return Math.min(score, 100);
  }

  private scoreTradingRestrictions(data: TokenSecurityData): number {
    let score = 0;
    if (data.isHoneypot === '1') return 100;
    if (data.cannotBuy === '1') score += 50;
    if (data.cannotSellAll === '1') score += 50;
    if (data.transferPausable === '1') score += 30;
    if (data.isBlacklisted === '1') score += 40;
    if (data.slippageModifiable === '1') score += 20;
    const buyTax = parseFloat(data.buyTax || '0');
    const sellTax = parseFloat(data.sellTax || '0');
    if (buyTax > 20 || sellTax > 20) score += 30;
    else if (buyTax > 10 || sellTax > 10) score += 15;
    return Math.min(score, 100);
  }

  private getCategory(score: number): RiskScore['category'] {
    if (score < 20) return 'LOW_RISK';
    if (score < 50) return 'MEDIUM_RISK';
    if (score < 80) return 'HIGH_RISK';
    return 'CRITICAL_RISK';
  }

  private getWarnings(data: TokenSecurityData): string[] {
    const warnings: string[] = [];
    if (data.isOpenSource === '0') warnings.push('Contract not verified');
    if (data.isMintable === '1') warnings.push('Token supply can be increased');
    if (data.isProxy === '1') warnings.push('Proxy contract - can be upgraded');
    const buyTax = parseFloat(data.buyTax || '0');
    const sellTax = parseFloat(data.sellTax || '0');
    if (buyTax > 5 || sellTax > 5) warnings.push(`Tax: ${buyTax}% buy / ${sellTax}% sell`);
    if (data.transferPausable === '1') warnings.push('Transfers can be paused');
    const lpCount = data.lpHolderCount || 0;
    if (lpCount < 50) warnings.push(`Low LP count: ${lpCount} holders`);
    return warnings;
  }

  private getCriticalIssues(data: TokenSecurityData): string[] {
    const critical: string[] = [];
    if (data.isHoneypot === '1') critical.push('🚨 HONEYPOT - Cannot sell!');
    if (data.cannotBuy === '1') critical.push('🚨 Buying disabled');
    if (data.cannotSellAll === '1') critical.push('🚨 Cannot sell all tokens');
    if (data.selfDestruct === '1') critical.push('🚨 Self-destruct function exists');
    if (data.ownerChangeBalance === '1') critical.push('🚨 Owner can modify balances');
    if (data.canTakeBackOwnership === '1') critical.push('🚨 Ownership can be reclaimed');
    return critical;
  }
}

export const riskEngine = new RiskEngine();
