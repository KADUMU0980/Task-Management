'use client';
import { usePathname } from 'next/navigation';
import { Menu, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard',    sub: "Here's your productivity overview" },
  '/tasks':     { title: 'My Tasks',     sub: 'Manage and track all your tasks'   },
  '/kanban':    { title: 'Kanban Board', sub: 'Drag & drop to change task status' },
  '/analytics': { title: 'Analytics',    sub: 'Insights into your productivity'   },
  '/profile':   { title: 'Profile',      sub: 'Manage your account settings'      },
};

export default function Navbar({ setMobileOpen }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const page = pageTitles[pathname] || { title: 'TaskFlow', sub: '' };

  const now = new Date();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-5 md:px-6 py-3 sm:py-3.5 border-b tf-glass tf-border gap-3">

      {/* Left — hamburger + title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border tf-border tf-text-2 hover:text-white transition-all flex-shrink-0"
          style={{ background: 'var(--bg-hover)' }}
          aria-label="Open navigation"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base md:text-lg font-bold tf-text-1 leading-none truncate">
            {page.title}
          </h2>
          <p className="text-[11px] sm:text-xs tf-text-3 mt-0.5 hidden sm:block truncate">{page.sub}</p>
        </div>
      </div>

      {/* Right — theme toggle (always) + datetime (md+) */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Theme toggle — visible on all sizes on mobile (where date is hidden) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl border tf-border tf-text-2 hover:text-white transition-all"
          style={{ background: 'var(--bg-hover)' }}
        >
          {isDark
            ? <Sun  className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-violet-400" />}
        </button>

        {/* Datetime — hidden on mobile, visible on md+ */}
        <div className="hidden md:flex flex-col items-end">
          <p className="text-sm font-semibold tf-text-1">
            {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-xs tf-text-3">
            {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </header>
  );
}
