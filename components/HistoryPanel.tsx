import React from 'react';
import type { HistoryItem } from '@/types';
import { IconHistory, IconTrash, IconX } from './IconComponents';

interface HistoryPanelProps {
  isOpen: boolean;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, history, onSelect, onClear, onClose }) => {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the entire prompt history? This cannot be undone.')) {
      onClear();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-brand-darker bg-opacity-75 z-30 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-brand-dark shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-panel-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-brand-darker">
            <div className="flex items-center space-x-3">
              <IconHistory className="w-6 h-6 text-brand-accent" />
              <h2 id="history-panel-title" className="text-xl font-bold text-white">Prompt History</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
              aria-label="Close history panel"
            >
              <IconX className="w-6 h-6" />
            </button>
          </div>

          {/* History List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length > 0 ? (
              history.map(item => (
                <div
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="p-3 bg-brand-darker rounded-lg cursor-pointer hover:bg-opacity-80 hover:ring-1 hover:ring-brand-accent transition-all space-y-2"
                >
                  <div>
                    <span className="text-xs text-brand-subtle">Original Prompt</span>
                    <p className="text-sm text-brand-text truncate font-medium">
                      {item.originalPrompt || '[Image Prompt]'}
                    </p>
                  </div>

                  {item.negativePrompt && (
                    <div className="border-t border-brand-dark pt-2">
                        <span className="text-xs text-brand-subtle">Negative Prompt</span>
                        <p className="text-sm text-gray-400 truncate">
                            {item.negativePrompt}
                        </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 text-xs text-brand-subtle">
                    <span>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    <span className="font-mono bg-brand-dark px-2 py-1 rounded">
                      {item.tokenCounts.original} → {item.tokenCounts.optimized}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-brand-subtle py-10">
                <p>No history yet.</p>
                <p className="text-sm">Optimized prompts will appear here.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-brand-darker">
              <button
                onClick={handleClear}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-red-500/50 text-sm font-medium rounded-md shadow-sm text-red-300 bg-red-900/40 hover:bg-red-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-red-500"
              >
                <IconTrash className="w-5 h-5 mr-2" />
                Clear All History
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};