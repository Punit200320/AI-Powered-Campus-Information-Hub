import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  ChevronDown,
  User,
  Shield,
  GraduationCap,
  LogOut,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThemeToggle } from '../common/ThemeToggle';
import { Badge } from '../common/Badge';
import { MOCK_NOTICES } from '../../data/mockData';

export const Navbar = ({ onOpenCommand, onToggleSidebar }) => {
  const { user, switchRole, logout, isSuperAdmin } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleRoleChange = (role) => {
    switchRole(role);
    setShowRoleMenu(false);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-200/80 dark:border-white/10 px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 via-secondary-500 to-electric-cyan flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                  Campus<span className="text-primary-500">AI</span>
                </span>
                <Badge variant="indigo" size="sm" className="hidden sm:inline-flex">
                  v2.4
                </Badge>
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 hidden sm:block">
                Assistant
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenCommand}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl glass-input text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-primary-500/50 transition-all text-xs shadow-sm group"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors" />
              <span>Search notes, questions, syllabus, policies...</span>
            </div>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded border border-slate-300/50 dark:border-white/10">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Indicator / Switcher:
              - Admin has access to both modes (Student Mode & Admin Mode switcher)
              - Normal User only has Student Mode (static badge, no switcher) */}
          {isSuperAdmin ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-primary-500/30 bg-primary-500/10 text-primary-600 dark:text-primary-300 hover:bg-primary-500/20 text-xs font-semibold transition-colors"
                title="Switch between Admin & Student mode"
              >
                {user?.role === 'admin' ? (
                  <Shield className="w-3.5 h-3.5 text-primary-500" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-primary-500" />
                )}
                <span className="capitalize">{user?.role === 'admin' ? 'Admin Mode' : 'Student Mode'}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              <AnimatePresence>
                {showRoleMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-52 glass-card rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-1.5 z-40 text-xs"
                  >
                    <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/5 mb-1">
                      Admin Mode Switcher
                    </div>
                    <button
                      onClick={() => handleRoleChange('student')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                        user?.role !== 'admin'
                          ? 'bg-primary-500 text-white font-medium'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <div>
                        <div className="font-semibold">Student Mode</div>
                        <div className="text-[10px] opacity-80">Preview student workspace</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleChange('admin')}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors ${
                        user?.role === 'admin'
                          ? 'bg-primary-600 text-white font-medium'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      <div>
                        <div className="font-semibold">Admin Mode</div>
                        <div className="text-[10px] opacity-80">Campus controller workspace</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary-500/20 bg-primary-500/5 text-primary-600 dark:text-primary-300 text-xs font-semibold select-none">
              <GraduationCap className="w-3.5 h-3.5 text-primary-500" />
              <span>Student / User</span>
            </div>
          )}

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotices(!showNotices)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors border border-slate-200 dark:border-white/10"
              aria-label="Campus announcements"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </button>

            <AnimatePresence>
              {showNotices && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 p-3 z-40"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 px-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      Campus Announcements
                    </span>
                    <Badge variant="rose" size="sm">
                      4 New
                    </Badge>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 py-1">
                    {MOCK_NOTICES.map((n) => (
                      <div key={n.id} className="p-2.5 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">{n.date}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {n.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-white/10 hover:border-primary-500/50 transition-colors"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-500/20"
              />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-60 glass-card rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-2 z-40 text-xs"
                >
                  <div className="p-3 border-b border-slate-100 dark:border-white/10">
                    <p className="font-bold text-slate-900 dark:text-white text-sm">
                      {user?.name || 'Demo Student'}
                    </p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <Badge variant="indigo" size="sm">
                        {user?.department || 'Computer Science'}
                      </Badge>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/landing"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                      <span>Explore Landing Page</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
