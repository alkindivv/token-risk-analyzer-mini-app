'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { CHAINS } from '@/types';

import { ScanResult } from '@/types';

export default function TokenScanner({ onScan }: { onScan: (result: ScanResult) => void }) {
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState('8453');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async () => {
    if (!address) {
      setError('Please enter token address');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenAddress: address, chainId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scan failed');
      onScan(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Scan Token</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Chain</label>
        <select
          value={chainId}
          onChange={(e) => setChainId(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(CHAINS).map(([id, chain]) => (
            <option key={id} value={id}>
              {chain.icon} {chain.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Token Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0x..."
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handleScan}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
      >
         {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Search className="w-5 h-5" />
            Scan Token
          </>
        )}
      </button>
    </div>
  );
}