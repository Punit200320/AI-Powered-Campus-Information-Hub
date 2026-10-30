import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      className = '',
      wrapperClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={cn('w-full flex flex-col gap-1.5', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {LeftIcon && (
            <div className="absolute left-3.5 pointer-events-none text-slate-400">
              <LeftIcon className="w-4 h-4" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full glass-input rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200',
              LeftIcon && 'pl-10',
              RightIcon && 'pr-10',
              error && 'border-rose-500 focus:ring-rose-500/40 focus:border-rose-500',
              className
            )}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className={cn(
                'absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors',
                !onRightIconClick && 'pointer-events-none'
              )}
            >
              <RightIcon className="w-4 h-4" />
            </button>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-500 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;

