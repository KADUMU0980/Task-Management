'use client';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';

const pageTitles = {
  '/dashboard': { title: 'Dashboard',    sub: "Here's your productivity overview" },
  '/tasks':     { title: 'My Tasks',     sub: 'Manage and track all your tasks'  },
  '/kanban':    { title: 'Kanban Board', sub: 'Drag & drop to change task status' },
  '/analytics': { title: 'Analytics',    sub: 'Insights into your productivity'  },
  '/profile':   { title: 'Profile',      sub: 'Manage your account settings'     },
};

export default function Navbar({ setMobileOpen }) {
  const pathname = usePathname();
  const page = pageTitles[pathname] || { title: 'TaskFlow', sub: '' };

  const now = new Date();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3.5 border-b tf-glass tf-border">

      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu */}
        <button onClick={() => setMobileOpen(true)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border tf-border tf-text-2 hover:text-white transition-all flex-shrink-0"
          style={{ background: 'var(--bg-hover)' }}>
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold tf-text-1 leading-none truncate">{page.title}</h2>
          <p className="text-xs tf-text-3 mt-0.5 hidden sm:block truncate">{page.sub}</p>
        </div>
      </div>

      {/* Right — datetime */}
      <div className="hidden sm:flex flex-col items-end flex-shrink-0">
        <p className="text-sm font-semibold tf-text-1">
          {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </p>
        <p className="text-xs tf-text-3">
          {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </header>
  );
}
