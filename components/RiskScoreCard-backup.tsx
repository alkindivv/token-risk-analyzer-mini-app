// components/RiskScoreCard.tsx
'use client';

import { ScanResult } from '@/types';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';

const RISK_COLORS = {
  LOW_RISK: 'bg-green-100 text-green-800 border-green-300',
  MEDIUM_RISK: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  HIGH_RISK: 'bg-orange-100 text-orange-800 border-orange-300',
  CRITICAL_RISK: 'bg-red-100 text-red-800 border-red-300',
};

export default function RiskScoreCard({ result }: { result: ScanResult }) {
  const { securityData, riskScore } = result;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6">
      {/* Token Info */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {securityData.tokenName} ({securityData.tokenSymbol})
        </h1>
        <p className="text-sm text-gray-500 mt-1 font-mono">
          {securityData.contractAddress}
        </p>
      </div>

      {/* Risk Score */}
      <div className={`p-6 rounded-xl border-2 ${RISK_COLORS[riskScore.category]}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">Overall Risk Score</p>
            <p className="text-4xl font-bold mt-1">{riskScore.overall}/100</p>
            <p className="text-lg font-semibold mt-2">
              {riskScore.category.replace('_', ' ')}
            </p>
          </div>
          {riskScore.category === 'LOW_RISK' && <CheckCircle className="w-16 h-16" />}
          {riskScore.category === 'MEDIUM_RISK' && <Info className="w-16 h-16" />}
          {riskScore.category === 'HIGH_RISK' && <AlertTriangle className="w-16 h-16" />}
          {riskScore.category === 'CRITICAL_RISK' && <XCircle className="w-16 h-16" />}
        </div>
      </div>

      {/* Critical Issues */}
      {riskScore.criticalIssues.length > 0 && (
        <div className="p-4 bg-red-50 border-2 border-red-300 rounded-xl">
          <h3 className="font-bold text-red-900 mb-2">Critical Issues</h3>
          <ul className="space-y-1">
            {riskScore.criticalIssues.map((issue, i) => (
              <li key={i} className="text-red-800 text-sm">{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {riskScore.warnings.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded-xl">
          <h3 className="font-bold text-yellow-900 mb-2">Warnings</h3>
          <ul className="space-y-1">
            {riskScore.warnings.map((warning, i) => (
              <li key={i} className="text-yellow-800 text-sm">⚠️ {warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Factors */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(riskScore.factors).map(([key, value]) => (
          <div key={key} className="p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              <span className="text-sm text-gray-500 mb-1">/100</span>
            </div>
            <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  value < 20 ? 'bg-green-500' :
                  value < 50 ? 'bg-yellow-500' :
                  value < 80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Token Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        <div>
          <p className="text-xs text-gray-600">Holders</p>
          <p className="text-lg font-semibold text-gray-900">
            {securityData.holderCount?.toLocaleString() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">LP Holders</p>
          <p className="text-lg font-semibold text-gray-900">
            {securityData.lpHolderCount?.toLocaleString() || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Creator %</p>
          <p className="text-lg font-semibold text-gray-900">
            {parseFloat(securityData.creatorPercent || '0').toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
}
