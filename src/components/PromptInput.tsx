import React from 'react';

interface PromptInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ label, value, onChange, disabled }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="original-prompt" className="block text-sm font-medium text-brand-subtle">
        {label}
      </label>
      <textarea
        id="original-prompt"
        rows={6}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder="e.g., A detailed step-by-step guide on how to bake a chocolate cake from scratch..."
        className="w-full p-3 bg-brand-dark border border-brand-darker rounded-lg shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};
