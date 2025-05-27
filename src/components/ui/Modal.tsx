import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  closeOnClickOutside?: boolean;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  closeOnClickOutside = true,
  footer,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 transition-opacity ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={closeOnClickOutside ? handleClose : undefined}
    >
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={twMerge(
            `w-full transform rounded-lg bg-white text-left align-middle shadow-xl transition-all ${
              sizeClasses[size]
            } ${isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`,
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between border-b border-ajinomoto-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-ajinomoto-gray-900">{title}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="p-1 text-ajinomoto-gray-500 hover:text-ajinomoto-gray-700"
              >
                <X size={18} />
              </Button>
            </div>
          )}

          <div className="px-6 py-4">{children}</div>

          {footer && <div className="border-t border-ajinomoto-gray-200 px-6 py-4">{footer}</div>}
        </div>
      </div>
    </div>
  );
};