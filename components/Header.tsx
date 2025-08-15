import React from 'react';
import { IconBolt, IconHistory } from './IconComponents';

interface HeaderProps {
  onToggleHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
  return (
    <header className="bg-brand-dark shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <IconBolt className="w-8 h-8 text-brand-accent" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            HanZi Prompt Optimizer
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <p className="hidden md:block text-brand-subtle">
            Optimize prompts, save tokens.
          </p>
          <div className="relative group">
            <button
              onClick={onToggleHistory}
              className="p-2 rounded-full text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
              aria-label="View prompt history"
            >
              <IconHistory className="w-6 h-6" />
            </button>
            <div className="absolute z-10 top-1/2 -translate-y-1/2 right-full mr-2 whitespace-nowrap px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              History
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};