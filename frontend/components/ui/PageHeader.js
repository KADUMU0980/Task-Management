/**
 * PageHeader — Section header with title, optional subtitle and a right-side action slot.
 * @param {Component} icon     — Lucide icon component (optional)
 * @param {string}    title    — Section title
 * @param {string}    sub      — Optional subtitle / description
 * @param {ReactNode} action   — Optional right-side content (buttons, links)
 * @param {string}    className — Additional wrapper classes
 */
export default function PageHeader({ icon: Icon, title, sub, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-violet-400 flex-shrink-0" />}
        <div className="min-w-0">
          <h3 className="tf-text-1 font-semibold text-sm leading-none truncate">{title}</h3>
          {sub && <p className="tf-text-3 text-xs mt-0.5 truncate hidden sm:block">{sub}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
