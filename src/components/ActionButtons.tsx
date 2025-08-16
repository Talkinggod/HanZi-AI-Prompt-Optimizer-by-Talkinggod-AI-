import React from 'react';
import { IconBolt, IconSparkles, IconLoader, IconXCircle } from './IconComponents';

interface ActionButtonsProps {
  onOptimize: () => void;
  onGetResponse: () => void;
  onClearInputs: () => void;
  isOptimizing: boolean;
  isGettingResponse: boolean;
  isPromptEmpty: boolean;
  isOptimizedPromptEmpty: boolean;
  isClearable: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOptimize,
  onGetResponse,
  onClearInputs,
  isOptimizing,
  isGettingResponse,
  isPromptEmpty,
  isOptimizedPromptEmpty,
  isClearable,
}) => {
  const isBusy = isOptimizing || isGettingResponse;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <button
        onClick={onOptimize}
        disabled={isPromptEmpty || isBusy}
        className="col-span-2 sm:col-span-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker focus:ring-brand-accent disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isOptimizing ? (
          <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        ) : (
          <IconBolt className="-ml-1 mr-3 h-5 w-5" />
        )}
        <span>{isOptimizing ? 'Optimizing...' : '2. Optimize Prompt'}</span>
      </button>
      <div className="relative group">
        <button
          onClick={onGetResponse}
          disabled={isOptimizedPromptEmpty || isBusy}
          className="w-full h-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-brand-dark bg-brand-accent hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker focus:ring-blue-500 disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isGettingResponse ? (
            <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" />
          ) : (
            <IconSparkles className="-ml-1 mr-3 h-5 w-5" />
          )}
          <span>{isGettingResponse ? 'Generating...' : '3. Get Response'}</span>
        </button>
        {isOptimizedPromptEmpty && !isBusy && (
          <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max whitespace-nowrap px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Optimize a prompt first
          </div>
        )}
      </div>
      <button
        onClick={onClearInputs}
        disabled={!isClearable || isBusy}
        className="inline-flex items-center justify-center px-4 py-3 border border-brand-subtle/50 text-base font-medium rounded-md shadow-sm text-brand-subtle bg-brand-dark hover:bg-brand-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker focus:ring-brand-subtle disabled:bg-brand-darker disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        aria-label="Clear all inputs and outputs"
      >
        <IconXCircle className="-ml-1 mr-2 h-5 w-5" />
        <span>Clear</span>
      </button>
    </div>
  );
};
