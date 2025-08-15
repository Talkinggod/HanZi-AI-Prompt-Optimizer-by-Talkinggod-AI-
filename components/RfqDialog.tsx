
import React, { useState, useEffect } from 'react';
import { IconQuestionMarkCircle } from './IconComponents';

interface RfqDialogProps {
    isOpen: boolean;
    question: string;
    onSubmit: (clarification: string) => void;
    onCancel: () => void;
}

export const RfqDialog: React.FC<RfqDialogProps> = ({ isOpen, question, onSubmit, onCancel }) => {
    const [clarification, setClarification] = useState('');

    useEffect(() => {
        if (isOpen) {
            setClarification(''); // Reset text field when dialog opens
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (clarification.trim()) {
            onSubmit(clarification);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-brand-darker bg-opacity-80 z-50 flex items-center justify-center p-4 transition-opacity"
            aria-labelledby="rfq-title"
            role="dialog"
            aria-modal="true"
        >
            <div className="relative bg-brand-dark rounded-xl shadow-2xl w-full max-w-lg p-6 border border-brand-accent/30">
                <div className="flex items-start space-x-4">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-accent/20 sm:mx-0 sm:h-10 sm:w-10">
                        <IconQuestionMarkCircle className="h-6 w-6 text-brand-accent" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold leading-6 text-white" id="rfq-title">
                            Request for Clarification
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-brand-subtle">
                                The optimizer needs more information to create the best prompt:
                            </p>
                            <p className="mt-2 p-3 bg-brand-darker rounded-md text-brand-text font-mono text-sm">
                                {question}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                     <div>
                        <label htmlFor="clarification-input" className="block text-sm font-medium text-brand-subtle">
                            Your Clarification
                        </label>
                        <textarea
                            id="clarification-input"
                            rows={3}
                            value={clarification}
                            onChange={(e) => setClarification(e.target.value)}
                            placeholder="Provide more details here..."
                            className="mt-1 w-full p-3 bg-brand-darker border border-brand-dark rounded-lg shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text placeholder-gray-500"
                        />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                        <button
                            type="submit"
                            disabled={!clarification.trim()}
                            className="inline-flex w-full justify-center rounded-md bg-brand-accent px-3 py-2 text-sm font-semibold text-brand-dark shadow-sm hover:bg-blue-400 sm:w-auto disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
                        >
                            Submit Clarification
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-brand-dark px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-brand-subtle/50 hover:bg-brand-darker sm:mt-0 sm:w-auto"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};