# AgileFlow Monorepo Setup Summary

**Date**: 2025-12-08
**Status**: Complete ✅

## What We Built

Successfully migrated AgileFlow to a monorepo structure with separate Next.js applications for the website and documentation.

## Structure

```
AgileFlow/
├── apps/
│   ├── website/              # Landing page
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   ├── public/
│   │   ├── package.json      # Next.js 15 + React 19 + Tailwind
│   │   ├── next.config.mjs
│   │   ├── tsconfig.json
│   │   └── tailwind.config.ts
│   │
│   └── docs/                 # Documentation site (Fumadocs)
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx
│       │   ├── global.css
│       │   └── docs/
│       │       ├── layout.tsx
│       │       └── [[...slug]]/
│       │           └── page.tsx
│       ├── content/
│       │   └── docs/
│       │       ├── index.mdx  # Welcome page
│       │       └── meta.json   # Navigation
│       ├── lib/
│       │   └── source.ts       # Fumadocs source config
│       ├── package.json        # Fumadocs + Next.js
│       ├── source.config.ts
│       └── mdx-components.tsx
│
├── packages/
│   └── cli/                  # CLI package (npm)
│       ├── src/              # CLI source code
│       ├── tools/            # CLI tools
│       ├── package.json      # agileflow
│       └── .npmignore
│
├── package.json              # Root workspace config
├── .gitignore
├── .npmignore
├── README.md                 # Updated with monorepo structure
└── NPX-MIGRATION-PLAN.md     # Updated with implementation status
```

## Domains

- **Website**: `agileflow.projectquestorg.com`
- **Docs**: `docs.agileflow.projectquestorg.com`
- **npm**: `agileflow`

## Technology Stack

### Website (`apps/website/`)
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Simple landing page with hero and CTA

### Documentation (`apps/docs/`)
- Next.js 15 (App Router)
- React 19
- TypeScript
- **Fumadocs UI** (v14.3.1)
- **Fumadocs MDX** (v11.0.2)
- Tailwind CSS
- MDX content in `content/docs/`

### CLI (`packages/cli/`)
- Node.js 18+
- Commander.js (CLI framework)
- Inquirer.js (interactive prompts)
- Chalk (terminal colors)
- fs-extra (file operations)

## Development Workflow

### Install Dependencies
```bash
npm install
```

This installs dependencies for all workspaces (root + 3 packages).

### Run Development Servers

**Website** (port 3000):
```bash
npm run dev:website
# → http://localhost:3000
```

**Docs** (port 3001):
```bash
npm run dev:docs
# → http://localhost:3001
```

**CLI** (test locally):
```bash
npm run dev:cli -- install
npm run dev:cli -- status
```

### Build Commands

**Build All**:
```bash
npm run build:all
```

**Build Individual**:
```bash
npm run build:website
npm run build:docs
npm run build:cli
```

## Deployment Strategy

### Vercel (Website & Docs)

Two separate Vercel projects:

1. **Website Project**
   - Root Directory: `apps/website`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Domain: `agileflow.projectquestorg.com`

2. **Docs Project**
   - Root Directory: `apps/docs`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Domain: `docs.agileflow.projectquestorg.com`

### npm (CLI)

CLI package publishes from `packages/cli/`:
- Package: `agileflow`
- Current version: `1.0.1`
- The `apps/` folder is excluded via `.npmignore`

## Files Created

### Root Level
- ✅ `package.json` - Workspace configuration
- ✅ `.gitignore` - Updated with Next.js/Fumadocs ignores
- ✅ `.npmignore` - Updated to exclude `apps/` folder
- ✅ `README.md` - Updated with monorepo structure
- ✅ `NPX-MIGRATION-PLAN.md` - Updated with implementation status
- ✅ `MONOREPO-SETUP.md` - This file

### Website (`apps/website/`)
- ✅ `package.json`
- ✅ `next.config.mjs`
- ✅ `tsconfig.json`
- ✅ `tailwind.config.ts`
- ✅ `postcss.config.mjs`
- ✅ `.eslintrc.json`
- ✅ `.gitignore`
- ✅ `app/layout.tsx`
- ✅ `app/page.tsx` - Landing page with gradient hero
- ✅ `app/globals.css`

### Docs (`apps/docs/`)
- ✅ `package.json`
- ✅ `next.config.mjs` - With Fumadocs MDX plugin
- ✅ `tsconfig.json`
- ✅ `source.config.ts` - Fumadocs source config
- ✅ `tailwind.config.ts` - With Fumadocs preset
- ✅ `postcss.config.mjs`
- ✅ `.eslintrc.json`
- ✅ `.gitignore`
- ✅ `app/layout.tsx` - Root layout with RootProvider
- ✅ `app/page.tsx` - Docs homepage
- ✅ `app/global.css`
- ✅ `app/docs/layout.tsx` - Docs layout with DocsLayout
- ✅ `app/docs/[[...slug]]/page.tsx` - Dynamic docs pages
- ✅ `lib/source.ts` - Source loader
- ✅ `mdx-components.tsx` - MDX components config
- ✅ `content/docs/index.mdx` - Welcome documentation
- ✅ `content/docs/meta.json` - Navigation structure

### CLI (`packages/cli/`)
- ✅ Moved from root: `src/`, `tools/`, `package.json`, `.npmignore`

## Next Steps

### 1. Test Development Servers

```bash
# Test website
npm run dev:website
# Visit http://localhost:3000

# Test docs
npm run dev:docs
# Visit http://localhost:3001
```

### 2. Add More Documentation Content

Create MDX files in `apps/docs/content/docs/`:
```
content/docs/
├── index.mdx
├── meta.json
├── getting-started/
│   ├── meta.json
│   ├── installation.mdx
│   └── quick-start.mdx
├── commands/
│   ├── meta.json
│   └── [command files...]
└── agents/
    ├── meta.json
    └── [agent files...]
```

### 3. Enhance Landing Page

Add sections to `apps/website/app/page.tsx`:
- IDE showcase
- Features grid
- How it works
- Testimonials
- CTA section

### 4. Deploy to Vercel

**Website:**
1. Create new Vercel project
2. Connect to GitHub
3. Set root directory: `apps/website`
4. Deploy
5. Configure domain: `agileflow.projectquestorg.com`

**Docs:**
1. Create new Vercel project
2. Connect to GitHub
3. Set root directory: `apps/docs`
4. Deploy
5. Configure domain: `docs.agileflow.projectquestorg.com`

### 5. Update CLI (if needed)

Make changes in `packages/cli/` and test:
```bash
npm run dev:cli -- install
```

### 6. Publish CLI to npm

When ready to publish CLI updates:
```bash
cd packages/cli
npm version patch  # or minor, major
npm publish
```

## Known Issues

### Node Version Warning
- Current: Node.js v18.20.8
- Required: Node.js v20+ (for Next.js 15 and some dependencies)
- **Action**: Works but consider upgrading to Node 20+ in production

### Dependencies Installed
- ✅ All dependencies installed successfully (628 packages)
- ✅ No vulnerabilities found
- ⚠️ Minor engine warnings (non-blocking)

## Verification Checklist

- ✅ Monorepo structure created
- ✅ CLI code moved to `packages/cli/`
- ✅ Website app initialized at `apps/website/`
- ✅ Docs app initialized with Fumadocs at `apps/docs/`
- ✅ Root workspace configured
- ✅ Dependencies installed
- ✅ `.gitignore` and `.npmignore` updated
- ✅ README.md updated
- ✅ NPX-MIGRATION-PLAN.md updated

## Support

If you encounter any issues:
1. Check that dependencies are installed: `npm install`
2. Verify Node.js version: `node --version` (18+ required, 20+ recommended)
3. Check individual package.json files for version compatibility
4. Refer to NPX-MIGRATION-PLAN.md for detailed architecture

## References

- [Fumadocs Documentation](https://fumadocs.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Vercel Deployment](https://vercel.com/docs)

---

**Status**: Ready for development! 🚀
