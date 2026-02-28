import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  className = '',
  containerClassName = '',
}) => {
  const overlayRef = useRef(null);
  const portalRoot = document.getElementById('modal-root');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !portalRoot) return null;

  const sizes = {
    sm: 'max-w-lg',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-full mx-4',
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] overflow-y-auto flex items-center justify-center p-4">
      {/* Absolute backdrop for click detection */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        onPointerDown={(e) => {
          if (e.target === overlayRef.current) {
            e.currentTarget._tracking = true;
          }
        }}
        onPointerUp={(e) => {
          if (e.target === overlayRef.current && e.currentTarget._tracking) {
            delete e.currentTarget._tracking;
            onClose();
          }
        }}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative bg-white rounded-[32px] text-left overflow-hidden shadow-2xl transform transition-all border border-white/20 ${sizes[size]} w-full flex flex-col max-h-[90vh] z-10 ${containerClassName}`}
        // Stop EVERY possible event from bubbling to the backdrop
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 -mr-2"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        <div
          className="px-6 py-4 overflow-y-auto modal-scrollable flex-1"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {children}
        </div>
        <style>{`
          .modal-scrollable::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );

  return createPortal(modalContent, portalRoot);
};

