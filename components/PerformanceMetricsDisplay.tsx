import React from 'react';
import type { PerformanceMetrics } from '../types';

interface PerformanceMetricsDisplayProps {
  metrics: PerformanceMetrics | null;
}

const MetricCard: React.FC<{ title: string; value: string; valueClassName?: string; tooltip: string }> = ({ title, value, valueClassName, tooltip }) => (
  <div className="relative group flex flex-col items-center justify-center p-3 bg-brand-dark rounded-lg shadow">
    <span className="text-xs font-medium text-brand-subtle">{title}</span>
    <span className={`text-xl font-bold ${valueClassName || 'text-white'}`}>{value}</span>
    <div className="absolute z-10 bottom-full mb-2 w-44 whitespace-normal px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {tooltip}
    </div>
  </div>
);

export const PerformanceMetricsDisplay: React.FC<PerformanceMetricsDisplayProps> = ({ metrics }) => {
  if (!metrics) {
    return null;
  }
  
  const getScoreColor = (value: number) => {
    if (value >= 0.95) return 'text-green-400';
    if (value >= 0.9) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-brand-subtle">Performance Metrics</h3>
      <div className="grid grid-cols-3 gap-4">
        <MetricCard 
            title="Latency" 
            value={`${metrics.latency}ms`}
            tooltip="Total time for the optimization API call to complete."
        />
        <MetricCard 
            title="Semantic Fidelity" 
            value={`${(metrics.semanticFidelity * 100).toFixed(1)}%`}
            valueClassName={getScoreColor(metrics.semanticFidelity)}
            tooltip="[SIMULATED] Measures how well the optimized prompt retains the core meaning of the original."
        />
        <MetricCard 
            title="Instruction Adherence" 
            value={`${(metrics.instructionAdherence * 100).toFixed(1)}%`}
            valueClassName={getScoreColor(metrics.instructionAdherence)}
            tooltip="[SIMULATED] Measures how well the optimizer follows all instructions and constraints."
        />
      </div>
    </div>
  );
};