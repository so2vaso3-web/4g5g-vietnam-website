import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#020617',
          card: '#111827',
          elevated: '#0B1220',
        },
        border: {
          subtle: 'rgba(255,255,255,0.08)',
          muted: 'rgba(255,255,255,0.05)',
          strong: 'rgba(255,255,255,0.14)',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        accent: {
          DEFAULT: '#06B6D4',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
        'gradient-brand-soft': 'linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(6,182,212,0.16) 100%)',
        'grid-pattern':
          "linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)",
        'radial-glow-blue':
          'radial-gradient(circle at 20% 0%, rgba(37,99,235,0.25), transparent 50%)',
        'radial-glow-cyan':
          'radial-gradient(circle at 80% 30%, rgba(6,182,212,0.22), transparent 55%)',
      },
      backgroundSize: {
        'grid-32': '32px 32px',
      },
      boxShadow: {
        'glow-blue': '0 10px 40px -10px rgba(37,99,235,0.55)',
        'glow-cyan': '0 10px 40px -10px rgba(6,182,212,0.45)',
        'card': '0 8px 30px rgba(2,6,23,0.6)',
        'card-hover': '0 18px 50px -10px rgba(37,99,235,0.35)',
        'inner-border': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(37,99,235,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(37,99,235,0)' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
        'fade-in-down': 'fade-in-down 0.4s ease-out both',
        'slide-in-right': 'slide-in-right 0.4s ease-out both',
        'pulse-glow': 'pulse-glow 2.4s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'orbit-slow': 'orbit 24s linear infinite',
        'shimmer': 'shimmer 2.4s linear infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
