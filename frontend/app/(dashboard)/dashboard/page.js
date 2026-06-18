'use client';
import { useEffect, useState, useMemo } from 'react';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  CheckCircle2, Clock, ListTodo, TrendingUp,
  AlertTriangle, Calendar, Activity, ChevronRight, Zap
} from 'lucide-react';
import Link from 'next/link';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatCard from '@/components/ui/StatCard';
import PageHeader from '@/components/ui/PageHeader';

const ACTION_ICONS  = { task_created:'✨', task_completed:'✅', task_updated:'✏️', task_deleted:'🗑️', task_status_changed:'🔄', comment_added:'💬', user_login:'👋', profile_updated:'👤', password_changed:'🔒', task_priority_changed:'⚡' };
const ACTION_LABELS = { task_created:'Created task', task_completed:'Completed task', task_updated:'Updated task', task_deleted:'Deleted task', task_status_changed:'Changed status', comment_added:'Comment added', user_login:'Logged in', profile_updated:'Updated profile', password_changed:'Changed password', task_priority_changed:'Changed priority' };

function getDueLabel(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isPast(d) && !isToday(d)) return { l: 'Overdue',  c: 'text-rose-400'  };
  if (isToday(d))                return { l: 'Today',    c: 'text-amber-400' };
  if (isTomorrow(d))             return { l: 'Tomorrow', c: 'text-yellow-400'};
  return { l: format(d, 'MMM d'), c: 'tf-text-2' };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.dashboard()
      .then(r => setData(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = data?.stats || {};

  // ⚠️ useMemo must be called unconditionally — BEFORE any early returns
  const cards = useMemo(() => [
    { label: 'Total',       value: stats.total      || 0, icon: ListTodo,      grad: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'border-violet-500/30' },
    { label: 'Completed',   value: stats.completed  || 0, icon: CheckCircle2,  grad: 'linear-gradient(135deg,#059669,#0d9488)', border: 'border-emerald-500/30' },
    { label: 'In Progress', value: stats.inProgress || 0, icon: TrendingUp,    grad: 'linear-gradient(135deg,#0891b2,#0e7490)', border: 'border-cyan-500/30'    },
    { label: 'Overdue',     value: stats.overdue    || 0, icon: AlertTriangle, grad: 'linear-gradient(135deg,#e11d48,#be123c)', border: 'border-rose-500/30'    },
  ], [stats.total, stats.completed, stats.inProgress, stats.overdue]);

  if (loading) return <LoadingSpinner size="lg" className="h-64" />;

  const pct   = stats.completionRate || 0;
  const hour  = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* ── Hero Greeting ── */}
      <div
        className="rounded-2xl p-4 sm:p-5 md:p-6 border border-violet-500/15 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))' }}
      >
        {/* Avatar */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 shadow-violet-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tf-text-1 leading-tight">
            {greet}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="tf-text-2 text-xs sm:text-sm mt-0.5">
            {stats.completed > 0
              ? `You've completed ${stats.completed} task${stats.completed !== 1 ? 's' : ''}. Keep it up!`
              : 'Ready to be productive today?'}
          </p>
        </div>

        {/* Progress ring */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1 flex-shrink-0">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" aria-label={`${pct}% completion`}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3" strokeLinecap="round"
                stroke="url(#pg)" strokeDasharray={`${pct} 100`}/>
              <defs>
                <linearGradient id="pg" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%"   stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="tf-text-1 font-bold text-xs tabular-nums">{pct}%</span>
            </div>
          </div>
          <span className="tf-text-3 text-xs">Done</span>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 rounded-2xl border tf-border p-4 sm:p-5 tf-surface">
          <PageHeader
            icon={Calendar}
            title="Upcoming Tasks"
            className="mb-4"
            action={
              <Link href="/tasks" className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1 transition-colors font-medium">
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            }
          />
          {data?.upcomingTasks?.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingTasks.map(t => {
                const due = getDueLabel(t.dueDate);
                return (
                  <div
                    key={t._id}
                    className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl border tf-border hover:tf-border-hover transition-all"
                    style={{ background: 'var(--bg-hover)' }}
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-rose-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="tf-text-1 text-xs sm:text-sm font-medium truncate">{t.title}</p>
                      <p className="tf-text-3 text-[11px] capitalize">{t.category}</p>
                    </div>
                    {due && <span className={`text-[11px] sm:text-xs font-semibold flex-shrink-0 ${due.c}`}>{due.l}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 sm:py-10">
              <Zap className="w-7 h-7 sm:w-8 sm:h-8 tf-text-3 mx-auto mb-2" />
              <p className="tf-text-3 text-sm">No tasks due soon!</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border tf-border p-4 sm:p-5 tf-surface">
          <PageHeader icon={Activity} title="Recent Activity" className="mb-4" />
          {data?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {data.recentActivity.slice(0, 8).map(log => (
                <div key={log._id} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0">{ACTION_ICONS[log.action] || '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="tf-text-2 text-xs leading-snug">
                      <span className="font-medium">{ACTION_LABELS[log.action]}</span>
                      {log.taskTitle && <span className="tf-text-3"> · {log.taskTitle}</span>}
                    </p>
                    <p className="tf-text-3 text-[11px] mt-0.5">
                      {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="tf-text-3 text-sm text-center py-6">No activity yet.</p>
          )}
        </div>
      </div>

      {/* ── Category Breakdown ── */}
      {data?.categoryStats?.length > 0 && (
        <div className="rounded-2xl border tf-border p-4 sm:p-5 tf-surface">
          <h3 className="tf-text-1 font-semibold text-sm mb-4">Tasks by Category</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
            {data.categoryStats.map(c => (
              <div
                key={c._id}
                className="flex flex-col items-center p-2.5 sm:p-3 rounded-xl border tf-border hover:tf-border-hover transition-all"
                style={{ background: 'rgba(124,58,237,0.06)' }}
              >
                <p className="text-xl sm:text-2xl font-bold text-violet-300">{c.count}</p>
                <p className="tf-text-3 text-[10px] sm:text-[11px] mt-0.5 capitalize text-center">{c._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
