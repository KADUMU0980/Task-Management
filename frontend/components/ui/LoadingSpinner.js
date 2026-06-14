/**
 * LoadingSpinner — Centered, animated spinner.
 * @param {string} size   — 'sm' | 'md' | 'lg'  (default 'md')
 * @param {string} className — additional wrapper classes
 */
export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-6 h-6 border-[2px]',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-14 h-14 border-[3px]',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-violet-500/20 border-t-violet-500 rounded-full animate-spin`}
      />
    </div>
  );
}
