import { NextRequest, NextResponse } from 'next/server';
import { goPlusClient } from '@/lib/goplus';
import { riskEngine } from '@/lib/risk-engine';
import { priceAPI } from '@/lib/price-api';
import { whaleDetector } from '@/lib/whale-detector';
import { rugPullDetector } from '@/lib/rugpull-detector';
import { smartMoneyTracker } from '@/lib/smart-money';
import { liquidityAnalyzer } from '@/lib/liquidity-analyzer';
import { socialAnalyzer } from '@/lib/social-analyzer';

export async function POST(req: NextRequest) {
  try {
    const { tokenAddress, chainId } = await req.json();
    
    if (!tokenAddress || !chainId) {
      return NextResponse.json(
        { error: 'Missing tokenAddress or chainId' },
        { status: 400 }
      );
    }

    console.log('🔍 Comprehensive scan started:', tokenAddress);

    // 1. Get base security data from GoPlus
    const securityData = await goPlusClient.getTokenSecurity(chainId, tokenAddress);
    
    if (!securityData) {
      return NextResponse.json(
        { error: 'Token not found or invalid address' },
        { status: 404 }
      );
    }

    // 2. Calculate base risk score
    const riskScore = riskEngine.calculateRiskScore(securityData);

    // 3. Get price & market data
    console.log('📊 Fetching price data...');
    const priceData = await priceAPI.getTokenPrice(chainId, tokenAddress);
    const dexData = await priceAPI.getDEXData(chainId, tokenAddress);

    // 4. Analyze whales
    console.log('🐋 Analyzing whale wallets...');
    const whaleAnalysis = whaleDetector.analyzeWhales(securityData);

    // 5. Calculate rug pull probability
    console.log('🚨 Calculating rug pull risk...');
    const rugPullAnalysis = rugPullDetector.calculateRugPullRisk(securityData);

    // 6. Analyze smart money flow
    console.log('💰 Tracking smart money...');
    const smartMoney = smartMoneyTracker.analyzeSmartMoney(securityData);

    // 7. Analyze liquidity health
    console.log('💧 Analyzing liquidity health...');
    const liquidityHealth = liquidityAnalyzer.analyzeLiquidity(securityData);

    // 8. Check social sentiment
    console.log('📱 Analyzing social metrics...');
    const socialMetrics = socialAnalyzer.analyzeSocial(
      securityData.tokenName,
      securityData.tokenSymbol
    );

    // 9. Calculate overall verdict
    const verdict = _calculateOverallVerdict(
      riskScore.overall,
      rugPullAnalysis.probability,
      liquidityHealth.healthScore
    );

    // 9. Compile comprehensive response
    const response = {
      // Base data
      tokenAddress,
      chainId,
      securityData,
      riskScore,
      scannedAt: new Date().toISOString(),

      // Advanced analytics
      advanced: {
        price: priceData,
        dex: dexData,
        whales: whaleAnalysis,
        rugPull: rugPullAnalysis,
        smartMoney: smartMoney,
        liquidity: liquidityHealth,
        social: socialMetrics,
      },

      // Overall verdict
      verdict,
    };

    console.log('✅ Scan complete');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Scan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scan token' },
      { status: 500 }
    );
  }
}

function _calculateOverallVerdict(
  riskScore: number,
  rugPullProb: number,
  liquidityScore: number
): {
  rating: 'SAFE' | 'MODERATE' | 'RISKY' | 'DANGEROUS';
  confidence: number;
  recommendation: string;
} {
  const avgRisk = (riskScore + rugPullProb + (100 - liquidityScore)) / 3;
  
  let rating: 'SAFE' | 'MODERATE' | 'RISKY' | 'DANGEROUS';
  let recommendation: string;
  
  if (avgRisk < 25) {
    rating = 'SAFE';
    recommendation = '✅ Token appears safe for investment with normal precautions';
  } else if (avgRisk < 50) {
    rating = 'MODERATE';
    recommendation = '⚠️ Moderate risk - invest cautiously and monitor closely';
  } else if (avgRisk < 75) {
    rating = 'RISKY';
    recommendation = '🔶 High risk - only invest what you can afford to lose';
  } else {
    rating = 'DANGEROUS';
    recommendation = '🚨 DANGEROUS - Strong recommendation to AVOID';
  }
  
  const confidence = Math.min(95, 70 + (liquidityScore / 10));
  
  return { rating, confidence, recommendation };
}
