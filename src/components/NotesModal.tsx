import React from 'react';
import { IconNotebook, IconX } from '@/components/IconComponents';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
    notes: string;
    onNotesChange: (notes: string) => void;
}

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, notes, onNotesChange }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <>
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-brand-darker bg-opacity-80 z-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div 
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="notes-modal-title"
            >
                <div className="relative bg-brand-dark rounded-xl shadow-2xl w-full max-w-2xl p-6 border border-brand-accent/30 flex flex-col" style={{height: '70vh'}}>
                    <div className="flex items-center justify-between pb-4 border-b border-brand-darker">
                        <div className="flex items-center space-x-3">
                            <IconNotebook className="w-6 h-6 text-brand-accent" />
                            <h2 id="notes-modal-title" className="text-xl font-bold text-white">My Notes</h2>
                        </div>
                        <button
                          onClick={onClose}
                          className="p-1.5 rounded-md text-brand-subtle hover:bg-brand-darker hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                          aria-label="Close notes"
                        >
                          <IconX className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex-1 mt-4">
                        <textarea
                            value={notes}
                            onChange={(e) => onNotesChange(e.target.value)}
                            placeholder="Jot down your thoughts, prompt ideas, or anything else here. Your notes are saved automatically..."
                            className="w-full h-full p-3 bg-brand-darker border border-brand-dark rounded-lg shadow-sm focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition duration-150 ease-in-out text-brand-text placeholder-gray-500 resize-none"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};
