import { createPreset } from 'fumadocs-ui/tailwind-plugin';
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
    './mdx-components.{ts,tsx}',
    './node_modules/fumadocs-ui/dist/**/*.js',
  ],
  presets: [
    createPreset({
      preset: 'default',
      cssPrefix: 'fd',
    }),
  ],
  theme: {
    extend: {
      colors: {
        // Claude Code docs coral/orange accent
        primary: {
          DEFAULT: 'rgb(217 119 87)',
          foreground: 'rgb(255 255 255)',
        },
        // Override fumadocs colors for light theme
        fd: {
          background: 'rgb(255 255 255)',
          foreground: 'rgb(23 23 23)',
          muted: 'rgb(245 245 245)',
          'muted-foreground': 'rgb(115 115 115)',
          card: 'rgb(255 255 255)',
          border: 'rgb(229 229 229)',
          primary: 'rgb(217 119 87)',
          'primary-foreground': 'rgb(255 255 255)',
          secondary: 'rgb(245 245 245)',
          accent: 'rgb(245 245 245)',
          ring: 'rgb(217 119 87)',
        },
      },
    },
  },
};

export default config;
