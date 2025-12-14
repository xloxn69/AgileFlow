import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        background: '#FFFFFF',
        surface: '#FFFFFF',
        panel: '#FAFAFA',
        ink: '#0B0D10',
        secondary: '#4B5563',
        muted: '#6B7280',
        border: '#E5E7EB',
        hairline: '#F1F5F9',
        accent: '#C15F3C',
      },
      borderRadius: {
        tile: '12px',
        card: '16px',
      },
      boxShadow: {
        hairline: '0 1px 0 rgba(0,0,0,.03)',
        tile: '0 1px 2px rgba(0,0,0,0.04)',
        tileHover: '0 8px 24px rgba(0,0,0,0.06)',
      },
      letterSpacing: {
        tightish: '-0.03em',
        caps: '0.08em',
      },
      maxWidth: {
        content: '1120px',
      },
      transitionTimingFunction: {
        quiet: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 320ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
};

export default config;
