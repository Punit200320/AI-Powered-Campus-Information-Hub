import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  MessageSquare,
  Search,
  FileText,
  HelpCircle,
  Calendar,
  Bookmark,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Settings,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Tooltip } from '../common/Tooltip';
import { Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Campus Chat', path: '/chat', icon: MessageSquare, badge: 'AI' },
  { name: 'Smart Resource Finder', path: '/resources', icon: Search },
  { name: 'Document Summarizer', path: '/summarize', icon: FileText, badge: 'New' },
  { name: 'Question Generator', path: '/quiz', icon: HelpCircle },
  { name: 'Study Planner', path: '/planner', icon: Calendar },
  { name: 'Saved Resources', path: '/saved', icon: Bookmark },
  { name: 'Admin Analytics', path: '/admin', icon: ShieldCheck, role: 'admin' },
];

export const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
  const location = useLocation();
  const { user } = useAuth();

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Top Brand & Nav Section */}
      <div>
        {/* Toggle Collapse button on desktop */}
        <div className="hidden lg:flex items-center justify-between p-3.5 mb-2 border-b border-slate-200/60 dark:border-white/5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-bold text-sm text-slate-800 dark:text-white truncate"
              >
                Campus Workspace
              </motion.span>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation items list */}
        <nav className="space-y-1 px-2.5 pt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            const linkElement = (
              <NavLink
                to={item.path}
                onClick={onCloseMobile}
                className={cn(
                  'relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group',
                  isActive
                    ? 'text-primary-600 dark:text-primary-300 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                )}
              >
                {/* Active Indicator with smooth LayoutId animation */}
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarPill"
                    className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/20 border border-primary-500/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors z-10',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                  )}
                />

                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className="flex-1 flex items-center justify-between z-10 overflow-hidden"
                  >
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badge === 'AI' ? 'indigo' : 'cyan'}
                        size="sm"
                        className="ml-2 px-1.5 py-0 text-[10px]"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </motion.div>
                )}
              </NavLink>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.path} content={item.name} position="right">
                  {linkElement}
                </Tooltip>
              );
            }

            return <div key={item.path}>{linkElement}</div>;
          })}
        </nav>
      </div>

      {/* Bottom User status / Pro card */}
      <div className="p-3 border-t border-slate-200/60 dark:border-white/5 space-y-2">
        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/10 via-secondary-500/10 to-transparent border border-primary-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                AI Engine Online
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Qdrant Vector DB & Gemini RAG ready
            </p>
          </div>
        )}

        <NavLink
          to="/landing"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors',
            isCollapsed && 'justify-center'
          )}
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Public Landing Page</span>}
        </NavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed top-16 bottom-0 left-0 z-20 glass-panel border-r border-slate-200/80 dark:border-white/10 transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-72 max-w-[80vw] h-full glass-card p-4 shadow-2xl border-r border-white/20 dark:border-white/10 z-10"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;

