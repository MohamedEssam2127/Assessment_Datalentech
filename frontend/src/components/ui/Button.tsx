import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl px-4 py-2.5 text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';
  const style = variant === 'secondary'
    ? 'bg-slate-100 hover:bg-slate-200 text-[#1F2429]'
    : 'bg-[#8B1E2D] hover:bg-[#721724] text-white shadow-xs';

  return (
    <button
      className={`${base} ${style} ${className}`}
      // disabled={disabled || isLoading}
      {...props}
    >
      { children}
    </button>
  );
};
