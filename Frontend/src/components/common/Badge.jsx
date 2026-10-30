import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  children,
  variant = 'indigo',
  size = 'md',
  dot = false,
  className = '',
  icon: Icon,
}) => {
  const variants = {
    indigo: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/20',
    violet: 'bg-secondary-500/10 text-secondary-600 dark:text-secondary-400 border-secondary-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  };

  const dotColors = {
    indigo: 'bg-primary-500',
    violet: 'bg-secondary-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    neutral: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide select-none',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;

