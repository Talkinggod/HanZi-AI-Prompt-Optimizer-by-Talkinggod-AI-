import React from 'react';
import { IconHistory } from '@/components/IconComponents';

interface HeaderProps {
  onToggleHistory: () => void;
}

const talkingGodLogoUrl = "https://avatars.githubusercontent.com/u/9386738?v=4";

export const Header: React.FC<HeaderProps> = ({ onToggleHistory }) => {
  return (
    <header className="bg-brand-dark p-4 shadow-md border-b border-brand-darker">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <img src={talkingGodLogoUrl} alt="Talkinggod AI Logo" className="w-10 h-10 rounded-full object-cover border-2 border-brand-darker" />
            <h1 className="text-2xl font-bold text-white tracking-tight">
              HanZi Prompt Optimizer
            </h1>
            <span className="text-sm font-light text-white align-baseline">by Talkinggod AI</span>
        </div>
        <div className="relative group">
          <button
            onClick={onToggleHistory}
            className="p-2 rounded-full text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-colors"
            aria-label="View prompt history"
          >
            <IconHistory className="w-6 h-6" />
          </button>
          <div className="absolute z-10 top-1/2 -translate-y-1/2 right-full mr-2 w-max whitespace-nowrap px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Prompt History
          </div>
        </div>
      </div>
    </header>
  );
};