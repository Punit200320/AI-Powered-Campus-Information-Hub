import React from 'react';
import { Sparkles, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-white/5 py-6 px-4 sm:px-6 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            CampusAI Assistant Platform
          </span>
          <span>•</span>
          <span>Powered by Gemini & Qdrant RAG</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            All Academic Systems Operational
          </span>
          <span>•</span>
          <span>Privacy & Academic Integrity</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

