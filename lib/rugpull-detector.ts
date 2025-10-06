// lib/rugpull-detector.ts - Advanced rug pull detection
import { TokenSecurityData } from '@/types';

interface RugPullScore {
  probability: number; // 0-100
  risk: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  indicators: Array<{
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  }>;
  recommendation: string;
}

class RugPullDetector {
  calculateRugPullRisk(securityData: TokenSecurityData): RugPullScore {
    const indicators = [
      this.checkLiquidityLock(securityData),
      this.checkOwnershipRenounced(securityData),
      this.checkMintFunction(securityData),
      this.checkHiddenFunctions(securityData),
      this.checkTaxManipulation(securityData),
      this.checkLiquidityConcentration(securityData),
      this.checkHolderDistribution(securityData),
      this.checkContractVerification(securityData),
      this.checkProxyPattern(securityData),
      this.checkBlacklistFunction(securityData),
    ];
    
    const detectedIndicators = indicators.filter(i => i.detected);
    
    // Calculate weighted risk score
    const riskScore = detectedIndicators.reduce((sum, ind) => {
      const weights = { CRITICAL: 40, HIGH: 25, MEDIUM: 15, LOW: 10 };
      return sum + weights[ind.severity];
    }, 0);
    
    const probability = Math.min(riskScore, 100);
    const risk = this.getRiskLevel(probability);
    const recommendation = this.getRecommendation(risk, detectedIndicators.length);
    
    return {
      probability,
      risk,
      indicators: detectedIndicators,
      recommendation,
    };
  }
  
  private checkLiquidityLock(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    // Check if liquidity is locked
    const lpCount = data.lpHolderCount || 0;
    const isLocked = lpCount < 5; // Suspicious if very few LP holders
    
    return {
      name: 'Liquidity Lock',
      detected: !isLocked && lpCount < 20,
      severity: 'HIGH' as const,
      description: lpCount < 20 
        ? `Low LP holder count (${lpCount}) - liquidity may not be locked`
        : 'Liquidity appears properly distributed',
    };
  }
  
  private checkOwnershipRenounced(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    const hasOwnerPrivileges = data.canTakeBackOwnership === '1' || 
                               data.ownerChangeBalance === '1' ||
                               data.hiddenOwner === '1';
    
    return {
      name: 'Owner Privileges',
      detected: hasOwnerPrivileges,
      severity: 'CRITICAL' as const,
      description: hasOwnerPrivileges
        ? 'Owner retains dangerous privileges (can modify balances/ownership)'
        : 'Owner privileges appear limited',
    };
  }
  
  private checkMintFunction(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    return {
      name: 'Mint Function',
      detected: data.isMintable === '1',
      severity: 'HIGH' as const,
      description: data.isMintable === '1'
        ? 'Token supply can be increased - potential dilution risk'
        : 'Supply is fixed',
    };
  }
  
  private checkHiddenFunctions(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    const hasHidden = data.hiddenOwner === '1' || data.selfDestruct === '1';
    
    return {
      name: 'Hidden Functions',
      detected: hasHidden,
      severity: 'CRITICAL' as const,
      description: hasHidden
        ? 'Hidden owner or self-destruct detected - EXTREME RUG PULL RISK'
        : 'No hidden functions detected',
    };
  }
  
  private checkTaxManipulation(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    const buyTax = parseFloat(data.buyTax || '0');
    const sellTax = parseFloat(data.sellTax || '0');
    const canModify = data.slippageModifiable === '1';
    
    const suspicious = (buyTax > 15 || sellTax > 15) && canModify;
    
    return {
      name: 'Tax Manipulation',
      detected: suspicious,
      severity: 'HIGH' as const,
      description: suspicious
        ? `High taxes (${buyTax}%/${sellTax}%) with modifiable slippage - rug pull vector`
        : 'Tax structure appears reasonable',
    };
  }
  
  private checkLiquidityConcentration(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    const lpCount = data.lpHolderCount || 0;
    const dangerous = lpCount < 10;
    
    return {
      name: 'Liquidity Concentration',
      detected: dangerous,
      severity: 'CRITICAL' as const,
      description: dangerous
        ? `Only ${lpCount} LP holders - single entity controls liquidity`
        : 'Liquidity is well distributed',
    };
  }
  
  private checkHolderDistribution(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    const creatorPercent = parseFloat(data.creatorPercent || '0');
    const suspicious = creatorPercent > 30;
    
    return {
      name: 'Creator Holdings',
      detected: suspicious,
      severity: 'MEDIUM' as const,
      description: suspicious
        ? `Creator holds ${creatorPercent.toFixed(1)}% - potential dump risk`
        : 'Creator holdings are reasonable',
    };
  }
  
  private checkContractVerification(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    return {
      name: 'Contract Verification',
      detected: data.isOpenSource === '0',
      severity: 'MEDIUM' as const,
      description: data.isOpenSource === '0'
        ? 'Contract not verified - impossible to audit code'
        : 'Contract is verified and auditable',
    };
  }
  
  private checkProxyPattern(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    return {
      name: 'Proxy Pattern',
      detected: data.isProxy === '1',
      severity: 'MEDIUM' as const,
      description: data.isProxy === '1'
        ? 'Proxy contract - logic can be changed post-deployment'
        : 'Direct implementation (non-upgradeable)',
    };
  }
  
  private checkBlacklistFunction(data: TokenSecurityData): {
    name: string;
    detected: boolean;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
  } {
    return {
      name: 'Blacklist Capability',
      detected: data.isBlacklisted === '1',
      severity: 'HIGH' as const,
      description: data.isBlacklisted === '1'
        ? 'Contract can blacklist addresses - prevents selling'
        : 'No blacklist function detected',
    };
  }
  
  private getRiskLevel(score: number): RugPullScore['risk'] {
    if (score < 20) return 'MINIMAL';
    if (score < 40) return 'LOW';
    if (score < 60) return 'MEDIUM';
    if (score < 80) return 'HIGH';
    return 'CRITICAL';
  }
  
  private getRecommendation(risk: RugPullScore['risk'], indicatorCount: number): string {
    const recommendations = {
      MINIMAL: '✅ Low rug pull risk. Token appears relatively safe for investment.',
      LOW: '⚠️ Some minor concerns. Invest with caution and proper risk management.',
      MEDIUM: '🔶 Moderate rug pull risk detected. Only invest what you can afford to lose.',
      HIGH: '🚨 HIGH RUG PULL RISK! Strongly recommend avoiding this token.',
      CRITICAL: '⛔ CRITICAL DANGER! This token has extreme rug pull characteristics. DO NOT INVEST.',
    };
    
    return recommendations[risk] + ` (${indicatorCount} risk indicators detected)`;
  }
}

export const rugPullDetector = new RugPullDetector();
