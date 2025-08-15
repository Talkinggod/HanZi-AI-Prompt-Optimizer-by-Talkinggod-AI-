
import React from 'react';
import { IconBolt, IconSparkles, IconLoader } from './IconComponents';

interface ActionButtonsProps {
  onOptimize: () => void;
  onGetResponse: () => void;
  isOptimizing: boolean;
  isGettingResponse: boolean;
  isPromptEmpty: boolean;
  isOptimizedPromptEmpty: boolean;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onOptimize,
  onGetResponse,
  isOptimizing,
  isGettingResponse,
  isPromptEmpty,
  isOptimizedPromptEmpty,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={onOptimize}
        disabled={isPromptEmpty || isOptimizing || isGettingResponse}
        className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker focus:ring-brand-accent disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
      >
        {isOptimizing ? (
          <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
        ) : (
          <IconBolt className="-ml-1 mr-3 h-5 w-5" />
        )}
        <span>{isOptimizing ? 'Optimizing...' : '2. Optimize Prompt'}</span>
      </button>
      <button
        onClick={onGetResponse}
        disabled={isOptimizedPromptEmpty || isGettingResponse || isOptimizing}
        className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-brand-dark bg-brand-accent hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-darker focus:ring-blue-500 disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isGettingResponse ? (
          <IconLoader className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" />
        ) : (
          <IconSparkles className="-ml-1 mr-3 h-5 w-5" />
        )}
        <span>{isGettingResponse ? 'Generating...' : '3. Get Response'}</span>
      </button>
    </div>
  );
};