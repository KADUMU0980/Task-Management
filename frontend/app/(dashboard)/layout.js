'use client';
import { useState, useEffect, memo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar, { navItems } from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import KeyboardShortcuts from '@/components/layout/KeyboardShortcuts';

/* ── Mobile Bottom Navigation ── */
const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="bottom-nav lg:hidden" aria-label="Mobile navigation">
      {navItems.map(item => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item${active ? ' active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <item.icon className={`w-5 h-5 ${active ? 'text-violet-400' : ''}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
});

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center tf-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-[3px] border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
        <p className="tf-text-3 text-sm">Loading TaskFlow…</p>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden tf-base">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto dashboard-main">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-7 animate-fade-up">
            {children}
          </div>
        </main>
      </div>
      {/* Mobile bottom navigation */}
      <BottomNav />
      <KeyboardShortcuts />
    </div>
  );
}
