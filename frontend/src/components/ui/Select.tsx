import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  id,
  required,
  className = '',
  ...props
}) => {
  const selectId = id || (label ? `select-${label}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-[#1F2429] mb-1.5">
          {label} {required && <span className="text-[#8B1E2D]">*</span>}
        </label>
      )}
      <select
        id={selectId}
        required={required}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white text-[#1F2429] outline-none transition-all ${
          error
            ? 'border-red-500 ring-2 ring-red-200'
            : 'border-slate-200 focus:ring-2 focus:ring-[#8B1E2D]/15'
        } ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
