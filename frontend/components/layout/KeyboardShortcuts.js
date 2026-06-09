'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { key: 'N', desc: 'Create new task', scope: 'Tasks page' },
  { key: '/', desc: 'Focus quick-add bar', scope: 'Tasks page' },
  { key: 'Esc', desc: 'Close modal / Exit bulk mode', scope: 'Global' },
  { key: 'K', desc: 'Go to Kanban board', scope: 'Global' },
  { key: 'D', desc: 'Go to Dashboard', scope: 'Global' },
  { key: 'T', desc: 'Go to Tasks', scope: 'Global' },
  { key: '?', desc: 'Toggle keyboard shortcuts help', scope: 'Global' },
];

export default function KeyboardShortcuts() {
  const [show, setShow] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handler = (e) => {
      // Don't trigger in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

      if (e.key === '?') { e.preventDefault(); setShow(p => !p); return; }
      if (e.key === 'Escape') { setShow(false); return; }

      // Global navigation shortcuts
      if (e.key === 'k' || e.key === 'K') { e.preventDefault(); router.push('/kanban'); }
      if (e.key === 'd' || e.key === 'D') { e.preventDefault(); router.push('/dashboard'); }
      if (e.key === 't' || e.key === 'T') {
        // Only navigate if not on tasks page (otherwise it's handled locally)
        if (pathname !== '/tasks') { e.preventDefault(); router.push('/tasks'); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router, pathname]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 tf-overlay"
      onClick={e => e.target === e.currentTarget && setShow(false)}>
      <div className="w-full max-w-sm rounded-2xl border tf-border tf-card shadow-2xl animate-scale-in overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b tf-border">
          <div className="flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-violet-400" />
            <h3 className="tf-text-1 font-bold text-sm">Keyboard Shortcuts</h3>
          </div>
          <button onClick={() => setShow(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg tf-text-3 hover:tf-text-1 hover:bg-[var(--bg-hover)] transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {SHORTCUTS.map(s => (
            <div key={s.key} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-[var(--bg-hover)] transition-all">
              <div>
                <p className="tf-text-1 text-sm font-medium">{s.desc}</p>
                <p className="tf-text-3 text-[11px]">{s.scope}</p>
              </div>
              <span className="kbd">{s.key}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t tf-border">
          <p className="tf-text-3 text-[11px] text-center">Press <span className="kbd">?</span> to toggle this panel</p>
        </div>
      </div>
    </div>
  );
}
