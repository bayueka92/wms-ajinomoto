import React from 'react';
import Select, { Props as ReactSelectProps } from 'react-select';

interface SelectProps extends Omit<ReactSelectProps, 'classNames'> {
  label?: string;
  error?: string;
}

export const CustomSelect: React.FC<SelectProps> = ({ label, error, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ajinomoto-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <Select
        {...props}
        classNames={{
          control: (state) =>
            `rounded-md border ${
              error
                ? 'border-error'
                : state.isFocused
                ? 'border-ajinomoto-red'
                : 'border-ajinomoto-gray-300'
            } shadow-sm hover:border-ajinomoto-red`,
          menu: () => 'bg-white mt-1 shadow-lg rounded-md border border-ajinomoto-gray-200',
          option: (state) =>
            `px-3 py-2 ${
              state.isSelected
                ? 'bg-ajinomoto-red text-white'
                : state.isFocused
                ? 'bg-ajinomoto-gray-100'
                : ''
            }`,
        }}
      />
      
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
};