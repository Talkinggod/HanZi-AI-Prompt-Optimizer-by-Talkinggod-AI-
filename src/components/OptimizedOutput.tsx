import React, { useState, useCallback } from 'react';
import { IconLoader, IconCopy, IconCheck } from '@/components/IconComponents';

interface OptimizedOutputProps {
  prompt: string;
  isLoading: boolean;
}

export const OptimizedOutput: React.FC<OptimizedOutputProps> = ({ prompt, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!prompt || isCopied) return;
    navigator.clipboard.writeText(prompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    });
  }, [prompt, isCopied]);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-brand-subtle">Optimized Prompt</h3>
      <div className="relative w-full p-4 min-h-[11rem] bg-brand-dark border border-brand-darker rounded-lg shadow-sm text-brand-text">
        {prompt && !isLoading && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
            aria-label={isCopied ? 'Copied' : 'Copy prompt'}
          >
            {isCopied ? (
              <IconCheck className="w-5 h-5 text-green-400" />
            ) : (
              <IconCopy className="w-5 h-5" />
            )}
          </button>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-dark bg-opacity-75 rounded-lg">
            <IconLoader className="w-8 h-8 animate-spin text-brand-accent" />
          </div>
        )}
        {!isLoading && prompt && (
          <p className="whitespace-pre-wrap font-mono text-sm pr-10">{prompt}</p>
        )}
        {!isLoading && !prompt && (
          <p className="text-gray-500">Your optimized prompt will appear here...</p>
        )}
      </div>
    </div>
  );
};