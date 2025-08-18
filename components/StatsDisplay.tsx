import React from 'react';
import type { TokenCounts } from '@/types';

interface StatsDisplayProps {
  tokenCounts: TokenCounts;
}

const StatCard: React.FC<{ title: string; value: number | string; valueClassName?: string; tooltip: string }> = ({ title, value, valueClassName, tooltip }) => (
  <div className="relative group flex flex-col items-center justify-center p-4 bg-brand-dark rounded-lg shadow">
    <span className="text-sm font-medium text-brand-subtle">{title}</span>
    <span className={`text-2xl font-bold ${valueClassName || 'text-white'}`}>{value}</span>
    <div className="absolute z-10 bottom-full mb-2 w-48 whitespace-normal px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
    </div>
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
        <StatCard title="Original Tokens" value={original} tooltip="The token count of your initial prompt and negative prompt combined." />
        <StatCard title="Optimized Tokens" value={optimized} tooltip="The token count of the final, optimized prompt." />
        <StatCard 
            title="Tokens Saved" 
            value={savings} 
            valueClassName={getStatColor(savings)}
            tooltip="The absolute difference in token count between the original and optimized prompts."
        />
        <StatCard 
            title="Reduction" 
            value={`${reduction}%`} 
            valueClassName={getStatColor(reduction)}
            tooltip="The percentage decrease in token count achieved through optimization."
        />
      </div>
    </div>
  );
};