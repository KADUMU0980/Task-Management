/**
 * EmptyState — Displays an empty/zero-results callout.
 * @param {Component} icon      — Lucide icon component
 * @param {string}    title     — Bold heading
 * @param {string}    desc      — Subtext
 * @param {string}    ctaLabel  — Optional button label
 * @param {Function}  onCta     — Optional button click handler
 */
import { Plus } from 'lucide-react';

export default function EmptyState({ icon: Icon, title, desc, ctaLabel, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border tf-border"
        style={{ background: 'rgba(124,58,237,0.06)' }}
      >
        {Icon && <Icon className="w-8 h-8 tf-text-3" />}
      </div>
      <h3 className="tf-text-1 font-semibold mb-1 text-base">{title}</h3>
      {desc && <p className="tf-text-3 text-sm mb-5 max-w-xs">{desc}</p>}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold
            shadow-violet-sm hover:-translate-y-0.5 active:translate-y-0 transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#06b6d4)' }}
        >
          <Plus className="w-4 h-4" />
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
