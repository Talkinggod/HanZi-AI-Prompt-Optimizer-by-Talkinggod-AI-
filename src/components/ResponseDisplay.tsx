import React, { useState, useCallback } from 'react';
import { IconSparkles, IconLoader, IconCopy, IconCheck } from '@/components/IconComponents';

interface ResponseDisplayProps {
  response: string;
  isLoading: boolean;
}

export const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response, isLoading }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!response || isCopied) return;
    navigator.clipboard.writeText(response).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset icon after 2 seconds
    });
  }, [response, isCopied]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white flex items-center">
        <IconSparkles className="w-6 h-6 mr-2 text-brand-accent" />
        Final LLM Response
      </h2>
      <div className="relative w-full p-4 bg-brand-dark border border-brand-darker rounded-lg shadow-sm text-brand-text min-h-[10rem]">
         {response && !isLoading && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-1.5 rounded-md text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent transition-colors"
            aria-label={isCopied ? 'Copied' : 'Copy response'}
          >
            {isCopied ? (
              <IconCheck className="w-5 h-5 text-green-400" />
            ) : (
              <IconCopy className="w-5 h-5" />
            )}
          </button>
        )}
        
        {isLoading && !response && (
            <div className="flex items-center justify-center h-full text-brand-subtle">
                <p>Generating response...</p>
            </div>
        )}
        <div className="whitespace-pre-wrap font-mono text-sm pr-10">
            {response}
            {isLoading && <span className="inline-block w-2 h-4 bg-brand-accent animate-pulse ml-1" aria-hidden="true"></span>}
        </div>
        {!isLoading && !response && (
          <p className="text-gray-500">The response from the LLM will appear here after you run the optimized prompt.</p>
        )}
      </div>
    </div>
  );
};