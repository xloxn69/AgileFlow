# AgileFlow NPX Migration Plan

**Status**: Planning
**Created**: 2025-12-08
**Goal**: Migrate from Claude Code marketplace plugin to npx-based installation (like BMAD-METHOD)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [BMAD-METHOD Analysis](#bmad-method-analysis)
4. [Target Architecture](#target-architecture)
5. [IDE Support Matrix](#ide-support-matrix)
6. [Implementation Phases](#implementation-phases)
7. [File Structure Changes](#file-structure-changes)
8. [CLI Commands](#cli-commands)
9. [Documentation Site Plan](#documentation-site-plan)
10. [Migration Checklist](#migration-checklist)
11. [Risk Assessment](#risk-assessment)
12. [Open Questions](#open-questions)

---

## Executive Summary

### Why Migrate?

| Current Problem | Solution |
|-----------------|----------|
| Claude Code only | Multi-IDE support (Cursor, Windsurf, VS Code, etc.) |
| Version opacity (users don't know what version they have) | `agileflow status` shows installed version |
| Limited discoverability | npm registry + documentation site |
| Can't customize | Local files users can modify |
| No update control | Users choose when to update |
| Marketplace limitations | Full control over distribution |

### Decision: Abandon Claude Code Plugin

**Reason**: Maintaining two distribution methods (plugin + npx) creates confusion and double maintenance burden. The npx approach is strictly superior for our goals.

---

## Current State Analysis

### AgileFlow v2.29.0 Structure

```
AgileFlow/
├── .claude-plugin/
│   ├── plugin.json          # Plugin manifest (auto-discovers commands/agents/skills)
│   └── marketplace.json     # Marketplace metadata
├── commands/                 # 41 slash commands (*.md)
├── agents/                   # 26 subagents (*.md)
├── skills/                   # 23 skills (*/SKILL.md)
├── scripts/                  # Helper scripts
├── templates/                # Document templates
├── CHANGELOG.md
└── README.md
```

### Current Distribution

- **Method**: Claude Code marketplace plugin
- **Installation**: `claude plugin install AgileFlow` (or marketplace UI)
- **Updates**: Automatic (when Claude Code refreshes)
- **IDE Support**: Claude Code only
- **Version Visibility**: None (users can't easily check version)

---

## BMAD-METHOD Analysis

### How BMAD Works

```bash
# Installation
npx bmad-method@alpha install

# Status check
npx bmad-method status

# Update
npx bmad-method update
```

### BMAD Architecture

```
BMAD-METHOD/                    # npm package repository
├── package.json                # npm package definition
│   └── bin: { "bmad-method": "tools/bmad-npx-wrapper.js" }
├── tools/
│   ├── bmad-npx-wrapper.js    # Entry point for npx
│   └── cli/
│       ├── bmad-cli.js        # CLI router (uses commander)
│       ├── commands/          # CLI commands
│       │   ├── install.js
│       │   ├── status.js
│       │   ├── update.js
│       │   └── uninstall.js
│       ├── installers/
│       │   └── lib/
│       │       ├── core/      # Core installer logic
│       │       │   ├── installer.js
│       │       │   ├── detector.js
│       │       │   └── manifest.js
│       │       ├── ide/       # IDE-specific installers
│       │       │   ├── _base-ide.js
│       │       │   ├── claude-code.js
│       │       │   ├── cursor.js
│       │       │   ├── windsurf.js
│       │       │   └── ... (15+ IDEs)
│       │       └── modules/   # Module management
│       └── lib/               # Shared utilities
│           ├── ui.js          # Interactive prompts (inquirer)
│           ├── config.js
│           └── file-ops.js
└── src/
    ├── core/                  # Core agents/workflows (always installed)
    └── modules/               # Optional modules (user selects)
```

### IDE Configuration Patterns (from BMAD)

| IDE | Config Directory | File Format | Activation |
|-----|------------------|-------------|------------|
| Claude Code | `.claude/commands/` | `.md` | Slash commands `/command` |
| Cursor | `.cursor/rules/` | `.mdc` | Auto-activated rules |
| Windsurf | `.windsurf/workflows/` | `.md` | Workflow menu |
| VS Code + Cline | `.cline/` | `.md` | Extension-specific |
| VS Code + Copilot | `.github/copilot-instructions.md` | `.md` | Single file |

### What Gets Installed to User Projects

```
user-project/
├── .agileflow/                # Core AgileFlow installation
│   ├── _cfg/
│   │   └── manifest.yaml      # Installation manifest (version, modules, etc.)
│   ├── core/
│   │   ├── config.yaml        # User configuration
│   │   ├── agents/            # Core agents
│   │   ├── commands/          # Core commands
│   │   └── skills/            # Core skills
│   └── docs/                  # AgileFlow documentation
├── .claude/                   # (if Claude Code selected)
│   └── commands/
│       └── agileflow/         # Launcher commands
├── .cursor/                   # (if Cursor selected)
│   └── rules/
│       └── agileflow/         # Rule files (.mdc)
└── .windsurf/                 # (if Windsurf selected)
    └── workflows/
        └── agileflow/         # Workflow files
```

---

## Target Architecture

### AgileFlow npm Package Structure

```
AgileFlow/
├── package.json               # NEW: npm package definition
├── tools/
│   ├── agileflow-npx.js      # NEW: npx entry point
│   └── cli/
│       ├── agileflow-cli.js  # NEW: CLI router
│       ├── commands/         # NEW: CLI commands
│       │   ├── install.js
│       │   ├── status.js
│       │   ├── update.js
│       │   ├── uninstall.js
│       │   └── doctor.js     # Diagnose issues
│       ├── installers/
│       │   ├── core/
│       │   │   ├── installer.js
│       │   │   ├── detector.js
│       │   │   └── manifest.js
│       │   └── ide/
│       │       ├── _base-ide.js
│       │       ├── claude-code.js
│       │       ├── cursor.js
│       │       ├── windsurf.js
│       │       └── vscode-copilot.js
│       └── lib/
│           ├── ui.js         # Interactive prompts
│           ├── config.js
│           └── file-ops.js
├── src/
│   ├── core/                 # Core content (always installed)
│   │   ├── agents/           # 26 agents
│   │   ├── commands/         # 41 commands
│   │   ├── skills/           # 23 skills
│   │   └── templates/        # Document templates
│   └── modules/              # FUTURE: Optional modules
├── CHANGELOG.md
├── README.md
└── LICENSE
```

### package.json

```json
{
  "name": "agileflow",
  "version": "3.0.0",
  "description": "AI-driven agile development system for Claude Code, Cursor, Windsurf, and more",
  "bin": {
    "agileflow": "tools/agileflow-npx.js"
  },
  "keywords": ["agile", "ai", "claude", "cursor", "windsurf", "development"],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xloxn69/AgileFlow.git"
  },
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "commander": "^14.0.0",
    "inquirer": "^8.2.6",
    "chalk": "^4.1.2",
    "fs-extra": "^11.3.0",
    "js-yaml": "^4.1.0",
    "ora": "^5.4.1",
    "semver": "^7.6.3"
  }
}
```

---

## IDE Support Matrix

### Phase 1 (Launch)

| IDE | Priority | Config Path | Format | Notes |
|-----|----------|-------------|--------|-------|
| Claude Code | P0 | `.claude/commands/agileflow/` | `.md` | Primary target |
| Cursor | P0 | `.cursor/rules/agileflow/` | `.mdc` | Large user base |
| Windsurf | P1 | `.windsurf/workflows/agileflow/` | `.md` | Growing popularity |

### Phase 2 (Future)

| IDE | Priority | Notes |
|-----|----------|-------|
| VS Code + Copilot | P2 | Single instructions file |
| VS Code + Cline | P2 | Extension-specific |
| VS Code + Continue | P3 | Extension-specific |
| Zed | P3 | New entrant |

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Goal**: Basic npx installer working for Claude Code

- [ ] Create `package.json` with npm configuration
- [ ] Create `tools/agileflow-npx.js` entry point
- [ ] Create `tools/cli/agileflow-cli.js` using commander
- [ ] Implement `install` command (basic)
- [ ] Implement `status` command
- [ ] Restructure content into `src/core/`
- [ ] Create manifest system for version tracking
- [ ] Test: `npx agileflow install` works locally

**Deliverables**:
- Working `npx agileflow install` for Claude Code
- Version tracking via manifest

### Phase 2: Multi-IDE Support (Week 2-3)

**Goal**: Support Cursor and Windsurf

- [ ] Create base IDE installer class
- [ ] Implement Claude Code installer
- [ ] Implement Cursor installer (`.mdc` format)
- [ ] Implement Windsurf installer
- [ ] Add IDE auto-detection
- [ ] Add IDE selection prompt
- [ ] Implement `update` command
- [ ] Implement `uninstall` command

**Deliverables**:
- Claude Code, Cursor, Windsurf support
- Interactive IDE selection
- Update/uninstall commands

### Phase 3: Polish & Publish (Week 3-4)

**Goal**: Production-ready npm package

- [ ] Add interactive configuration prompts
- [ ] Implement placeholder replacement system
- [ ] Add `doctor` command for diagnostics
- [ ] Comprehensive error handling
- [ ] Write npm package README
- [ ] Set up npm publishing workflow
- [ ] Publish to npm registry
- [ ] Test installation in fresh environments

**Deliverables**:
- Published npm package `agileflow`
- `npx agileflow@latest install` works globally

### Phase 4: Website & Documentation (Week 4-6)

**Goal**: Landing page + Fumadocs documentation on Vercel

#### 4a: Fumadocs Setup
- [ ] Create `/website/` directory
- [ ] Initialize Fumadocs: `npm create fumadocs-app`
- [ ] Configure `source.config.ts` for content structure
- [ ] Set up navigation in `meta.json` files
- [ ] Create base documentation structure

#### 4b: Documentation Content
- [ ] Write installation guide (`getting-started/installation.mdx`)
- [ ] Write quick start guide (`getting-started/quick-start.mdx`)
- [ ] Write IDE-specific guides (Claude Code, Cursor, Windsurf)
- [ ] Write command reference (41 commands)
- [ ] Write agent reference (26 agents)
- [ ] Write skill reference (23 skills)
- [ ] Write advanced guides (customization, troubleshooting)

#### 4c: Landing Page
- [ ] Create custom `app/page.tsx` (not Fumadocs)
- [ ] Build Hero section with terminal animation
- [ ] Build IDE showcase section
- [ ] Build features grid
- [ ] Build "How it works" section
- [ ] Build footer with CTA
- [ ] Add responsive design

#### 4d: Deployment
- [ ] Connect repo to Vercel
- [ ] Configure build settings (root: `website`)
- [ ] Test deployment
- [ ] Configure custom domain (optional)
- [ ] Set up analytics (optional)

**Deliverables**:
- Live website at `agileflow.vercel.app` (or custom domain)
- Landing page with marketing content
- Full documentation with Fumadocs

### Phase 5: Cleanup (Week 6-7)

**Goal**: Remove old plugin system

- [ ] Remove `.claude-plugin/` directory
- [ ] Update all documentation
- [ ] Update CLAUDE.md
- [ ] Archive or redirect old plugin references
- [ ] Announce migration to users

**Deliverables**:
- Clean repository without plugin artifacts
- Migration announcement

---

## File Structure Changes

### Files to Create

```
NEW FILES:
├── package.json
├── package-lock.json
├── .npmignore
├── tools/
│   ├── agileflow-npx.js
│   └── cli/
│       ├── agileflow-cli.js
│       ├── commands/
│       │   ├── install.js
│       │   ├── status.js
│       │   ├── update.js
│       │   ├── uninstall.js
│       │   └── doctor.js
│       ├── installers/
│       │   ├── core/
│       │   │   ├── installer.js
│       │   │   ├── detector.js
│       │   │   ├── manifest.js
│       │   │   └── config-collector.js
│       │   └── ide/
│       │       ├── _base-ide.js
│       │       ├── manager.js
│       │       ├── claude-code.js
│       │       ├── cursor.js
│       │       └── windsurf.js
│       └── lib/
│           ├── ui.js
│           ├── config.js
│           ├── file-ops.js
│           └── placeholders.js
└── src/
    └── core/
        ├── _module-config/
        │   └── install-config.yaml
        ├── agents/           # Move from /agents/
        ├── commands/         # Move from /commands/
        ├── skills/           # Move from /skills/
        └── templates/        # Move from /templates/
```

### Files to Delete

```
DELETE:
├── .claude-plugin/           # Entire directory
│   ├── plugin.json
│   └── marketplace.json
```

### Files to Move

```
MOVE:
/agents/     → /src/core/agents/
/commands/   → /src/core/commands/
/skills/     → /src/core/skills/
/templates/  → /src/core/templates/
```

---

## CLI Commands

### `npx agileflow install`

```
$ npx agileflow install

   _____         _ __    ________
  /  _  \   ____/  |  \_/   __   \
 /  /_\  \ / ___\  |  |\____    /____  _  __
/    |    \/  /_/  |__|   /    /  \  \/ \/ /
\____|____/\_____/____/  /____/    \__/\__/

AgileFlow v3.0.0 - AI-Driven Agile Development

? Where would you like to install AgileFlow? (.)
? Select your IDE(s): (Use arrow keys, space to select)
  ◉ Claude Code
  ◯ Cursor
  ◯ Windsurf
  ◯ VS Code + Copilot

? What should agents call you? Developer

Installing AgileFlow...
  ✓ Created .agileflow/ directory
  ✓ Installed 26 agents
  ✓ Installed 41 commands
  ✓ Installed 23 skills
  ✓ Configured Claude Code

✨ Installation complete!

Get started:
  • Open your IDE and use /AgileFlow:help
  • Run 'npx agileflow status' to check installation
  • Run 'npx agileflow update' to get updates
```

### `npx agileflow status`

```
$ npx agileflow status

📊 AgileFlow Installation Status

Location:     /path/to/project/.agileflow
Version:      3.0.0
Installed:    2025-12-08

Core:         ✓ Installed
  • 26 agents
  • 41 commands
  • 23 skills

Configured IDEs:
  ✓ Claude Code (.claude/commands/agileflow/)
  ✓ Cursor (.cursor/rules/agileflow/)

Update available: 3.1.0 (run 'npx agileflow update')
```

### `npx agileflow update`

```
$ npx agileflow update

Checking for updates...
  Current: 3.0.0
  Latest:  3.1.0

? Update to v3.1.0? (Y/n) Y

Updating AgileFlow...
  ✓ Updated core agents
  ✓ Updated commands
  ✓ Preserved user configuration
  ✓ Rebuilt IDE configurations

✨ Update complete! (3.0.0 → 3.1.0)
```

### `npx agileflow uninstall`

```
$ npx agileflow uninstall

? Are you sure you want to uninstall AgileFlow? (y/N) y

Removing AgileFlow...
  ✓ Removed .agileflow/
  ✓ Removed .claude/commands/agileflow/
  ✓ Removed .cursor/rules/agileflow/

AgileFlow has been uninstalled.
```

### `npx agileflow doctor`

```
$ npx agileflow doctor

🔍 AgileFlow Diagnostics

Environment:
  ✓ Node.js v20.9.0 (required: >=18.0.0)
  ✓ npm v10.1.0

Installation:
  ✓ .agileflow/ exists
  ✓ manifest.yaml valid
  ✓ Core agents: 26 files
  ✓ Commands: 41 files
  ✓ Skills: 23 files

IDE Configurations:
  ✓ Claude Code: Valid
  ⚠ Cursor: 2 missing files (run 'npx agileflow update')
  ✓ Windsurf: Valid

No critical issues found.
```

---

## Website & Documentation Plan

### Architecture Overview

```
agileflow.dev (or similar)
├── /                    # Landing page (marketing, features, hero)
├── /docs/               # Fumadocs documentation
├── /changelog/          # Version history
└── /blog/ (optional)    # Future: announcements, tutorials
```

### Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | Next.js 14+ (App Router) | Required by Fumadocs |
| Documentation | Fumadocs UI | MDX-based docs |
| Landing Page | Custom Next.js pages | Hero, features, CTA |
| Styling | Tailwind CSS | Comes with Fumadocs |
| Hosting | Vercel | Free tier, automatic deploys |
| Domain | `agileflow.dev` (TBD) | Or use Vercel subdomain initially |

### Fumadocs Setup

```bash
# Initialize (requires Node.js 20+)
npm create fumadocs-app

# Development
npm run dev
# → http://localhost:3000/docs
```

### Site Structure

```
website/                       # or /docs-site/ in main repo
├── app/
│   ├── page.tsx              # Landing page (custom)
│   ├── layout.tsx            # Root layout
│   ├── docs/
│   │   └── [[...slug]]/
│   │       └── page.tsx      # Fumadocs dynamic route
│   ├── changelog/
│   │   └── page.tsx          # Changelog page
│   └── globals.css
├── content/
│   └── docs/                 # MDX documentation files
│       ├── index.mdx         # Docs home
│       ├── meta.json         # Navigation structure
│       ├── getting-started/
│       │   ├── meta.json
│       │   ├── installation.mdx
│       │   ├── quick-start.mdx
│       │   └── ide-guides/
│       │       ├── claude-code.mdx
│       │       ├── cursor.mdx
│       │       └── windsurf.mdx
│       ├── commands/
│       │   ├── meta.json
│       │   ├── index.mdx
│       │   └── [individual commands...]
│       ├── agents/
│       │   ├── meta.json
│       │   ├── index.mdx
│       │   └── [individual agents...]
│       ├── skills/
│       └── advanced/
│           ├── customization.mdx
│           ├── troubleshooting.mdx
│           └── contributing.mdx
├── components/
│   ├── landing/              # Landing page components
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── ide-showcase.tsx
│   │   ├── testimonials.tsx
│   │   └── cta.tsx
│   └── ui/                   # Shared UI components
├── lib/
│   └── source.ts             # Fumadocs source config
├── public/
│   ├── logo.svg
│   ├── og-image.png
│   └── screenshots/
├── source.config.ts          # Fumadocs config
├── next.config.mjs
├── tailwind.config.js
└── package.json
```

### Landing Page Sections

1. **Hero**
   - Tagline: "AI-Driven Agile Development"
   - Subtitle: "41 commands, 26 agents, 23 skills for Claude Code, Cursor, and Windsurf"
   - CTA: "Get Started" → `/docs/getting-started/installation`
   - Terminal animation showing `npx agileflow install`

2. **IDE Support**
   - Visual showcase of supported IDEs
   - Claude Code, Cursor, Windsurf logos
   - "One install, all your IDEs"

3. **Features Grid**
   - Epic planning
   - Story management
   - Sprint automation
   - CI/CD integration
   - Architecture decisions
   - Documentation sync

4. **How It Works**
   - Step 1: Install via npx
   - Step 2: Choose your IDE
   - Step 3: Start building

5. **Command Showcase**
   - Interactive demo or GIF
   - Key commands highlighted

6. **Footer CTA**
   - "Ready to supercharge your workflow?"
   - Install command
   - Links to docs, GitHub, changelog

### Repository Strategy

**Recommended**: Same repo, `/website/` directory

```
AgileFlow/
├── src/                  # npm package source
├── tools/                # CLI tools
├── website/              # Landing page + Fumadocs
│   ├── app/
│   ├── content/
│   └── package.json      # Separate package.json for website
├── package.json          # Main package.json for CLI
└── ...
```

**Why same repo?**
- Version sync is automatic
- Single PR updates code + docs
- Easier for contributors
- Vercel can deploy from subdirectory

**Vercel Configuration**:
- Root Directory: `website`
- Build Command: `npm run build`
- Output Directory: `.next`

### Deployment Workflow

```yaml
# .github/workflows/deploy-website.yml (optional, Vercel auto-deploys)
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'website/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./website
```

---

## Migration Checklist

### Pre-Migration

- [ ] Document all current plugin users (if possible)
- [ ] Create migration announcement draft
- [ ] Reserve npm package name `agileflow`
- [ ] Set up npm organization/account

### During Migration

- [ ] Implement Phase 1-3 (see above)
- [ ] Test in multiple environments
- [ ] Write migration guide for existing users

### Post-Migration

- [ ] Publish npm package
- [ ] Remove `.claude-plugin/` directory
- [ ] Update README with new installation method
- [ ] Announce on relevant channels
- [ ] Monitor npm downloads and issues

---

## Risk Assessment

### Low Risk

| Risk | Mitigation |
|------|------------|
| npm name taken | Check availability early; alternatives: `@agileflow/cli`, `agileflow-dev` |
| Breaking existing users | Clear migration guide; support period |

### Medium Risk

| Risk | Mitigation |
|------|------------|
| IDE format changes | Abstract behind base class; monitor IDE changelogs |
| Complex installer bugs | Thorough testing; `doctor` command for diagnostics |

### High Risk

| Risk | Mitigation |
|------|------------|
| Maintenance burden | Well-structured code; good documentation; tests |
| Low adoption | Marketing; documentation; community building |

---

## Open Questions

### Decisions Needed

| # | Question | Options | Recommendation |
|---|----------|---------|----------------|
| 1 | **npm package name** | `agileflow`, `@agileflow/cli`, `agileflow-cli` | `agileflow` (simple, memorable) |
| 2 | **npm account** | Personal or organization | Organization (`@agileflow`) for future |
| 3 | **License** | Current or MIT | MIT (npm standard) |
| 4 | **Version number** | v3.0.0 or v1.0.0 | v1.0.0 (fresh start, npm is new product) |
| 5 | **Domain** | `agileflow.dev`, `agileflow.io`, Vercel subdomain | Start with Vercel subdomain, buy domain later |
| 6 | **Branding** | Keep "AgileFlow" or rebrand | Keep AgileFlow |
| 7 | **GitHub org** | Current or new organization | Consider `agileflow-dev` org |

### Domain Options

| Domain | Availability | Price/year | Notes |
|--------|--------------|------------|-------|
| `agileflow.dev` | Check | ~$12-15 | Developer-focused TLD |
| `agileflow.io` | Check | ~$30-50 | Tech startup feel |
| `agileflow.sh` | Check | ~$10-15 | CLI tool feel |
| `getagileflow.com` | Check | ~$12 | Action-oriented |
| Vercel subdomain | Available | Free | `agileflow.vercel.app` |

**Recommendation**: Start with `agileflow.vercel.app`, buy domain once traction proven.

### Research Needed

1. **Cursor `.mdc` format** - Verify MDC specification and metadata headers
2. **Windsurf workflow format** - Confirm frontmatter requirements
3. **VS Code Copilot** - Single instructions file limitations
4. **npm publishing** - Best practices for CI/CD, provenance, 2FA
5. **Fumadocs** - Custom landing page integration with docs
6. **Vercel** - Monorepo deployment configuration

---

## References

- [BMAD-METHOD Repository](https://github.com/bmad-code-org/BMAD-METHOD)
- [Fumadocs Documentation](https://fumadocs.dev)
- [npm Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Commander.js](https://github.com/tj/commander.js)
- [Inquirer.js](https://github.com/SBoudrias/Inquirer.js)

---

## Appendix: BMAD IDE Installer Patterns

### Claude Code Installer Pattern

```javascript
// .claude/commands/agileflow/command-name.md
class ClaudeCodeSetup extends BaseIdeSetup {
  constructor() {
    super('claude-code', 'Claude Code', true);
    this.configDir = '.claude';
    this.commandsDir = 'commands';
  }

  async setup(projectDir, agileflowDir, options) {
    // Create .claude/commands/agileflow/
    // Copy command launchers as .md files
    // Commands are invoked via /agileflow:command-name
  }
}
```

### Cursor Installer Pattern

```javascript
// .cursor/rules/agileflow/rule-name.mdc
class CursorSetup extends BaseIdeSetup {
  constructor() {
    super('cursor', 'Cursor', true);
    this.configDir = '.cursor';
    this.rulesDir = 'rules';
  }

  async setup(projectDir, agileflowDir, options) {
    // Create .cursor/rules/agileflow/
    // Copy rules as .mdc files with MDC metadata header
    // Rules are auto-activated based on file patterns
  }
}
```

### Windsurf Installer Pattern

```javascript
// .windsurf/workflows/agileflow/workflow-name.md
class WindsurfSetup extends BaseIdeSetup {
  constructor() {
    super('windsurf', 'Windsurf', true);
    this.configDir = '.windsurf';
    this.workflowsDir = 'workflows';
  }

  async setup(projectDir, agileflowDir, options) {
    // Create .windsurf/workflows/agileflow/
    // Copy workflows as .md files with frontmatter
    // Workflows appear in Windsurf workflow menu
  }
}
```

---

*Document version: 1.0*
*Last updated: 2025-12-08*
