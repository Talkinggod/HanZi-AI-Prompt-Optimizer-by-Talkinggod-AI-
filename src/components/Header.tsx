import React from 'react';
import { IconHistory, IconNotebook } from './IconComponents';

interface HeaderProps {
  onToggleHistory: () => void;
  onToggleNotes: () => void;
}

const InfoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
    </svg>
);


const talkingGodLogoUrl = "https://avatars.githubusercontent.com/u/9386738?v=4";

export const Header: React.FC<HeaderProps> = ({ onToggleHistory, onToggleNotes }) => {
  return (
    <header className="bg-brand-dark p-4 shadow-md border-b border-brand-darker">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
            <img src={talkingGodLogoUrl} alt="Talkinggod AI Logo" className="w-10 h-10 rounded-full object-cover border-2 border-brand-darker" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                HanZi Prompt Optimizer
              </h1>
              <span className="text-sm font-light text-brand-subtle -mt-1">by Talkinggod AI</span>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
                <span className="hidden sm:inline-block text-xs font-semibold text-green-300 bg-green-900/50 px-2 py-1 rounded-full">
                    v4.0.0 T3 Stack
                </span>
                 <div className="relative group">
                    <button className="p-2 rounded-full text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-colors" aria-label="About this version">
                        <InfoIcon />
                    </button>
                    <div className="absolute z-10 top-1/2 -translate-y-1/2 right-full mr-2 w-max whitespace-nowrap px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        T3 Stack Edition
                    </div>
                 </div>
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
          <div className="relative group">
            <button
              onClick={onToggleNotes}
              className="p-2 rounded-full text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-colors"
              aria-label="Open notes"
            >
              <IconNotebook className="w-6 h-6" />
            </button>
            <div className="absolute z-10 top-1/2 -translate-y-1/2 right-full mr-2 w-max whitespace-nowrap px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  My Notes
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};