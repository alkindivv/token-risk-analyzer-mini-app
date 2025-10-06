"use client";
import { useState } from "react";
import TokenScanner from '../components/TokenScanner';
import RiskScoreCard from '../components/RiskScoreCard';
import { ScanResult } from '@/types';





export default function Home() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Token Risk Scanner
          </h1>
          <p className="text-xl text-gray-600">
            Analyze token security, detect honeypots, and avoid scams
          </p>
        </div>

        {/* Scanner */}
        <TokenScanner onScan={setScanResult} />

        {/* Results */}
        {scanResult && (
          <div className="mt-8">
            <RiskScoreCard result={scanResult} />
          </div>
        )}
      </div>
    </main>
  );
}
