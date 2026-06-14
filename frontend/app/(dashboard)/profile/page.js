'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Save, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TABS = [
  { id: 'profile',  label: 'Profile Info',    icon: User },
  { id: 'password', label: 'Change Password', icon: Lock },
];

const inputCls = 'w-full px-4 py-3 sm:py-3.5 rounded-xl text-sm outline-none transition-all border tf-input-field';

export default function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [tab,      setTab]      = useState('profile');
  const [profile,  setProfile]  = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [pwForm,   setPwForm]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loadingP, setLoadingP] = useState(false);
  const [loadingPw,setLoadingPw]= useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!profile.name.trim()) { toast.error('Name is required'); return; }
    setLoadingP(true);
    await updateProfile(profile);
    setLoadingP(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!pwForm.currentPassword || !pwForm.newPassword) { toast.error('All fields required'); return; }
    if (pwForm.newPassword.length < 6) { toast.error('New password must be ≥ 6 chars'); return; }
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoadingPw(true);
    const res = await changePassword(pwForm.currentPassword, pwForm.newPassword);
    if (res?.success) setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setLoadingPw(false);
  };

  const card = 'rounded-2xl border tf-border p-4 sm:p-5 md:p-6';

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">

      {/* ── Avatar Hero ── */}
      <div
        className={`${card} flex flex-col xs:flex-row items-start xs:items-center gap-4 sm:gap-5`}
        style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(6,182,212,0.05))' }}
      >
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-violet-md">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-500 border-2 flex items-center justify-center"
            style={{ borderColor: 'var(--bg-surface)' }}
          >
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white" />
          </div>
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold tf-text-1 leading-none">{user?.name}</h2>
          <p className="tf-text-2 text-xs sm:text-sm mt-1">{user?.email}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-400" />
            <span className="text-violet-400 text-xs font-semibold capitalize">{user?.role || 'user'}</span>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl border tf-border tf-surface">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all
              ${tab === t.id
                ? 'text-violet-300 border border-violet-500/30 shadow-violet-sm bg-violet-500/[0.15]'
                : 'tf-text-2 hover:tf-text-1'}`}
          >
            <t.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            {/* Show full label on sm+, short label on xs */}
            <span className="hidden xs:inline truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Profile Form ── */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className={`${card} space-y-4 animate-fade-up tf-surface`}>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-3 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-3 uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="w-full px-4 py-3 sm:py-3.5 rounded-xl tf-text-3 text-sm border tf-border cursor-not-allowed"
              style={{ background: 'var(--bg-base)' }}
            />
            <p className="tf-text-3 text-[11px]">Email cannot be changed</p>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold tf-text-3 uppercase tracking-wider">
              Bio <span className="normal-case font-normal">( optional )</span>
            </label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              maxLength={200}
              placeholder="Tell something about yourself…"
              className={`${inputCls} resize-none`}
            />
            <p className="tf-text-3 text-[11px] text-right">{profile.bio.length}/200</p>
          </div>
          <button
            type="submit"
            disabled={loadingP}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-violet-sm hover:shadow-violet-md"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}
          >
            {loadingP
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </form>
      )}

      {/* ── Password Form ── */}
      {tab === 'password' && (
        <form onSubmit={handlePasswordSave} className={`${card} space-y-4 animate-fade-up tf-surface`}>
          {[
            { key: 'currentPassword', label: 'Current Password'  },
            { key: 'newPassword',     label: 'New Password'      },
            { key: 'confirmPassword', label: 'Confirm New Password' },
          ].map(f => (
            <div key={f.key} className="space-y-1.5">
              <label className="block text-xs font-semibold tf-text-3 uppercase tracking-wider">{f.label}</label>
              <input
                type="password"
                value={pwForm[f.key]}
                onChange={e => setPwForm({ ...pwForm, [f.key]: e.target.value })}
                placeholder="••••••••"
                autoComplete="off"
                className={inputCls}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loadingPw}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 shadow-violet-sm hover:shadow-violet-md"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}
          >
            {loadingPw
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Lock className="w-4 h-4" />}
            Update Password
          </button>
        </form>
      )}

      {/* ── Account Info ── */}
      <div className={`${card} tf-surface`}>
        <h3 className="tf-text-2 font-semibold text-sm mb-3">Account Details</h3>
        <div className="space-y-2 sm:space-y-2.5">
          {[
            { l: 'Member since', v: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A' },
            { l: 'Account type', v: user?.role || 'user' },
          ].map(row => (
            <div key={row.l} className="flex items-center justify-between py-2 border-b tf-border last:border-0">
              <span className="tf-text-3 text-xs">{row.l}</span>
              <span className="tf-text-1 text-xs font-medium capitalize">{row.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
