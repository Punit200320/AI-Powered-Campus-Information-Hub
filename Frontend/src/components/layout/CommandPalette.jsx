import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  HelpCircle,
  Calendar,
  Bookmark,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const ACTIONS = [
  { id: 'chat', title: 'Ask Campus AI Chatbot', subtitle: 'Instant answers with source citations', path: '/chat', icon: MessageSquare, category: 'AI Tools' },
  { id: 'resources', title: 'Search Lecture Notes & PYQs', subtitle: 'Browse verified study materials', path: '/resources', icon: BookOpen, category: 'Resources' },
  { id: 'summarize', title: 'Summarize Syllabus & Guidelines', subtitle: 'PDF instant analysis and deadlines', path: '/summarize', icon: FileText, category: 'AI Tools' },
  { id: 'quiz', title: 'Generate Practice MCQs', subtitle: 'Test knowledge with instant explanations', path: '/quiz', icon: HelpCircle, category: 'Practice' },
  { id: 'planner', title: 'Personalized Study Planner', subtitle: 'Daily timetable and exam roadmap', path: '/planner', icon: Calendar, category: 'Planning' },
  { id: 'saved', title: 'Saved & Bookmarked Resources', subtitle: 'Your starred study library', path: '/saved', icon: Bookmark, category: 'Resources' },
  { id: 'admin', title: 'Admin & Faculty Analytics', subtitle: 'Vector metrics and document approval', path: '/admin', icon: Shield, category: 'Management' },
];

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const filteredActions = ACTIONS.filter(
    (action) =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      action.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredActions.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredActions.length || 1)) % (filteredActions.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredActions[selectedIndex]) {
          navigate(filteredActions[selectedIndex].path);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredActions, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-xl glass-card rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-white/10">
              <Search className="w-5 h-5 text-primary-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, page name, or search topic..."
                autoFocus
                className="w-full bg-transparent text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none text-sm"
              />
              <span className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                ESC
              </span>
            </div>

            {/* Action items list */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No matching tools or pages found for "{query}"
                </div>
              ) : (
                filteredActions.map((action, idx) => {
                  const Icon = action.icon;
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={action.id}
                      onClick={() => {
                        navigate(action.path);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-primary-500/15 text-primary-600 dark:text-primary-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? 'bg-primary-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-sm flex items-center gap-2">
                            <span>{action.title}</span>
                            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-400 font-semibold">
                              {action.category}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {action.subtitle}
                          </div>
                        </div>
                      </div>
                      <ArrowRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'translate-x-0.5 text-primary-500 opacity-100' : 'opacity-0'
                        }`}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Keyboard hints footer */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200 dark:border-white/10 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                Press <kbd className="px-1 bg-slate-200 dark:bg-slate-800 rounded">↵</kbd> to select
              </span>
              <span className="flex items-center gap-2">
                <span>Navigate with <kbd className="px-1 bg-slate-200 dark:bg-slate-800 rounded">↑</kbd><kbd className="px-1 bg-slate-200 dark:bg-slate-800 rounded">↓</kbd></span>
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

