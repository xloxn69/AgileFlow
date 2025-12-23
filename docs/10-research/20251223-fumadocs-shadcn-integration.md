# Fumadocs + Shadcn UI Integration

**Date**: 2025-12-23
**Topic**: Integrating Shadcn UI styling with Fumadocs documentation framework
**Status**: Researched, fix identified

## Problem Statement

When trying to integrate Shadcn UI styling with Fumadocs UI (v14.3.1), dark mode colors were inconsistent:
- Some elements appeared dark-on-dark
- Some elements appeared white-on-dark
- Brand colors not applying consistently

## Root Cause Analysis

### The Core Issue

Using `cssPrefix: 'fd-'` in the fumadocs Tailwind preset causes variable name confusion:

1. **Fumadocs already uses `fd-` prefix** for its Tailwind utility classes (e.g., `bg-fd-background`)
2. **Setting `cssPrefix: 'fd-'`** tells fumadocs to use `--fd-*` CSS variables
3. **Trying to override `--fd-*` variables** while fumadocs also uses them internally creates conflicts

### Why Variables Didn't Apply

- Fumadocs looks for variables like `--fd-background`
- We were defining both `--background` (Shadcn) and `--fd-background` (fumadocs) separately
- These weren't bridged together, causing inconsistency

## Solution

### 1. Use a Unique CSS Prefix

Change from `fd-` to `fuma-` (or any unique prefix):

```typescript
// tailwind.config.ts
createPreset({
  cssPrefix: 'fuma-',  // NOT 'fd-'
  addGlobalColors: false,  // Prevent clashing with Shadcn colors
})
```

### 2. Single Source of Truth for Colors

Define colors ONCE using Shadcn variables, then bridge to fumadocs:

```css
:root {
  /* Shadcn variables - single source of truth */
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --primary: 24 75% 57%;
  /* ... etc */

  /* Bridge fumadocs to Shadcn variables */
  --fd-background: var(--background);
  --fd-foreground: var(--foreground);
  --fd-primary: var(--primary);
  /* ... etc */
}
```

### 3. Key Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `cssPrefix` | `'fuma-'` | Avoid collision with fd- utilities |
| `addGlobalColors` | `false` | Prevent fumadocs exporting unprefixed colors |
| Variable bridging | `--fd-*: var(--*)` | Single source of truth |

## Implementation

### tailwind.config.ts

```typescript
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
      cssPrefix: 'fuma-',
      addGlobalColors: false,
    }),
  ],
  theme: {
    extend: {
      colors: {
        // Shadcn color definitions
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... etc
      },
    },
  },
};
```

### global.css

```css
@import 'fumadocs-ui/style.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Shadcn variables - SINGLE SOURCE OF TRUTH */
    --background: 0 0% 100%;
    --foreground: 0 0% 9%;
    --primary: 24 75% 57%;
    --primary-foreground: 0 0% 100%;
    /* ... */

    /* BRIDGE fumadocs to Shadcn */
    --fd-background: var(--background);
    --fd-foreground: var(--foreground);
    --fd-primary: var(--primary);
    --fd-primary-foreground: var(--primary-foreground);
    /* ... */
  }

  .dark {
    /* Dark mode Shadcn values */
    --background: 0 0% 7%;
    --foreground: 0 0% 98%;
    /* ... */

    /* Bridges automatically inherit */
  }
}
```

## Key Insights

1. **DevTools is your friend**: Inspect elements to see which CSS variables fumadocs actually uses
2. **One source of truth**: Never duplicate color values - always bridge
3. **Prefix matters**: `cssPrefix` controls the variable prefix, not the utility prefix
4. **`addGlobalColors: false`**: Critical to prevent fumadocs from exporting unprefixed colors that clash

## References

- https://github.com/fuma-nama/fumadocs-shadcn
- Fumadocs UI v14.3.1 documentation
- Shadcn UI theming documentation
