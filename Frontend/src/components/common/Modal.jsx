import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalBackdrop, modalContent } from '../../utils/animations';
import { cn } from '../../utils/cn';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
          />

          {/* Dialog Container */}
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative w-full z-10 glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 dark:border-white/10 my-8 overflow-hidden',
              maxWidth
            )}
          >
            {/* Header */}
            {(title || showClose) && (
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
                <div>
                  {title && (
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

