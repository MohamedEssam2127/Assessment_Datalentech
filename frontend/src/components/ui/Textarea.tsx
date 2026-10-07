import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  id,
  required,
  className = '',
  rows = 3,
  ...props
}) => {
  const textareaId = id || (label ? `textarea-${label}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={textareaId} className="block text-xs font-semibold text-[#1F2429] mb-1.5">
          {label} {required && <span className="text-[#8B1E2D]">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        required={required}
        className={`w-full rounded-xl border px-3.5 py-2.5 text-sm bg-white text-[#1F2429] outline-none transition-all resize-y ${
          error
            ? 'border-red-500 ring-2 ring-red-200'
            : 'border-slate-200 focus:ring-2 focus:ring-[#8B1E2D]/15'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
