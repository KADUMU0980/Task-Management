/**
 * StatCard — Gradient stat card with icon, value and label.
 * @param {string}    label   — Card label text
 * @param {string|number} value — Primary metric value
 * @param {Component} icon    — Lucide icon component
 * @param {string}    grad    — CSS gradient string for background
 * @param {string}    border  — Tailwind border colour class
 */
export default function StatCard({ label, value, icon: Icon, grad, border }) {
  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-5 border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover ${border}`}
      style={{ background: grad }}
    >
      {/* decorative corner */}
      <div
        className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 rounded-bl-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      <Icon className="w-5 h-5 text-white/60 mb-2 sm:mb-3" />
      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">{value}</p>
      <p className="text-white/60 text-[11px] sm:text-xs font-medium mt-1 uppercase tracking-wide">{label}</p>
    </div>
  );
}
