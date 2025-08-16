import React from 'react';

interface PromptInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
  rows?: number;
  tooltip?: string;
}

export const PromptInput: React.FC<PromptInputProps> = ({ id, label, placeholder, value, onChange, disabled, rows = 6, tooltip }) => {
  return (
    <div className="space-y-2">
       <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-brand-subtle">
          {label}
        </label>
        {tooltip && disabled && (
          <div className="relative group">
            <span className="text-xs text-gray-500 cursor-help">(?)</span>
            <div className="absolute z-10 bottom-full right-0 mb-2 w-48 whitespace-normal px-2 py-1 bg-brand-darker text-brand-text text-xs font-medium rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" role="tooltip">
                {tooltip}
            </div>
          </div>
        )}
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full p-3 bg-brand-dark border border-brand-darker rounded-lg shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-darker"
      />
    </div>
  );
};