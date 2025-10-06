'use client';

import { AlertTriangle, TrendingUp, Shield, Users, DollarSign } from 'lucide-react';
import { AdvancedData, Verdict } from '@/types';
import { ScanResult } from '@/types';

interface AdvancedMetricsProps {
  advanced: AdvancedData;
  verdict?: Verdict;
}

export default function AdvancedMetrics({ advanced, verdict }: AdvancedMetricsProps) {
  return (
    <div className="space-y-4">
      {/* Overall Verdict */}
      <VerdictCard verdict={verdict} />

      {/* Price & Market Data */}
      {(advanced.price || advanced.dex) && (
        <MarketDataCard price={advanced.price} dex={advanced.dex} />
      )}

      {/* Rug Pull Analysis */}
      <RugPullCard rugPull={advanced.rugPull} />

      {/* Whale Analysis */}
      <WhaleCard whales={advanced.whales} />

      {/* Liquidity Health */}
      <LiquidityCard liquidity={advanced.liquidity} />

      {/* Smart Money */}
      {advanced.smartMoney.insights.length > 0 && (
        <SmartMoneyCard smartMoney={advanced.smartMoney} />
      )}
    </div>
  );
}

function VerdictCard({ verdict }: { verdict?: ScanResult['verdict'] }) {
  if (!verdict) {
    return null;
  }

  const colors = {
    SAFE: 'bg-green-500/20 border-green-500 text-green-400',
    MODERATE: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
    RISKY: 'bg-orange-500/20 border-orange-500 text-orange-400',
    DANGEROUS: 'bg-red-500/20 border-red-500 text-red-400',
  };

  return (
    <div className={`p-4 sm:p-6 rounded-xl border-2 ${colors[verdict.rating]}`}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0 mb-3">
        <h3 className="text-lg sm:text-2xl font-bold">Overall Verdict</h3>
        <span className="text-2xl sm:text-3xl font-bold">{verdict.rating}</span>
      </div>
      <p className="text-xs sm:text-sm mb-2">{verdict.recommendation}</p>
      <div className="text-xs opacity-75">
        Confidence: {verdict.confidence}%
      </div>
    </div>
  );
}

interface MarketDataCardProps {
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
}

function MarketDataCard({ price, dex }: MarketDataCardProps) {
  const priceUsd = price?.usd || dex?.priceUsd || '0';
  const change24h = price?.usd_24h_change || dex?.priceChange24h || 0;
  const volume = dex?.volume24h || price?.usd_24h_vol || 0;
  const liquidity = dex?.liquidity?.usd || 0;

  return (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      <h3 className="text-white font-bold mb-3 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Market Data
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
        <div>
          <p className="text-gray-400">Price</p>
          <p className="text-white font-bold">${parseFloat(String(priceUsd)).toFixed(6)}</p>
        </div>
        <div>
          <p className="text-gray-400">24h Change</p>
          <p className={`font-bold ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
          </p>
        </div>
        {volume > 0 && (
          <div>
            <p className="text-gray-400">24h Volume</p>
            <p className="text-white font-bold">${(volume / 1000).toFixed(1)}K</p>
          </div>
        )}
        {liquidity > 0 && (
          <div>
            <p className="text-gray-400">Liquidity</p>
            <p className="text-white font-bold">${(liquidity / 1000).toFixed(1)}K</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface RugPullCardProps {
  rugPull: {
    probability: number;
    risk: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendation: string;
    indicators: Array<{
      description: string;
    }>;
  };
}

function RugPullCard({ rugPull }: RugPullCardProps) {
  const colors = {
    MINIMAL: 'border-green-500/50',
    LOW: 'border-green-500/50',
    MEDIUM: 'border-yellow-500/50',
    HIGH: 'border-orange-500/50',
    CRITICAL: 'border-red-500/50',
  };

  return (
    <div className={`p-4 bg-slate-800/50 rounded-xl border ${colors[rugPull.risk]}`}>
      <h3 className="text-white font-bold mb-2 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        Rug Pull Risk: {rugPull.probability}%
      </h3>
      <p className="text-xs sm:text-sm text-gray-300 mb-3">{rugPull.recommendation}</p>
      {rugPull.indicators.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs text-gray-400 font-semibold">
            {rugPull.indicators.length} Risk Indicators:
          </p>
          {rugPull.indicators.slice(0, 3).map((ind: { description: string }, i: number) => (
            <div key={i} className="text-xs text-gray-300">
              • {ind.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface WhaleCardProps {
  whales: {
    whaleCount: number;
    concentration: 'HEALTHY' | 'MODERATE' | 'DANGEROUS';
    warnings: string[];
  };
}

function WhaleCard({ whales }: WhaleCardProps) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      <h3 className="text-white font-bold mb-2 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Whale Analysis
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm mb-3">
        <div>
          <p className="text-gray-400">Whale Count</p>
          <p className="text-white font-bold">{whales.whaleCount}</p>
        </div>
        <div>
          <p className="text-gray-400">Concentration</p>
          <p className={`font-bold ${
            whales.concentration === 'HEALTHY' ? 'text-green-400' :
            whales.concentration === 'MODERATE' ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {whales.concentration}
          </p>
        </div>
      </div>
      {whales.warnings.length > 0 && (
        <div className="space-y-1">
          {whales.warnings.map((w: string, i: number) => (
            <div key={i} className="text-xs text-yellow-300">{w}</div>
          ))}
        </div>
      )}
    </div>
  );
}

interface LiquidityCardProps {
  liquidity: {
    healthScore: number;
    status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'CRITICAL';
    recommendations: string[];
  };
}

function LiquidityCard({ liquidity }: LiquidityCardProps) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
        <TrendingUp className="w-5 h-5" />
        Liquidity Health: {liquidity.healthScore}/100
      </h3>
      <div className="mb-3">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${
              liquidity.status === 'EXCELLENT' || liquidity.status === 'GOOD' ? 'bg-green-500' :
              liquidity.status === 'FAIR' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${liquidity.healthScore}%` }}
          />
        </div>
      </div>
      {liquidity.recommendations.length > 0 && (
        <div className="text-xs sm:text-sm text-gray-300">
          {liquidity.recommendations[0]}
        </div>
      )}
    </div>
  );
}

interface SmartMoneyCardProps {
  smartMoney: {
    insights: string[];
  };
}

function SmartMoneyCard({ smartMoney }: SmartMoneyCardProps) {
  return (
    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
      <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-sm sm:text-base">
        <Shield className="w-5 h-5" />
        Smart Money Insights
      </h3>
      <div className="space-y-1">
        {smartMoney.insights.map((insight: string, i: number) => (
          <div key={i} className="text-xs sm:text-sm text-gray-300">{insight}</div>
        ))}
      </div>
    </div>
  );
}
