'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { CHAINS } from '@/types';
import Image from 'next/image';

import { ScanResult } from '@/types';

export default function ModernScanner({ onScan }: { onScan: (result: ScanResult) => void }) {
  const [query, setQuery] = useState('');
  const [chainId, setChainId] = useState('8453');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!query) {
      setError('Please enter token address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAddress: query, chainId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scan failed');
      onScan(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleScan()}
          placeholder="Enter address or token symbol"
          className="w-full pl-12 pr-4 py-4 bg-slate-700/50 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
        />
      </div>

      {/* Chain Selector Pills - Improved mobile scrolling */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
        {Object.entries(CHAINS).map(([id, chain]) => (
          <button
            key={id}
            onClick={() => setChainId(id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all min-w-fit ${
              chainId === id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Image
                src={chain.icon}
                alt={`${chain.name} Logo`}
                width={16} // Sesuaikan ukuran sesuai kebutuhan
                height={16} // Sesuaikan ukuran sesuai kebutuhan
                className="w-4 h-4" // Atur ukuran tampilan
              />
              {chain.name}
            </span>
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center text-gray-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2">Scanning token...</p>
        </div>
      )}
    </div>
  );
}
