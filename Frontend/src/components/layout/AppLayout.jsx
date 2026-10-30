import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { CommandPalette } from './CommandPalette';
import { Footer } from './Footer';
import { cn } from '../../utils/cn';

export const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-100 transition-colors relative">
      {/* Dynamic ambient glowing mesh in background */}
      <div className="ambient-glow" aria-hidden="true" />

      {/* Top Navbar */}
      <Navbar
        onOpenCommand={() => setIsCommandOpen(true)}
        onToggleSidebar={() => setIsMobileOpen(true)}
      />

      {/* Main Body with Sidebar + Viewport Content */}
      <div className="flex-1 flex w-full relative z-10">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
          isMobileOpen={isMobileOpen}
          onCloseMobile={() => setIsMobileOpen(false)}
        />

        {/* Content Area */}
        <main
          className={cn(
            'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
            isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
          )}
        >
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* Spotlight Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </div>
  );
};

export default AppLayout;

