'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await login(form.email, form.password);
    setLoading(false);
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); },
  });

  const inputBase = (hasErr) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all tf-input-field
    focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/60
    ${hasErr ? 'border-rose-500/70' : ''}`;

  return (
    <div className="animate-fade-up w-full">
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 mb-5 shadow-violet-md">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tf-text-1 tracking-tight">Welcome back</h1>
        <p className="tf-text-2 mt-1.5 text-sm">Sign in to continue to TaskFlow</p>
      </div>

      {/* Card */}
      <div className="backdrop-blur-xl border tf-border rounded-3xl p-8 tf-card" style={{ boxShadow: '0 24px 64px var(--shadow-strong)' }}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-2 uppercase tracking-wider">Email</label>
            <input
              type="email"
              {...field('email')}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputBase(errors.email)}
            />
            {errors.email && <p className="text-rose-400 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                {...field('password')}
                placeholder="••••••••"
                autoComplete="current-password"
                className={`${inputBase(errors.password)} pr-11`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 tf-text-3 hover:tf-text-1 transition-colors p-1">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-rose-400 text-xs">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6
              bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400
              text-white font-semibold rounded-xl text-sm
              transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
              shadow-violet-sm hover:shadow-violet-md mt-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t tf-border text-center">
          <p className="tf-text-3 text-sm">
            No account?{' '}
            <Link href="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
