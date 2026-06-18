'use client';
import { useState, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Sun, Moon, Calendar } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const pageTitles = {
  '/dashboard': { title: 'Dashboard',    sub: "Here's your productivity overview" },
  '/tasks':     { title: 'My Tasks',     sub: 'Manage and track all your tasks'   },
  '/kanban':    { title: 'Kanban Board', sub: 'Drag & drop to change task status' },
  '/analytics': { title: 'Analytics',    sub: 'Insights into your productivity'   },
  '/profile':   { title: 'Profile',      sub: 'Manage your account settings'      },
};

function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

const Navbar = memo(function Navbar({ setMobileOpen }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const page = pageTitles[pathname] || { title: 'TaskFlow', sub: '' };
  const now = useLiveClock();

  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-3 sm:px-5 md:px-6 py-3 sm:py-3.5 border-b tf-glass tf-border gap-3">

      {/* Left — hamburger + title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Mobile menu button — hidden on lg (bottom nav takes over) */}
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

      {/* Right — datetime (live!) + theme toggle */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {/* Theme toggle (mobile only — desktop uses sidebar) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl border tf-border tf-text-2 hover:text-white transition-all"
          style={{ background: 'var(--bg-hover)' }}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark
            ? <Sun  className="w-4 h-4 text-amber-400" />
            : <Moon className="w-4 h-4 text-violet-400" />}
        </button>

        {/* Abbreviated date on sm (no time), full datetime on md+ */}
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 tf-text-3 hidden md:block" />
            <p className="text-xs sm:text-sm font-semibold tf-text-1 tabular-nums">
              {dateStr}
            </p>
          </div>
          <p className="text-[11px] sm:text-xs tf-text-3 tabular-nums mt-0.5 hidden md:block">
            {timeStr}
          </p>
        </div>
      </div>
    </header>
  );
});

export default Navbar;
