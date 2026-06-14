/**
 * Badge — Pill-style label for status / priority / category.
 * @param {string} variant  — 'status' | 'priority' | 'category' | 'custom'
 * @param {string} value    — The value to display (e.g. 'high', 'in-progress')
 * @param {string} className — Optional extra classes
 */

const STATUS_CLS = {
  'todo':        'text-slate-400  bg-slate-500/10  border-slate-500/25',
  'in-progress': 'text-cyan-400   bg-cyan-500/10   border-cyan-500/25',
  'completed':   'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
};

const STATUS_LABEL = {
  'todo': 'To Do',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

const PRIORITY_CLS = {
  high:   'text-rose-400   bg-rose-500/10   border-rose-500/30',
  medium: 'text-amber-400  bg-amber-500/10  border-amber-500/30',
  low:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
};

const CATEGORY_CLS = 'border-violet-500/25 bg-violet-500/10 text-violet-400';

export default function Badge({ variant = 'custom', value, className = '' }) {
  let cls = '';
  let label = value;

  if (variant === 'status') {
    cls = STATUS_CLS[value] || '';
    label = STATUS_LABEL[value] || value;
  } else if (variant === 'priority') {
    cls = PRIORITY_CLS[value] || '';
  } else if (variant === 'category') {
    cls = CATEGORY_CLS;
  }

  return (
    <span
      className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium capitalize ${cls} ${className}`}
    >
      {label}
    </span>
  );
}
