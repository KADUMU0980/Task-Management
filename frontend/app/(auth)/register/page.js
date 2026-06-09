'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, UserPlus, Zap, Check } from 'lucide-react';

const strengthData = [
  { label: 'Too short', color: 'bg-rose-500' },
  { label: 'Weak',      color: 'bg-amber-500' },
  { label: 'Fair',      color: 'bg-yellow-400' },
  { label: 'Good',      color: 'bg-emerald-400' },
  { label: 'Strong',    color: 'bg-emerald-500' },
];

function getStrength(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
}

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const strength = form.password ? getStrength(form.password) : -1;

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password || form.password.length < 6) e.password = 'Min. 6 characters required';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await register(form.name, form.email, form.password);
    setLoading(false);
  };

  const upd = (key) => (e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); };

  const inputCls = (key) =>
    `w-full px-4 py-3.5 rounded-xl border text-sm outline-none transition-all tf-input-field
    focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/60
    ${errors[key] ? 'border-rose-500/70' : ''}`;

  return (
    <div className="animate-fade-up w-full">
      <div className="text-center mb-7">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 mb-5 shadow-violet-md">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tf-text-1 tracking-tight">Create account</h1>
        <p className="tf-text-2 mt-1.5 text-sm">Start managing tasks like a pro today</p>
      </div>

      <div className="backdrop-blur-xl border tf-border rounded-3xl p-8 tf-card" style={{ boxShadow: '0 24px 64px var(--shadow-strong)' }}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-2 uppercase tracking-wider">Full Name</label>
            <input type="text" value={form.name} onChange={upd('name')} placeholder="John Doe" autoComplete="name" className={inputCls('name')} />
            {errors.name && <p className="text-rose-400 text-xs">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-2 uppercase tracking-wider">Email</label>
            <input type="email" value={form.email} onChange={upd('email')} placeholder="you@example.com" autoComplete="email" className={inputCls('email')} />
            {errors.email && <p className="text-rose-400 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={upd('password')}
                placeholder="Min. 6 characters" autoComplete="new-password"
                className={`${inputCls('password')} pr-11`} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 tf-text-3 hover:tf-text-1 transition-colors p-1">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Strength meter */}
            {form.password && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1">
                  {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthData[strength]?.color : 'bg-white/10'}`} />
                  ))}
                </div>
                <p className={`text-xs font-medium ${strength >= 3 ? 'text-emerald-400' : strength >= 2 ? 'text-yellow-400' : 'text-rose-400'}`}>
                  {strengthData[strength]?.label}
                </p>
              </div>
            )}
            {errors.password && <p className="text-rose-400 text-xs">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-2 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={upd('confirmPassword')}
                placeholder="Repeat password" autoComplete="new-password"
                className={`${inputCls('confirmPassword')} pr-11`} />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
              )}
            </div>
            {errors.confirmPassword && <p className="text-rose-400 text-xs">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 mt-2
              bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400
              text-white font-semibold rounded-xl text-sm
              transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0
              shadow-violet-sm hover:shadow-violet-md">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t tf-border text-center">
          <p className="tf-text-3 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
