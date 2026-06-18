/**
 * StatCard — Gradient stat card with icon, value, label, and hover glow.
 * @param {string}    label   — Card label text
 * @param {string|number} value — Primary metric value
 * @param {Component} icon    — Lucide icon component
 * @param {string}    grad    — CSS gradient string for background
 * @param {string}    border  — Tailwind border colour class
 */
export default function StatCard({ label, value, icon: Icon, grad, border }) {
  return (
    <div
      className={`group relative rounded-2xl p-4 sm:p-5 border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover cursor-default ${border}`}
      style={{ background: grad }}
    >
      {/* Hover glow — subtle radial bloom on mouse-over */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
      />
      {/* Decorative corner */}
      <div
        className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-bl-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      <Icon className="w-5 h-5 text-white/60 mb-2 sm:mb-3 relative z-10" />
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white truncate tabular-nums relative z-10" title={String(value)}>
        {value}
      </p>
      <p className="text-white/60 text-[11px] sm:text-xs font-medium mt-1 uppercase tracking-wide truncate relative z-10">
        {label}
      </p>
    </div>
  );
}
