'use client';
import { useState, useEffect, useMemo } from 'react';
import { analyticsApi } from '@/lib/api';
import { useTheme } from '@/context/ThemeContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Target, Award, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import StatCard from '@/components/ui/StatCard';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl px-3 py-2.5 text-xs shadow-2xl border tf-card tf-border">
      {label && <p className="tf-text-2 mb-1 font-medium">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [weekly,    setWeekly]    = useState([]);
  const [monthly,   setMonthly]   = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    Promise.all([analyticsApi.weekly(), analyticsApi.monthly(), analyticsApi.dashboard()])
      .then(([w, m, d]) => {
        setWeekly(w.data.data);
        setMonthly(m.data.data);
        setDashboard(d.data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats     = dashboard?.stats || {};

  // Memoize derived data so theme toggles don't recalculate everything
  const statusData = useMemo(() => [
    { name: 'To Do',       value: stats.todo       || 0, color: '#64748b' },
    { name: 'In Progress', value: stats.inProgress || 0, color: '#06b6d4' },
    { name: 'Completed',   value: stats.completed  || 0, color: '#10b981' },
  ].filter(d => d.value > 0), [stats.todo, stats.inProgress, stats.completed]);

  const priorityData = useMemo(() =>
    (dashboard?.priorityStats || []).map(p => ({
      name:  p._id,
      value: p.count,
      color: p._id === 'high' ? '#f43f5e' : p._id === 'medium' ? '#f59e0b' : '#10b981',
    })), [dashboard?.priorityStats]);

  const summaryCardData = useMemo(() => [
    { label: 'Completion Rate',     value: `${stats.completionRate || 0}%`,           icon: Target,    grad: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'border-violet-500/30'  },
    { label: 'Created This Week',   value: weekly.reduce((s, d) => s + d.created, 0), icon: TrendingUp,grad: 'linear-gradient(135deg,#0891b2,#0e7490)', border: 'border-cyan-500/30'    },
    { label: 'Completed This Week', value: weekly.reduce((s, d) => s + d.completed, 0),icon: Award,    grad: 'linear-gradient(135deg,#059669,#0d9488)', border: 'border-emerald-500/30' },
    { label: 'Overdue Tasks',       value: stats.overdue || 0,                         icon: Zap,       grad: 'linear-gradient(135deg,#e11d48,#be123c)', border: 'border-rose-500/30'   },
  ], [stats.completionRate, stats.overdue, weekly]);

  if (loading) return <LoadingSpinner size="lg" className="h-64" />;

  const tickColor = isDark ? '#4a5a7a' : '#8b91b8';
  const gridColor = isDark ? 'rgba(139,92,246,0.08)' : 'rgba(124,58,237,0.1)';
  const axisProps = { tick: { fill: tickColor, fontSize: 11 }, axisLine: false, tickLine: false };

  return (
    <div className="space-y-4 sm:space-y-5">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summaryCardData.map(c => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── Weekly Productivity ── */}
      <div className="rounded-2xl border tf-border p-4 sm:p-5 md:p-6 tf-surface">
        <h3 className="tf-text-1 font-semibold text-sm mb-4 sm:mb-5">Weekly Productivity</h3>
        <div className="w-full h-[200px] sm:h-[240px] md:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="day" {...axisProps} />
              <YAxis allowDecimals={false} {...axisProps} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: tickColor }} />
              <Area type="monotone" dataKey="completed" name="Completed" stroke="#7c3aed" fill="url(#gV)" strokeWidth={2.5} dot={{ fill: '#7c3aed', r: 3 }} activeDot={{ r: 5 }} />
              <Area type="monotone" dataKey="created"   name="Created"   stroke="#06b6d4" fill="url(#gC)" strokeWidth={2.5} dot={{ fill: '#06b6d4', r: 3 }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Status Donut + Priority Bar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Status Donut */}
        <div className="rounded-2xl border tf-border p-4 sm:p-5 md:p-6 tf-surface">
          <h3 className="tf-text-1 font-semibold text-sm mb-4 sm:mb-5">Task Status</h3>
          {statusData.length > 0 ? (
            <>
              <div className="h-[160px] sm:h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={4} dataKey="value" stroke="none">
                      {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-2">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center gap-1.5 sm:gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="tf-text-2 text-xs">{d.name}: <span className="tf-text-1 font-semibold">{d.value}</span></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="tf-text-3 text-sm text-center py-8 sm:py-10">Create tasks to see the chart!</p>
          )}
        </div>

        {/* Priority Bar */}
        <div className="rounded-2xl border tf-border p-4 sm:p-5 md:p-6 tf-surface">
          <h3 className="tf-text-1 font-semibold text-sm mb-4 sm:mb-5">Priority Breakdown</h3>
          {priorityData.length > 0 ? (
            <div className="h-[200px] sm:h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" {...axisProps} />
                  <YAxis allowDecimals={false} {...axisProps} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Tasks" radius={[6, 6, 0, 0]}>
                    {priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="tf-text-3 text-sm text-center py-8 sm:py-10">No tasks yet.</p>
          )}
        </div>
      </div>

      {/* ── Monthly Bar ── */}
      {monthly.length > 0 && (
        <div className="rounded-2xl border tf-border p-4 sm:p-5 md:p-6 tf-surface">
          <h3 className="tf-text-1 font-semibold text-sm mb-4 sm:mb-5">Monthly Summary (Last 6 Months)</h3>
          <div className="h-[200px] sm:h-[240px] md:h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="_id" {...axisProps} />
                <YAxis allowDecimals={false} {...axisProps} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', color: tickColor }} />
                <Bar dataKey="created"   name="Created"   fill="#7c3aed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
