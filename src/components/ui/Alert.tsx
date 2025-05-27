import React from 'react';
import { twMerge } from 'tailwind-merge';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: AlertVariant;
  className?: string;
  icon?: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'info',
  className,
  icon,
  onClose,
}) => {
  const variantClasses = {
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    error: 'bg-red-50 text-red-800 border-red-200',
  };

  const variantIcon = {
    info: <Info size={20} className="text-blue-500" />,
    success: <CheckCircle size={20} className="text-green-500" />,
    warning: <AlertCircle size={20} className="text-yellow-500" />,
    error: <XCircle size={20} className="text-red-500" />,
  };

  return (
    <div
      className={twMerge(
        'rounded-md border p-4',
        variantClasses[variant],
        className
      )}
    >
      <div className="flex">
        {icon || variantIcon[variant] ? (
          <div className="flex-shrink-0 mr-3">
            {icon || variantIcon[variant]}
          </div>
        ) : null}
        
        <div className="flex-1">
          {title && (
            <h3 className={`text-sm font-medium mb-1`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${title ? 'opacity-90' : ''}`}>{children}</div>
        </div>
        
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                variant === 'info' ? 'focus:ring-blue-500' : 
                variant === 'success' ? 'focus:ring-green-500' : 
                variant === 'warning' ? 'focus:ring-yellow-500' : 
                'focus:ring-red-500'
              }`}
            >
              <XCircle size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};