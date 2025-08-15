import React from 'react';
import type { TokenCounts } from '@/types';

interface StatsDisplayProps {
  tokenCounts: TokenCounts;
}

const StatCard: React.FC<{ title: string; value: number | string; valueClassName?: string }> = ({ title, value, valueClassName }) => (
  <div className="flex flex-col items-center justify-center p-4 bg-brand-dark rounded-lg shadow">
    <span className="text-sm font-medium text-brand-subtle">{title}</span>
    <span className={`text-2xl font-bold ${valueClassName || 'text-white'}`}>{value}</span>
  </div>
);

export const StatsDisplay: React.FC<StatsDisplayProps> = ({ tokenCounts }) => {
  const { original, optimized } = tokenCounts;

  if (original === 0) {
    return null; // Don't show stats until an optimization has been run
  }

  const savings = original - optimized;
  const reduction = original > 0 ? Math.round((savings / original) * 100) : 0;

  const getStatColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-white';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-brand-subtle">Token Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Original Tokens" value={original} />
        <StatCard title="Optimized Tokens" value={optimized} />
        <StatCard 
            title="Tokens Saved" 
            value={savings} 
            valueClassName={getStatColor(savings)}
        />
        <StatCard 
            title="Reduction" 
            value={`${reduction}%`} 
            valueClassName={getStatColor(reduction)}
        />
      </div>
    </div>
  );
};
