import React, { useEffect, useRef, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}

const ModalWrapper: React.FC<Props> = ({ children, onClose, wide }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    // Auto-focus first input
    const timer = setTimeout(() => {
      const input = contentRef.current?.querySelector<HTMLElement>('input, select, textarea');
      input?.focus();
    }, 50);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4" onClick={handleBackdropClick}>
      <div ref={contentRef} className={`bg-white rounded-3xl p-8 w-full ${wide ? 'max-w-2xl' : 'max-w-md'} my-8 shadow-2xl border border-gray-100`}>
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
