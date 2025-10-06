
'use client';

import { ScanResult } from '@/types';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';
import { CHAINS } from '@/types';

const RISK_COLORS = {
  LOW_RISK: 'bg-green-100 text-green-800 border-green-300',
  MEDIUM_RISK: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  HIGH_RISK: 'bg-orange-100 text-orange-800 border-orange-300',
  CRITICAL_RISK: 'bg-red-100 text-red-800 border-red-300',
};

const FACTOR_COLORS = {
  LOW: 'bg-green-500',
  MEDIUM: 'bg-yellow-500',
  HIGH: 'bg-orange-500',
  CRITICAL: 'bg-red-500',
};

function getFactorColor(score: number): string {
  if (score < 20) return FACTOR_COLORS.LOW;
  if (score < 50) return FACTOR_COLORS.MEDIUM;
  if (score < 80) return FACTOR_COLORS.HIGH;
  return FACTOR_COLORS.CRITICAL;
}

export default function RiskScoreCard({ result }: { result: ScanResult }) {
  const { securityData, riskScore, chainId } = result;
  const chain = CHAINS[chainId as keyof typeof CHAINS];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
      {/* Token Header */}
      <div className="border-b pb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {securityData.tokenName} ({securityData.tokenSymbol})
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-mono break-all">
              {securityData.contractAddress}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-gray-600">
                {chain?.icon} {chain?.name}
              </span>
              <a
                href={`${chain?.explorer}/address/${securityData.contractAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                View on Explorer
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Risk Score */}
      <div className={`p-6 rounded-xl border-2 ${RISK_COLORS[riskScore.category]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Overall Risk Score</p>
            <p className="text-5xl font-bold mt-1">{riskScore.overall}/100</p>
            <p className="text-lg font-semibold mt-2">
              {riskScore.category.replace('_', ' ')}
            </p>
          </div>
          <div>
            {riskScore.category === 'LOW_RISK' && <CheckCircle className="w-20 h-20" />}
            {riskScore.category === 'MEDIUM_RISK' && <Info className="w-20 h-20" />}
            {riskScore.category === 'HIGH_RISK' && <AlertTriangle className="w-20 h-20" />}
            {riskScore.category === 'CRITICAL_RISK' && <XCircle className="w-20 h-20" />}
          </div>
        </div>
      </div>

      {/* Critical Issues - Always show section */}
      {riskScore.criticalIssues && riskScore.criticalIssues.length > 0 ? (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
          <h3 className="font-bold text-red-900 mb-3 text-lg flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Critical Issues
          </h3>
          <ul className="space-y-2">
            {riskScore.criticalIssues.map((issue, i) => (
              <li key={i} className="text-red-800 text-sm font-medium">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-300 rounded-xl">
          <p className="text-green-800 font-medium flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            No critical issues detected
          </p>
        </div>
      )}

      {/* Warnings */}
      {riskScore.warnings && riskScore.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-3 text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Warnings ({riskScore.warnings.length})
          </h3>
          <ul className="space-y-2">
            {riskScore.warnings.map((warning, i) => (
              <li key={i} className="text-yellow-800 text-sm">
                ⚠️ {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Factors Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Risk Factor Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(riskScore.factors).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-700">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <span className="text-lg font-bold text-gray-900">{value}/100</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${getFactorColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
              
              {/* Risk Level Label */}
              <p className="text-xs text-gray-600 mt-1 text-right">
                {value < 20 ? 'Low Risk' : 
                 value < 50 ? 'Medium Risk' : 
                 value < 80 ? 'High Risk' : 
                 'Critical Risk'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Token Statistics */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Total Holders</p>
          <p className="text-2xl font-bold text-gray-900">
            {securityData.holderCount?.toLocaleString() || 'N/A'}
          </p>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">LP Holders</p>
          <p className="text-2xl font-bold text-gray-900">
            {securityData.lpHolderCount?.toLocaleString() || 'N/A'}
          </p>
        </div>
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Creator Balance</p>
          <p className="text-2xl font-bold text-gray-900">
            {parseFloat(securityData.creatorPercent || '0').toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Contract Details */}
      <div className="pt-4 border-t space-y-2">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Contract Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Open Source:</span>
            <span className={`font-semibold ${securityData.isOpenSource === '1' ? 'text-green-600' : 'text-red-600'}`}>
              {securityData.isOpenSource === '1' ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Proxy Contract:</span>
            <span className={`font-semibold ${securityData.isProxy === '1' ? 'text-yellow-600' : 'text-green-600'}`}>
              {securityData.isProxy === '1' ? '⚠ Yes' : '✓ No'}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Mintable:</span>
            <span className={`font-semibold ${securityData.isMintable === '1' ? 'text-yellow-600' : 'text-green-600'}`}>
              {securityData.isMintable === '1' ? '⚠ Yes' : '✓ No'}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Honeypot:</span>
            <span className={`font-semibold ${securityData.isHoneypot === '1' ? 'text-red-600' : 'text-green-600'}`}>
              {securityData.isHoneypot === '1' ? '🚨 Yes' : '✓ No'}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Buy Tax:</span>
            <span className="font-semibold text-gray-900">
              {parseFloat(securityData.buyTax || '0').toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between p-2 bg-gray-50 rounded">
            <span className="text-gray-600">Sell Tax:</span>
            <span className="font-semibold text-gray-900">
              {parseFloat(securityData.sellTax || '0').toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Scan Timestamp */}
      <div className="text-center pt-4 border-t">
        <p className="text-xs text-gray-500">
          Scanned at {new Date(result.scannedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
