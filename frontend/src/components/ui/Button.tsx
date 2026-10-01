import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className,
  ...props
}) => {
  const baseStyle =
    'inline-flex items-center justify-center font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm focus:ring-indigo-500 border border-transparent',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 border border-slate-200/80',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-indigo-500 shadow-sm',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[36px]',
    md: 'px-4 py-2 text-sm rounded-xl gap-2 min-h-[42px]',
    lg: 'px-5 py-2.5 text-base rounded-2xl gap-2.5 min-h-[48px]',
  };

  return (
    <button
      className={clsx(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  );
};
