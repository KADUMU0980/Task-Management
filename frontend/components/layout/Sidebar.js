'use client';
import { useState, useEffect, memo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { taskApi } from '@/lib/api';
import {
  LayoutDashboard, CheckSquare, Kanban, BarChart3,
  User, LogOut, Sun, Moon, Zap,
  ChevronLeft, ChevronRight, X, AlertTriangle
} from 'lucide-react';

export const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks',     icon: CheckSquare,    label: 'My Tasks'  },
  { href: '/kanban',    icon: Kanban,         label: 'Kanban'    },
  { href: '/analytics', icon: BarChart3,      label: 'Analytics' },
  { href: '/profile',   icon: User,           label: 'Profile'   },
];

const NavLink = memo(function NavLink({ item, collapsed, onClose, badge }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link href={item.href} onClick={onClose}
      className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-[0_0_20px_rgba(124,58,237,0.15)]'
          : 'tf-text-2 hover:text-slate-200 hover:bg-[var(--bg-hover)]'}`}>
      <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? 'text-violet-400' : 'tf-text-3 group-hover:text-slate-300'}`} />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {!collapsed && badge > 0 && (
        <span className="ml-auto w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 animate-pulse-glow">
          {badge}
        </span>
      )}
      {active && !collapsed && !badge && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />}
      {/* Tooltip when collapsed */}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 px-3 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity tf-card"
          style={{ border: '1px solid var(--border-hover)', boxShadow: '0 8px 24px var(--shadow-color)' }}
          role="tooltip">
          {item.label}
          {badge > 0 && <span className="ml-2 text-rose-400">({badge})</span>}
        </div>
      )}
    </Link>
  );
});

const SidebarContent = memo(function SidebarContent({ collapsed, onClose, urgentCount, user, logout, isDark, toggleTheme }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b tf-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-violet-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <span className="tf-text-1 font-bold text-lg leading-none">TaskFlow</span>
            <p className="text-violet-400/70 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Pro</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold tf-text-3 uppercase tracking-widest">Navigation</p>
        )}
        {navItems.map(item => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onClose={onClose}
            badge={item.href === '/tasks' ? urgentCount : 0} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t tf-border space-y-1">
        {/* Dark Mode Toggle */}
        <button onClick={toggleTheme}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium tf-text-2 hover:text-slate-200 hover:bg-[var(--bg-hover)] transition-all ${collapsed ? 'justify-center' : ''}`}>
          {isDark
            ? <Sun className="w-[18px] h-[18px] flex-shrink-0 text-amber-400" />
            : <Moon className="w-[18px] h-[18px] flex-shrink-0 text-violet-400" />}
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* User Card */}
        {!collapsed ? (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-500/[0.08] border border-violet-500/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="tf-text-1 text-sm font-semibold truncate leading-none">{user?.name}</p>
              <p className="tf-text-3 text-xs truncate mt-0.5">{user?.email}</p>
            </div>
            <button onClick={logout} title="Logout"
              className="tf-text-3 hover:text-rose-400 transition-colors flex-shrink-0 p-1"
              aria-label="Logout">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={logout}
            className="flex items-center justify-center w-full px-3 py-2.5 rounded-xl tf-text-3 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            aria-label="Logout">
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </div>
  );
});

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [urgentCount, setUrgentCount] = useState(0);

  const fetchUrgent = useCallback(async () => {
    try {
      const res = await taskApi.getAll({ limit: 200 });
      const tasks = res.data.data || [];
      const now = new Date();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      const count = tasks.filter(t => {
        if (t.status === 'completed' || !t.dueDate) return false;
        return new Date(t.dueDate) <= todayEnd;
      }).length;
      setUrgentCount(count);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchUrgent();
    const interval = setInterval(fetchUrgent, 60_000);
    return () => clearInterval(interval);
  }, [fetchUrgent]);

  const sharedProps = { collapsed, urgentCount, user, logout, isDark, toggleTheme };

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col relative flex-shrink-0 tf-surface border-r tf-border
          transition-[width] duration-300 ease-in-out
          ${collapsed ? 'w-[68px]' : 'w-64'}`}
      >
        <SidebarContent {...sharedProps} onClose={() => {}} />
        {/* Collapse toggle */}
        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-7 w-6 h-6 rounded-full flex items-center justify-center
            tf-card border tf-border-hover tf-text-2 hover:text-violet-300
            hover:border-violet-500/60 transition-all z-10"
          style={{ boxShadow: '0 2px 8px var(--shadow-color)' }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 tf-overlay" onClick={() => setMobileOpen(false)} />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 flex flex-col animate-slide-in shadow-2xl tf-surface border-r tf-border">
            {/* Close btn */}
            <button onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg tf-text-2 hover:text-white hover:bg-[var(--bg-hover)] transition-all z-10"
              aria-label="Close navigation">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent {...sharedProps} collapsed={false} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
