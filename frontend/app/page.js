'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Zap, CheckSquare, Kanban, BarChart3, ArrowRight,
  Shield, Clock, Users, Star, ChevronRight, Sparkles,
  Layout, Target, TrendingUp
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to dashboard button handler
  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/register');
    }
  };

  const handleLogin = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center tf-base">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
          <p className="tf-text-3 text-sm">Loading TaskFlow…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen tf-base overflow-x-hidden">
      {/* ═══════════════════════════════════════════
          NAVIGATION BAR
          ═══════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 50 ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: scrollY > 50 ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrollY > 50 ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="tf-text-1 font-bold text-lg leading-none">TaskFlow</span>
                <p className="text-violet-400/70 text-[9px] font-semibold uppercase tracking-widest mt-0.5">Pro</p>
              </div>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <button onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200">
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button onClick={handleLogin}
                    className="hidden sm:flex items-center px-4 py-2.5 rounded-xl text-sm font-medium tf-text-2 hover:text-white transition-colors">
                    Sign In
                  </button>
                  <button onClick={handleGetStarted}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-violet w-[600px] h-[600px] top-[-200px] left-[-150px] opacity-50" />
          <div className="orb-cyan w-[500px] h-[500px] bottom-[-100px] right-[-120px] opacity-40" />
          <div className="orb-violet w-[350px] h-[350px] top-1/3 right-1/4 opacity-15" style={{ animationDelay: '3s' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
              backgroundSize: '64px 64px'
            }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border tf-border mb-8 animate-fade-up"
            style={{ background: 'rgba(124, 58, 237, 0.08)' }}>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-wider">Modern Task Management</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}>
            <span className="tf-text-1">Organize your work,</span>
            <br />
            <span className="gradient-text">amplify your productivity</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg tf-text-2 mb-10 leading-relaxed animate-fade-up"
            style={{ animationDelay: '0.2s' }}>
            TaskFlow brings together powerful Kanban boards, intelligent analytics, and seamless task management — 
            all wrapped in a beautiful interface designed for focused work.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <button onClick={handleGetStarted}
              className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-300">
              {user ? 'Go to Dashboard' : 'Start Free'}
              <ArrowRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border tf-border tf-text-2 font-medium text-base hover:border-violet-500/40 hover:text-white transition-all duration-200">
              Explore Features
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Visual — Dashboard Preview Card */}
          <div className="relative mt-16 sm:mt-20 mx-auto max-w-4xl animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="rounded-2xl border tf-border overflow-hidden shadow-2xl"
              style={{ background: 'var(--bg-surface)', boxShadow: '0 25px 80px rgba(124, 58, 237, 0.15), 0 0 0 1px var(--border)' }}>
              {/* Fake Browser Chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b tf-border" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 mx-3">
                  <div className="max-w-xs mx-auto h-6 rounded-md px-3 flex items-center text-[11px] tf-text-3"
                    style={{ background: 'var(--bg-card)' }}>
                    taskflow.app/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard Preview Content */}
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: 'Total Tasks', value: '248', color: 'from-violet-600 to-violet-400', icon: CheckSquare },
                    { label: 'In Progress', value: '32', color: 'from-cyan-600 to-cyan-400', icon: Clock },
                    { label: 'Completed', value: '186', color: 'from-emerald-600 to-emerald-400', icon: Target },
                    { label: 'Productivity', value: '94%', color: 'from-amber-600 to-amber-400', icon: TrendingUp },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-xl p-4 border tf-border" style={{ background: 'var(--bg-card)' }}>
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="tf-text-1 text-xl font-bold">{stat.value}</p>
                      <p className="tf-text-3 text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Fake task rows */}
                <div className="space-y-2">
                  {[
                    { title: 'Design new landing page', tag: 'Design', tagColor: 'bg-violet-500/20 text-violet-300', priority: 'High' },
                    { title: 'Implement user authentication', tag: 'Backend', tagColor: 'bg-cyan-500/20 text-cyan-300', priority: 'Medium' },
                    { title: 'Write API documentation', tag: 'Docs', tagColor: 'bg-emerald-500/20 text-emerald-300', priority: 'Low' },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl border tf-border transition-colors"
                      style={{ background: 'var(--bg-elevated)' }}>
                      <div className="w-4 h-4 rounded border-2 flex-shrink-0" style={{ borderColor: 'var(--border-hover)' }} />
                      <span className="tf-text-1 text-sm font-medium flex-1 text-left">{task.title}</span>
                      <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${task.tagColor}`}>{task.tag}</span>
                      <span className="tf-text-3 text-xs hidden sm:inline">{task.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating glow behind card */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600/10 to-cyan-500/10 blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════ */}
      <section id="features" className="relative py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tf-text-1 mb-4">
              Everything you need to <span className="gradient-text">stay productive</span>
            </h2>
            <p className="max-w-xl mx-auto tf-text-2">
              Powerful tools designed to help you organize, track, and complete your work efficiently.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: CheckSquare,
                title: 'Smart Task Management',
                desc: 'Create, organize, and prioritize tasks with subtasks, due dates, priorities, and categories.',
                gradient: 'from-violet-600 to-violet-400',
              },
              {
                icon: Kanban,
                title: 'Kanban Boards',
                desc: 'Visualize your workflow with drag-and-drop Kanban boards. Move tasks through custom stages.',
                gradient: 'from-cyan-600 to-cyan-400',
              },
              {
                icon: BarChart3,
                title: 'Analytics & Insights',
                desc: 'Track your productivity with interactive charts, weekly reports, and completion trends.',
                gradient: 'from-emerald-600 to-emerald-400',
              },
              {
                icon: Layout,
                title: 'Beautiful Dashboard',
                desc: 'Get a birds-eye view of all your tasks, upcoming deadlines, and progress metrics.',
                gradient: 'from-amber-600 to-amber-400',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                desc: 'Your data is protected with JWT authentication, rate limiting, and encrypted passwords.',
                gradient: 'from-rose-600 to-rose-400',
              },
              {
                icon: Sparkles,
                title: 'Premium Experience',
                desc: 'Dark & light themes, keyboard shortcuts, smooth animations, and responsive design.',
                gradient: 'from-fuchsia-600 to-fuchsia-400',
              },
            ].map((feature, i) => (
              <div key={i}
                className="group relative p-6 rounded-2xl border tf-border transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg cursor-default"
                style={{ background: 'var(--bg-surface)', animationDelay: `${i * 0.1}s` }}>
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="tf-text-1 text-lg font-bold mb-2">{feature.title}</h3>
                <p className="tf-text-2 text-sm leading-relaxed">{feature.desc}</p>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-2xl border tf-border p-8 sm:p-10"
            style={{ background: 'var(--bg-surface)', boxShadow: '0 8px 40px rgba(124, 58, 237, 0.06)' }}>
            {[
              { value: '11', label: 'Pages', icon: Layout },
              { value: '5', label: 'Core Features', icon: Zap },
              { value: '2', label: 'Themes', icon: Star },
              { value: '∞', label: 'Possibilities', icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-5 h-5 text-violet-400 mr-2" />
                  <span className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</span>
                </div>
                <p className="tf-text-3 text-xs sm:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-violet w-[400px] h-[400px] bottom-0 left-1/4 opacity-25" />
          <div className="orb-cyan w-[300px] h-[300px] top-0 right-1/4 opacity-20" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tf-text-1 mb-4">
            Ready to boost your <span className="gradient-text">productivity</span>?
          </h2>
          <p className="tf-text-2 mb-8 text-base sm:text-lg">
            Join TaskFlow and start managing your tasks like a pro. It&apos;s free to get started.
          </p>
          <button onClick={handleGetStarted}
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-300">
            {user ? 'Go to Dashboard' : 'Get Started — It\'s Free'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t tf-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="tf-text-2 text-sm font-semibold">TaskFlow Pro</span>
          </div>
          <p className="tf-text-3 text-xs">
            © {new Date().getFullYear()} TaskFlow. Built with Next.js, Express & MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
