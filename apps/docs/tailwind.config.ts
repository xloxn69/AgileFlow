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
        // Claude-inspired color palette
        primary: {
          DEFAULT: '#DA7756',
          hover: '#BD5D3A',
          dark: '#C15F3C',
        },
        background: {
          DEFAULT: '#EEECE2',
          surface: '#FFFFFF',
          muted: '#F4F3EE',
        },
        foreground: {
          DEFAULT: '#3D3929',
          muted: '#B1ADA1',
        },
      },
      fontFamily: {
        serif: ['ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        md: '10px',
        lg: '16px',
      },
    },
  },
};

export default config;
