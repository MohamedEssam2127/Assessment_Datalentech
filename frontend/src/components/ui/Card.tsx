import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div
    className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs ${className}`}
    {...props}
  >
    {children}
  </div>
);
