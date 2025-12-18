import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F172A',
        foreground: '#E2E8F0',
        card: {
          DEFAULT: '#1E293B',
          border: 'rgba(148, 163, 184, 0.1)',
        },
        primary: {
          DEFAULT: '#0EA5E9',
          hover: '#0284C7',
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
        },
        success: '#10B981',
        danger: '#EF4444',
        warning: '#F59E0B',
        border: {
          DEFAULT: 'rgba(148, 163, 184, 0.1)',
          focus: 'rgba(14, 165, 233, 0.5)',
        },
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 0 15px rgba(14, 165, 233, 0.1)',
        glow: '0 0 20px rgba(14, 165, 233, 0.4)',
      },
      borderRadius: {
        card: '0.75rem',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      animationDelay: {
        '700': '700ms',
      },
    },
  },
  plugins: [],
}
export default config
