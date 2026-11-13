import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none rounded-xl active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gradient-to-br from-primary-700 to-secondary-600 text-white shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 hover:brightness-[1.04] border border-white/10',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-dark-card dark:hover:bg-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow',
    outline:
      'border border-primary-500/30 text-primary-600 dark:text-primary-400 hover:bg-primary-500/10 dark:hover:bg-primary-500/15',
    ghost:
      'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80',
    danger:
      'bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/25',
    glass:
      'glass-panel text-slate-800 dark:text-white hover:border-primary-500/40 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  return (
    <motion.button
      whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {LeftIcon && <LeftIcon className={cn('w-4 h-4 shrink-0', size === 'lg' ? 'w-5 h-5' : '')} />}
          <span>{children}</span>
          {RightIcon && <RightIcon className={cn('w-4 h-4 shrink-0', size === 'lg' ? 'w-5 h-5' : '')} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
