/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs':  '480px',
      'sm':  '640px',
      'md':  '768px',
      'lg':  '1024px',
      'xl':  '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Deep Space Violet palette
        base:    { DEFAULT: '#07071a', 50: '#0d0d28', 100: '#141438', 200: '#1a1a45' },
        violet:  { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
        cyan:    { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' },
        emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
        amber:   { 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706' },
        rose:    { 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48' },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
        'gradient-warm':    'linear-gradient(135deg, #7c3aed 0%, #f43f5e 100%)',
        'gradient-surface': 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.04))',
      },
      boxShadow: {
        'violet-sm': '0 4px 20px rgba(124,58,237,0.2)',
        'violet-md': '0 8px 40px rgba(124,58,237,0.3)',
        'violet-lg': '0 16px 60px rgba(124,58,237,0.4)',
        'card':      '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.6)',
        'card-hover':'0 10px 40px rgba(0,0,0,0.5)',
      },
      animation: {
        'fade-up':  'fadeUp 0.4s cubic-bezier(.22,1,.36,1) both',
        'slide-in': 'slideInLeft 0.35s cubic-bezier(.22,1,.36,1) both',
        'scale-in': 'scaleIn 0.3s cubic-bezier(.22,1,.36,1) both',
        float:      'float 8s ease-in-out infinite',
        shimmer:    'shimmer 1.6s infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
    },
  },
  plugins: [],
};
