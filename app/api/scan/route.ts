import { NextRequest, NextResponse } from 'next/server';
import { goPlusClient } from '@/lib/goplus';
import { riskEngine } from '@/lib/risk-engine';

export async function POST(req: NextRequest) {
  try {
    const { tokenAddress, chainId } = await req.json();
    
    if (!tokenAddress || !chainId) {
      return NextResponse.json(
        { error: 'Missing tokenAddress or chainId' },
        { status: 400 }
      );
    }

    console.log('Scanning token:', tokenAddress, 'on chain:', chainId);

    const securityData = await goPlusClient.getTokenSecurity(chainId, tokenAddress);
    
    if (!securityData) {
      return NextResponse.json(
        { error: 'Token not found or invalid address' },
        { status: 404 }
      );
    }

    const riskScore = riskEngine.calculateRiskScore(securityData);

    return NextResponse.json({
      tokenAddress,
      chainId,
      securityData,
      riskScore,
      scannedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Scan error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to scan token' },
      { status: 500 }
    );
  }
}