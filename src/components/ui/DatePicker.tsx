import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { twMerge } from 'tailwind-merge';

interface CustomDatePickerProps {
  label?: string;
  error?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholder?: string;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  error,
  value,
  onChange,
  className,
  placeholder = "Select date",
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ajinomoto-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <DatePicker
        selected={value}
        onChange={onChange}
        className={twMerge(
          "w-full rounded-md border shadow-sm focus:ring-ajinomoto-red focus:border-ajinomoto-red sm:text-sm",
          error ? "border-error" : "border-ajinomoto-gray-300",
          className
        )}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
      />
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};