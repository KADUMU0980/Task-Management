'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Zap, CheckSquare, Kanban, BarChart3, ArrowRight,
  Shield, Clock, Users, Star, ChevronRight, Sparkles,
  Layout, Target, TrendingUp, Menu, X
} from 'lucide-react';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 640) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleGetStarted = () => {
    setMobileMenuOpen(false);
    router.push(user ? '/dashboard' : '/register');
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    router.push(user ? '/dashboard' : '/login');
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

      {/* ═══ NAVIGATION BAR ═══ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrollY > 50 || mobileMenuOpen ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: scrollY > 50 || mobileMenuOpen ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrollY > 50 || mobileMenuOpen ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <span className="tf-text-1 font-bold text-base sm:text-lg leading-none">TaskFlow</span>
                <p className="text-violet-400/70 text-[9px] font-semibold uppercase tracking-widest mt-0.5">Pro</p>
              </div>
            </div>

            {/* Desktop Nav Actions */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="flex items-center px-4 py-2.5 rounded-xl text-sm font-medium tf-text-2 hover:text-white transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] transition-all duration-200"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-xl border tf-border tf-text-2 hover:text-white transition-all"
              style={{ background: 'var(--bg-hover)' }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden border-t tf-border pb-4 pt-3 space-y-2 animate-fade-up">
              {user ? (
                <button
                  onClick={handleGetStarted}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold"
                >
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center px-5 py-3 rounded-xl text-sm font-medium tf-text-2 hover:text-white border tf-border hover:border-violet-500/40 transition-all"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 text-white text-sm font-semibold"
                  >
                    Get Started — Free <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative pt-28 sm:pt-36 md:pt-44 pb-16 sm:pb-24 md:pb-32 px-4 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-violet w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] top-[-200px] left-[-150px] opacity-50" />
          <div className="orb-cyan w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bottom-[-100px] right-[-120px] opacity-40" />
          <div className="orb-violet w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] top-1/3 right-1/4 opacity-15" style={{ animationDelay: '3s' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border tf-border mb-6 sm:mb-8 animate-fade-up"
            style={{ background: 'rgba(124, 58, 237, 0.08)' }}>
            <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-violet-400" />
            <span className="text-[11px] sm:text-xs font-semibold text-violet-300 uppercase tracking-wider">Modern Task Management</span>
          </div>

          {/* Heading — scaled for all screen sizes */}
          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight mb-5 sm:mb-6 animate-fade-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span className="tf-text-1">Organize your work,</span>
            <br />
            <span className="gradient-text">amplify your productivity</span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-xl sm:max-w-2xl mx-auto text-sm sm:text-base lg:text-lg tf-text-2 mb-8 sm:mb-10 leading-relaxed animate-fade-up px-2"
            style={{ animationDelay: '0.2s' }}
          >
            TaskFlow brings together powerful Kanban boards, intelligent analytics, and seamless task
            management — all wrapped in a beautiful interface designed for focused work.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={handleGetStarted}
              className="group w-full xs:w-auto flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-300"
            >
              {user ? 'Go to Dashboard' : 'Start Free'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="group w-full xs:w-auto flex items-center justify-center gap-2 px-6 sm:px-6 py-3 sm:py-3.5 rounded-2xl border tf-border tf-text-2 font-medium text-sm sm:text-base hover:border-violet-500/40 hover:text-white transition-all duration-200"
            >
              Explore Features <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hero Visual — Dashboard Preview */}
          <div className="relative mt-12 sm:mt-16 md:mt-20 mx-auto max-w-4xl animate-fade-up" style={{ animationDelay: '0.5s' }}>
            <div className="rounded-xl sm:rounded-2xl border tf-border overflow-hidden shadow-2xl"
              style={{ background: 'var(--bg-surface)', boxShadow: '0 25px 80px rgba(124, 58, 237, 0.15), 0 0 0 1px var(--border)' }}>
              {/* Fake Browser Chrome */}
              <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b tf-border" style={{ background: 'var(--bg-elevated)' }}>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/70" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/70" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/70" />
                </div>
                <div className="flex-1 mx-2 sm:mx-3">
                  <div className="max-w-[160px] sm:max-w-xs mx-auto h-5 sm:h-6 rounded-md px-2 sm:px-3 flex items-center text-[10px] sm:text-[11px] tf-text-3"
                    style={{ background: 'var(--bg-card)' }}>
                    taskflow.app/dashboard
                  </div>
                </div>
              </div>
              {/* Dashboard Preview Content */}
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  {[
                    { label: 'Total Tasks', value: '248', color: 'from-violet-600 to-violet-400', icon: CheckSquare },
                    { label: 'In Progress', value: '32',  color: 'from-cyan-600 to-cyan-400',    icon: Clock },
                    { label: 'Completed',   value: '186', color: 'from-emerald-600 to-emerald-400', icon: Target },
                    { label: 'Productivity',value: '94%', color: 'from-amber-600 to-amber-400',  icon: TrendingUp },
                  ].map((stat, i) => (
                    <div key={i} className="rounded-lg sm:rounded-xl p-3 sm:p-4 border tf-border" style={{ background: 'var(--bg-card)' }}>
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-1.5 sm:mb-2`}>
                        <stat.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                      <p className="tf-text-1 text-base sm:text-xl font-bold">{stat.value}</p>
                      <p className="tf-text-3 text-[10px] sm:text-xs">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Fake task rows */}
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    { title: 'Design new landing page',         tag: 'Design',  tagColor: 'bg-violet-500/20 text-violet-300', priority: 'High'   },
                    { title: 'Implement user authentication',   tag: 'Backend', tagColor: 'bg-cyan-500/20 text-cyan-300',     priority: 'Medium' },
                    { title: 'Write API documentation',         tag: 'Docs',    tagColor: 'bg-emerald-500/20 text-emerald-300', priority: 'Low'  },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border tf-border transition-colors"
                      style={{ background: 'var(--bg-elevated)' }}>
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-2 flex-shrink-0" style={{ borderColor: 'var(--border-hover)' }} />
                      <span className="tf-text-1 text-xs sm:text-sm font-medium flex-1 text-left truncate">{task.title}</span>
                      <span className={`hidden sm:inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold ${task.tagColor}`}>{task.tag}</span>
                      <span className="tf-text-3 text-[10px] sm:text-xs hidden md:inline">{task.priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Floating glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-600/10 to-cyan-500/10 blur-2xl -z-10" />
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="relative py-16 sm:py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-violet-400 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3">Features</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tf-text-1 mb-3 sm:mb-4">
              Everything you need to <span className="gradient-text">stay productive</span>
            </h2>
            <p className="max-w-xl mx-auto tf-text-2 text-sm sm:text-base px-2">
              Powerful tools designed to help you organize, track, and complete your work efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              { icon: CheckSquare, title: 'Smart Task Management', desc: 'Create, organize, and prioritize tasks with subtasks, due dates, priorities, and categories.', gradient: 'from-violet-600 to-violet-400' },
              { icon: Kanban,      title: 'Kanban Boards',         desc: 'Visualize your workflow with drag-and-drop Kanban boards. Move tasks through custom stages.',  gradient: 'from-cyan-600 to-cyan-400' },
              { icon: BarChart3,   title: 'Analytics & Insights',  desc: 'Track your productivity with interactive charts, weekly reports, and completion trends.',        gradient: 'from-emerald-600 to-emerald-400' },
              { icon: Layout,      title: 'Beautiful Dashboard',   desc: 'Get a birds-eye view of all your tasks, upcoming deadlines, and progress metrics.',             gradient: 'from-amber-600 to-amber-400' },
              { icon: Shield,      title: 'Secure & Private',      desc: 'Your data is protected with JWT authentication, rate limiting, and encrypted passwords.',        gradient: 'from-rose-600 to-rose-400' },
              { icon: Sparkles,    title: 'Premium Experience',    desc: 'Dark & light themes, keyboard shortcuts, smooth animations, and responsive design.',            gradient: 'from-fuchsia-600 to-fuchsia-400' },
            ].map((feature, i) => (
              <div key={i}
                className="group relative p-5 sm:p-6 rounded-2xl border tf-border transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg cursor-default"
                style={{ background: 'var(--bg-surface)', animationDelay: `${i * 0.1}s` }}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="tf-text-1 text-base sm:text-lg font-bold mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="tf-text-2 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="relative py-12 sm:py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 rounded-2xl border tf-border p-6 sm:p-8 md:p-10"
            style={{ background: 'var(--bg-surface)', boxShadow: '0 8px 40px rgba(124, 58, 237, 0.06)' }}>
            {[
              { value: '11', label: 'Pages',         icon: Layout },
              { value: '5',  label: 'Core Features', icon: Zap },
              { value: '2',  label: 'Themes',        icon: Star },
              { value: '∞',  label: 'Possibilities', icon: Sparkles },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mb-1.5 sm:mb-2">
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 mr-1.5 sm:mr-2" />
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text">{stat.value}</span>
                </div>
                <p className="tf-text-3 text-[11px] sm:text-xs md:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative py-16 sm:py-20 md:py-28 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb-violet w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bottom-0 left-1/4 opacity-25" />
          <div className="orb-cyan w-[250px] sm:w-[300px] h-[250px] sm:h-[300px] top-0 right-1/4 opacity-20" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center px-2">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tf-text-1 mb-3 sm:mb-4">
            Ready to boost your <span className="gradient-text">productivity</span>?
          </h2>
          <p className="tf-text-2 mb-6 sm:mb-8 text-sm sm:text-base md:text-lg">
            Join TaskFlow and start managing your tasks like a pro. It&apos;s free to get started.
          </p>
          <button
            onClick={handleGetStarted}
            className="group inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.03] transition-all duration-300"
          >
            {user ? 'Go to Dashboard' : "Get Started — It's Free"}
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t tf-border py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="tf-text-2 text-sm font-semibold">TaskFlow Pro</span>
          </div>
          <p className="tf-text-3 text-xs text-center">
            © {new Date().getFullYear()} TaskFlow. Built with Next.js, Express &amp; MongoDB.
          </p>
        </div>
      </footer>
    </div>
  );
}
