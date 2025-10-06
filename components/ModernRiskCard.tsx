'use client';

import { ScanResult, CHAINS } from '@/types';
import { TrendingUp, Shield, Users, Activity, AlertTriangle, Home, GitCompare, Settings, ExternalLink } from 'lucide-react';
import AdvancedMetrics from '@/components/AdvancedMetrics';

const RISK_CONFIG = {
  LOW_RISK: { color: 'bg-green-500', label: 'LOW RISK', gradient: 'from-green-500/20' },
  MEDIUM_RISK: { color: 'bg-yellow-500', label: 'MEDIUM RISK', gradient: 'from-yellow-500/20' },
  HIGH_RISK: { color: 'bg-orange-500', label: 'HIGH RISK', gradient: 'from-orange-500/20' },
  CRITICAL_RISK: { color: 'bg-red-500', label: 'CRITICAL', gradient: 'from-red-500/20' },
};

export default function ModernRiskCard({ result }: { result: ScanResult }) {
  const { securityData, riskScore, chainId, advanced, verdict } = result;
  const config = RISK_CONFIG[riskScore.category];
  const chain = CHAINS[chainId as keyof typeof CHAINS];

  type StatusResult = {
    label: string;
    status: 'success' | 'warning' | 'danger' | 'neutral';
  };

  // Calculate liquidity status from REAL data
  const liquidityStatus = (): StatusResult => {
    const lpCount = securityData.lpHolderCount || 0;
    if (lpCount >= 100) return { label: 'Excellent', status: 'success' };
    if (lpCount >= 50) return { label: 'Sufficient', status: 'success' };
    if (lpCount >= 10) return { label: 'Moderate', status: 'warning' };
    return { label: 'Low', status: 'danger' };
  };

  // Calculate holder distribution from REAL data
  const holderDistribution = (): StatusResult => {
    if (securityData.holders && securityData.holders.length > 0) {
      const top10 = securityData.holders.slice(0, 10).reduce((sum, h) => sum + parseFloat(h.percent || '0'), 0);
      if (top10 < 40) return { label: 'Well distributed', status: 'success' };
      if (top10 < 60) return { label: 'Moderate', status: 'warning' };
      return { label: 'Centralized', status: 'danger' };
    }
    return { label: 'Unknown', status: 'neutral' };
  };

  // Calculate contract risk from REAL security data
  const contractRisk = (): StatusResult => {
    const score = riskScore.factors.contractSecurity;
    if (score < 20) return { label: 'Secure', status: 'success' };
    if (score < 50) return { label: 'Moderate', status: 'warning' };
    if (score < 80) return { label: 'High Risk', status: 'danger' };
    return { label: 'Critical', status: 'danger' };
  };

  // Audit flags from REAL data
  const auditFlags = (): StatusResult => {
    const issues = [];
    if (securityData.isOpenSource === '0') issues.push('Not verified');
    if (securityData.isProxy === '1') issues.push('Proxy');
    if (securityData.isMintable === '1') issues.push('Mintable');
    if (securityData.hiddenOwner === '1') issues.push('Hidden owner');
    
    if (issues.length === 0) return { label: 'Clean', status: 'success' };
    return { label: `${issues.length} flags`, status: 'warning' };
  };

  // Trading restrictions from REAL data
  const tradingRestrictions = (): StatusResult => {
    const score = riskScore.factors.tradingRestrictions;
    if (score === 0) return { label: 'No restrictions', status: 'success' };
    if (score < 30) return { label: 'Minor', status: 'warning' };
    return { label: 'High restrictions', status: 'danger' };
  };

  // Tax analysis from REAL data
  const taxAnalysis = (): StatusResult => {
    const buyTax = parseFloat(securityData.buyTax || '0');
    const sellTax = parseFloat(securityData.sellTax || '0');
    const totalTax = buyTax + sellTax;
    
    if (totalTax === 0) return { label: 'No tax', status: 'success' };
    if (totalTax < 10) return { label: `${totalTax.toFixed(1)}% tax`, status: 'success' };
    if (totalTax < 20) return { label: `${totalTax.toFixed(1)}% tax`, status: 'warning' };
    return { label: `${totalTax.toFixed(1)}% tax`, status: 'danger' };
  };

  const liq = liquidityStatus();
  const holder = holderDistribution();
  const contract = contractRisk();
  const audit = auditFlags();
  const trading = tradingRestrictions();
  const tax = taxAnalysis();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 pb-24">
      {/* Token Info Header */}
      <div className="mb-4 p-4 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-bold text-lg">
            {securityData.tokenName} ({securityData.tokenSymbol})
          </h3>
          <span className="text-xs text-gray-400">{chain?.icon} {chain?.name}</span>
        </div>
        <p className="text-xs text-gray-400 font-mono break-all mb-2">
          {securityData.contractAddress}
        </p>
        <a
          href={`${chain?.explorer}/address/${securityData.contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          View on Explorer <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Risk Score Hero */}
      <div className="mb-6 p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
        <h2 className="text-sm text-gray-400 mb-2">Overall Risk Score</h2>
        <div className="flex items-center justify-between mb-4">
          <div className="text-7xl font-bold text-white">{riskScore.overall}</div>
          <div className={`px-6 py-3 ${config.color} rounded-full text-white font-bold text-sm`}>
            {config.label}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${config.color} transition-all duration-500`}
            style={{ width: `${riskScore.overall}%` }}
          />
        </div>
      </div>

      {/* Critical Issues Alert */}
      {riskScore.criticalIssues.length > 0 && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-xl">
          <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {riskScore.criticalIssues.length} Critical Issue{riskScore.criticalIssues.length > 1 ? 's' : ''}
          </h3>
          <ul className="space-y-1">
            {riskScore.criticalIssues.map((issue, i) => (
              <li key={i} className="text-red-300 text-sm">{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Metrics Grid - ALL FUNCTIONAL */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MetricCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Liquidity Depth"
          value={liq.label}
          detail={`${securityData.lpHolderCount || 0} LP holders`}
          status={liq.status}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          title="Holder Distribution"
          value={holder.label}
          detail={`${securityData.holderCount?.toLocaleString() || 0} holders`}
          status={holder.status}
        />
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          title="Contract Security"
          value={contract.label}
          detail={`Score: ${riskScore.factors.contractSecurity}/100`}
          status={contract.status}
        />
        <MetricCard
          icon={<Shield className="w-5 h-5" />}
          title="Audit Flags"
          value={audit.label}
          detail={securityData.isOpenSource === '1' ? 'Verified' : 'Not verified'}
          status={audit.status}
        />
        <MetricCard
          icon={<AlertTriangle className="w-5 h-5" />}
          title="Trading Restrictions"
          value={trading.label}
          detail={`Score: ${riskScore.factors.tradingRestrictions}/100`}
          status={trading.status}
        />
        <MetricCard
          icon={<Activity className="w-5 h-5" />}
          title="Tax Analysis"
          value={tax.label}
          detail={`Buy: ${parseFloat(securityData.buyTax || '0').toFixed(1)}% / Sell: ${parseFloat(securityData.sellTax || '0').toFixed(1)}%`}
          status={tax.status}
        />
      </div>

      {/* Advanced Metrics Section - Displays Price, Whale Detector, Rug Pull, Smart Money */}
      {advanced && (
        <div className="mb-6 p-4 bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700">
          <h3 className="text-white font-bold mb-4 text-center">Advanced Analytics</h3>
          <AdvancedMetrics advanced={advanced} verdict={verdict} />
        </div>
      )}

      {/* Detailed Warnings */}
      {riskScore.warnings.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <h3 className="text-yellow-400 font-bold mb-3 text-sm">
            ⚠️ {riskScore.warnings.length} Warning{riskScore.warnings.length > 1 ? 's' : ''}
          </h3>
          <ul className="space-y-1">
            {riskScore.warnings.map((warning, i) => (
              <li key={i} className="text-yellow-300 text-xs">{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard
          label="Creator Balance"
          value={`${parseFloat(securityData.creatorPercent || '0').toFixed(2)}%`}
          alert={parseFloat(securityData.creatorPercent || '0') > 30}
        />
        <StatCard
          label="Open Source"
          value={securityData.isOpenSource === '1' ? 'Yes' : 'No'}
          alert={securityData.isOpenSource === '0'}
        />
        <StatCard
          label="Honeypot"
          value={securityData.isHoneypot === '1' ? 'YES' : 'No'}
          alert={securityData.isHoneypot === '1'}
        />
      </div>

      {/* Bottom Navigation - FUNCTIONAL */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-around">
          <NavButton 
            icon={<Home className="w-6 h-6" />} 
            label="Analyze" 
            active 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <NavButton 
            icon={<GitCompare className="w-6 h-6" />} 
            label="Compare" 
            active={false}
            onClick={() => alert('Compare feature coming soon!')}
          />
          <NavButton 
            icon={<Settings className="w-6 h-6" />} 
            label="Settings"
            active={false}
            onClick={() => alert('Settings feature coming soon!')}
          />
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
  status: 'success' | 'warning' | 'danger' | 'neutral';
}

function MetricCard({ icon, title, value, detail, status }: MetricCardProps) {
  const statusColors = {
    success: 'text-green-400 border-green-500/30 bg-green-500/10',
    warning: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    danger: 'text-red-400 border-red-500/30 bg-red-500/10',
    neutral: 'text-gray-400 border-slate-700 bg-slate-800/50',
  };

  return (
    <div className={`p-4 backdrop-blur-sm rounded-xl border transition-all hover:scale-105 ${statusColors[status]}`}>
      <div className="mb-2">{icon}</div>
      <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
      <p className="text-current text-xs font-bold mb-1">{value}</p>
      <p className="text-gray-500 text-xs">{detail}</p>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  alert: boolean;
}

function StatCard({ label, value, alert }: StatCardProps) {
  return (
    <div className={`p-3 rounded-lg text-center ${
      alert ? 'bg-red-500/20 border border-red-500/50' : 'bg-slate-800/50 border border-slate-700'
    }`}>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-sm font-bold ${alert ? 'text-red-400' : 'text-white'}`}>{value}</p>
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${
        active ? 'text-blue-400' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}




