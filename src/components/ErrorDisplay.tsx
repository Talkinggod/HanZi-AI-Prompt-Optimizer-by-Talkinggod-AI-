import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="p-4 mt-4 text-sm text-red-200 bg-red-900 bg-opacity-50 border border-red-500 rounded-md" role="alert">
      <strong className="font-bold">Error: </strong>
      <span>{error}</span>
    </div>
  );
};