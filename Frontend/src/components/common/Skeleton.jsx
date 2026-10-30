import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-slate-200 dark:bg-slate-800/80 rounded-xl',
            className
          )}
        />
      ))}
    </>
  );
};

export default Skeleton;

