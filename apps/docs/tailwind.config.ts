import { createPreset } from 'fumadocs-ui/tailwind-plugin';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './mdx-components.{ts,tsx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [createPreset()],
  theme: {
    extend: {
      colors: {
        // Exact Claude color palette
        'page': '#F4F1E6',
        'surface': '#FEFCF7',
        'subtle': '#EEE7D8',
        'accent': '#C15F3C',
        'accent-soft': '#E38A63',
        'text-main': '#17130C',
        'text-muted': '#5A5240',
        'border-subtle': '#E1D7C5',
        'code-bg': '#F7F3EA',
        'code-border': '#E2D6C2',
        'info-bg': '#D9F3E3',
        'info-text': '#155B3C',
        'info-border': '#72C093',
      },
      fontFamily: {
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '10px',
        lg: '16px',
        xl: '16px',
      },
      fontSize: {
        'h1': 'clamp(2.2rem, 4vw, 2.6rem)',
        'h2': '1.75rem',
        'h3': '1.35rem',
      },
      lineHeight: {
        'tight': '1.1',
        'snug': '1.25',
        'relaxed': '1.65',
      },
    },
  },
};

export default config;
