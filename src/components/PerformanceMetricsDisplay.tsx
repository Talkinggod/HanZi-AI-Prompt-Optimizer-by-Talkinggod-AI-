import React from 'react';
import type { PerformanceMetrics } from '@/types/index';

interface PerformanceMetricsDisplayProps {
  metrics: PerformanceMetrics | null;
}

const ProgressBar: React.FC<{ value: number; colorClass: string }> = ({ value, colorClass }) => (
  <div className="w-full bg-brand-darker rounded-full h-1.5 mt-1">
    <div className={`${colorClass} h-1.5 rounded-full`} style={{ width: `${value * 100}%` }}></div>
  </div>
);

const MetricCard: React.FC<{ title: string; value: number; displayValue: string; colorClass: string; bgColorClass: string; isPercentage: boolean; tooltip: string }> = ({ title, value, displayValue, colorClass, bgColorClass, isPercentage, tooltip }) => (
  <div className="relative group p-3 bg-brand-dark rounded-lg shadow space-y-1">
     <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-brand-subtle">{title}</span>
        <span className={`text-lg font-bold ${colorClass}`}>{displayValue}</span>
     </div>
     <ProgressBar value={isPercentage ? value : (value / 4000)} colorClass={bgColorClass} />
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
   const getScoreBgColor = (value: number) => {
    if (value >= 0.95) return 'bg-green-500';
    if (value >= 0.9) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  const getLatencyColor = (ms: number) => {
    if (ms <= 1000) return 'text-green-400';
    if (ms <= 3000) return 'text-yellow-400';
    return 'text-red-400';
  };
   const getLatencyBgColor = (ms: number) => {
    if (ms <= 1000) return 'bg-green-500';
    if (ms <= 3000) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-brand-subtle">Performance Metrics</h3>
      <div className="space-y-3">
        <MetricCard 
            title="Latency" 
            value={metrics.latency}
            displayValue={`${metrics.latency}ms`}
            colorClass={getLatencyColor(metrics.latency)}
            bgColorClass={getLatencyBgColor(metrics.latency)}
            isPercentage={false}
            tooltip="Total time for the optimization API call to complete."
        />
        <MetricCard 
            title="Semantic Fidelity" 
            value={metrics.semanticFidelity}
            displayValue={`${(metrics.semanticFidelity * 100).toFixed(0)}%`}
            colorClass={getScoreColor(metrics.semanticFidelity)}
            bgColorClass={getScoreBgColor(metrics.semanticFidelity)}
            isPercentage
            tooltip="[SIMULATED] Measures how well the optimized prompt retains the core meaning of the original."
        />
        <MetricCard 
            title="Instruction Adherence" 
            value={metrics.instructionAdherence}
            displayValue={`${(metrics.instructionAdherence * 100).toFixed(0)}%`}
            colorClass={getScoreColor(metrics.instructionAdherence)}
            bgColorClass={getScoreBgColor(metrics.instructionAdherence)}
            isPercentage
            tooltip="[SIMULATED] Measures how well the optimizer follows all instructions and constraints."
        />
      </div>
    </div>
  );
};