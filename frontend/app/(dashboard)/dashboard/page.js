'use client';
import { useEffect, useState } from 'react';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, Clock, ListTodo, TrendingUp, AlertTriangle, Calendar, Activity, ChevronRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

const ACTION_ICONS  = { task_created:'✨', task_completed:'✅', task_updated:'✏️', task_deleted:'🗑️', task_status_changed:'🔄', comment_added:'💬', user_login:'👋', profile_updated:'👤', password_changed:'🔒', task_priority_changed:'⚡' };
const ACTION_LABELS = { task_created:'Created task', task_completed:'Completed task', task_updated:'Updated task', task_deleted:'Deleted task', task_status_changed:'Changed status', comment_added:'Comment added', user_login:'Logged in', profile_updated:'Updated profile', password_changed:'Changed password', task_priority_changed:'Changed priority' };

function StatCard({ label, value, icon: Icon, grad, border }) {
  return (
    <div className={`relative rounded-2xl p-5 border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${border}`}
      style={{ background: grad }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.08)' }} />
      <Icon className="w-5 h-5 text-white/60 mb-3" />
      <p className="text-3xl sm:text-4xl font-bold text-white">{value}</p>
      <p className="text-white/60 text-xs font-medium mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}

function getDueLabel(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isPast(d) && !isToday(d)) return { l: 'Overdue', c: 'text-rose-400' };
  if (isToday(d))                return { l: 'Today',   c: 'text-amber-400' };
  if (isTomorrow(d))             return { l: 'Tomorrow',c: 'text-yellow-400' };
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-[3px] border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );

  const stats = data?.stats || {};
  const pct   = stats.completionRate || 0;
  const hour  = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const cards = [
    { label: 'Total',       value: stats.total    || 0, icon: ListTodo,      grad: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'border-violet-500/30' },
    { label: 'Completed',   value: stats.completed|| 0, icon: CheckCircle2,  grad: 'linear-gradient(135deg,#059669,#0d9488)', border: 'border-emerald-500/30' },
    { label: 'In Progress', value: stats.inProgress||0, icon: TrendingUp,    grad: 'linear-gradient(135deg,#0891b2,#0e7490)', border: 'border-cyan-500/30'    },
    { label: 'Overdue',     value: stats.overdue  || 0, icon: AlertTriangle, grad: 'linear-gradient(135deg,#e11d48,#be123c)', border: 'border-rose-500/30'    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Greeting */}
      <div className="rounded-2xl p-5 sm:p-6 border border-violet-500/15 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))' }}>
        {/* Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-violet-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tf-text-1">
            {greet}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="tf-text-2 text-sm mt-0.5">
            {stats.completed > 0
              ? `You've completed ${stats.completed} task${stats.completed !== 1 ? 's' : ''}. Keep it up!`
              : 'Ready to be productive today?'}
          </p>
        </div>
        {/* Progress ring */}
        <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1 flex-shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="3" strokeLinecap="round"
              stroke="url(#pg)" strokeDasharray={`${pct} 100`}/>
            <defs><linearGradient id="pg" x1="0%" y1="0%" x2="100%">
              <stop offset="0%" stopColor="#7c3aed"/><stop offset="100%" stopColor="#06b6d4"/>
            </linearGradient></defs>
          </svg>
          <div className="sm:absolute sm:inset-0 sm:flex sm:items-center sm:justify-center sm:pointer-events-none hidden">
            <span className="text-white font-bold text-sm">{pct}%</span>
          </div>
          <div className="flex flex-col sm:items-center">
            <span className="tf-text-1 font-bold text-base sm:hidden">{pct}%</span>
            <span className="tf-text-3 text-xs">Done</span>
          </div>
        </div>
      </div>

      {/* Stat Cards — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {cards.map(c => <StatCard key={c.label} {...c} />)}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2 rounded-2xl border tf-border p-5 tf-surface">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-violet-400" />
              <h3 className="tf-text-1 font-semibold text-sm">Upcoming Tasks</h3>
            </div>
            <Link href="/tasks" className="text-violet-400 hover:text-violet-300 text-xs flex items-center gap-1 transition-colors font-medium">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {data?.upcomingTasks?.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingTasks.map(t => {
                const due = getDueLabel(t.dueDate);
                return (
                  <div key={t._id} className="flex items-center gap-3 p-3 rounded-xl border tf-border hover:tf-border-hover transition-all"
                    style={{ background: 'var(--bg-hover)' }}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority==='high'?'bg-rose-400':t.priority==='medium'?'bg-amber-400':'bg-emerald-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="tf-text-1 text-sm font-medium truncate">{t.title}</p>
                      <p className="tf-text-3 text-xs capitalize">{t.category}</p>
                    </div>
                    {due && <span className={`text-xs font-semibold flex-shrink-0 ${due.c}`}>{due.l}</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <Zap className="w-8 h-8 tf-text-3 mx-auto mb-2" />
              <p className="tf-text-3 text-sm">No tasks due soon!</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border tf-border p-5 tf-surface">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="tf-text-1 font-semibold text-sm">Recent Activity</h3>
          </div>
          {data?.recentActivity?.length > 0 ? (
            <div className="space-y-3">
              {data.recentActivity.slice(0,8).map(log => (
                <div key={log._id} className="flex items-start gap-2.5">
                  <span className="text-sm flex-shrink-0">{ACTION_ICONS[log.action]||'📌'}</span>
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

      {/* Category Breakdown */}
      {data?.categoryStats?.length > 0 && (
        <div className="rounded-2xl border tf-border p-5 tf-surface">
          <h3 className="tf-text-1 font-semibold text-sm mb-4">Tasks by Category</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {data.categoryStats.map(c => (
              <div key={c._id} className="flex flex-col items-center p-3 rounded-xl border tf-border hover:tf-border-hover transition-all"
                style={{ background: 'rgba(124,58,237,0.06)' }}>
                <p className="text-2xl font-bold text-violet-300">{c.count}</p>
                <p className="tf-text-3 text-[11px] mt-0.5 capitalize">{c._id}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
