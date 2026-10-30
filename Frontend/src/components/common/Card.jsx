import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glow = false,
  onClick,
  ...props
}) => {
  const Component = hoverEffect || onClick ? motion.div : 'div';

  const motionProps =
    hoverEffect || onClick
      ? {
          whileHover: { y: -4, transition: { duration: 0.2, ease: 'easeOut' } },
          transition: { type: 'spring', stiffness: 350, damping: 25 },
        }
      : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl p-5 relative overflow-hidden transition-colors duration-200',
        glow && 'hover:border-primary-500/40 hover:shadow-glow-sm',
        onClick && 'cursor-pointer select-none',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;

