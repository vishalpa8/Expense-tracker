import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { INPUT_CLASS } from '../utils/styles';

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
}

const ConfirmModal: React.FC<Props> = ({ title, message, onConfirm, onCancel, confirmText }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [typed, setTyped] = useState('');
  const confirmed = !confirmText || typed === confirmText;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onCancel();
  }, [onCancel]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus();
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = ''; };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="text-red-600" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        {confirmText && (
          <div className="mb-6">
            <p className="text-sm text-gray-700 mb-2">Type <span className="font-bold text-red-600">{confirmText}</span> to confirm:</p>
            <input type="text" value={typed} onChange={(e) => setTyped(e.target.value)}
              className={INPUT_CLASS} placeholder={confirmText} autoFocus />
          </div>
        )}
        <div className="flex gap-3">
          <button onClick={onConfirm} disabled={!confirmed}
            className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 font-semibold focus:ring-2 focus:ring-red-300 outline-none disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600">Delete</button>
          <button ref={cancelRef} onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold focus:ring-2 focus:ring-gray-300 outline-none">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
