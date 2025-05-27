import React from 'react';
import { twMerge } from 'tailwind-merge';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  changeText?: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  change,
  changeText,
  className,
}) => {
  const changeColor = change && change > 0 ? 'text-success' : 'text-error';
  const ChangeIcon = change && change > 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <div className={twMerge('bg-white rounded-lg shadow-sm p-5 border border-ajinomoto-gray-200', className)}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-ajinomoto-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-ajinomoto-gray-900">{value}</p>
        </div>
        {icon && <div className="text-ajinomoto-gray-400">{icon}</div>}
      </div>
      
      {(change !== undefined || changeText) && (
        <div className="mt-3 flex items-center text-sm">
          {change !== undefined && (
            <>
              <span className={`${changeColor} flex items-center`}>
                <ChangeIcon size={16} className="mr-1" />
                {Math.abs(change)}%
              </span>
            </>
          )}
          
          {changeText && (
            <span className="text-ajinomoto-gray-500 ml-2">{changeText}</span>
          )}
        </div>
      )}
    </div>
  );
};