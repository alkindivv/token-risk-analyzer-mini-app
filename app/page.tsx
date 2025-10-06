'use client';

import { useState } from 'react';
import ModernScanner from '@/components/ModernScanner';
import ModernRiskCard from '@/components/ModernRiskCard';
import { ScanResult } from '@/types';
import { Shield, Menu } from 'lucide-react';

export default function Home() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Token Risk Analyzer</h1>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-6">
        <ModernScanner onScan={setScanResult} />
        {scanResult && (
          <div className="mt-6">
            <ModernRiskCard result={scanResult} />
          </div>
        )}

{!scanResult && (
          <div className="text-center mt-12 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-800 rounded-full mb-4">
              <Shield className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Scan Any Token
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter a token address or symbol to analyze security risks, detect honeypots, and view detailed contract information.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}