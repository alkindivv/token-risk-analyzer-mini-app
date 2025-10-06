'use client';

import { useState } from 'react';
import ModernScanner from '@/components/ModernScanner';
import ModernRiskCard from '@/components/ModernRiskCard';
import { ScanResult } from '@/types';
import { Menu } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icon.png"
              alt="Token Analyzer Logo"
              width={40} // Sesuaikan ukuran sesuai kebutuhan
              height={40} // Sesuaikan ukuran sesuai kebutuhan
              className="w-10 h-10 rounded-xl shadow-lg"
            />
            <h1 className="text-lg font-bold text-white">Token Analyzer</h1>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="pt-6 pb-24">
        <ModernScanner onScan={setScanResult} />
        {scanResult && (
          <div className="mt-6">
            <ModernRiskCard result={scanResult} />
          </div>
        )}

        {!scanResult && (
          <div className="text-center mt-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800 rounded-full mb-4">
              <Image
                src="/icon.png"
                alt="Token Analyzer Logo"
                width={32} // Sesuaikan ukuran sesuai kebutuhan
                height={32} // Sesuaikan ukuran sesuai kebutuhan
                className="w-8 h-8" // Sesuaikan kelas CSS jika perlu
              />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Scan Any Token
            </h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">
              Enter a token address or symbol to analyze security risks, detect honeypots, and view detailed contract information.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}