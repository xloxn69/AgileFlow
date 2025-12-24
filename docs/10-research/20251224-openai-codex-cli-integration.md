# OpenAI Codex CLI Integration for AgileFlow

**Research Date**: 2025-12-24
**Topic**: How to implement slash commands and agents for AgileFlow compatibility with OpenAI Codex CLI
**Status**: Complete - Ready for implementation

## Summary

Codex CLI is highly configurable via global `~/.codex/config.toml` and project-level `AGENTS.md` files. It's extendable through custom prompts, skills (`SKILL.md`), MCP servers, and execpolicy rule files—not a traditional plugin API.

**Key Mapping Strategy:**
- AgileFlow **slash commands** → Codex **custom prompts** (`~/.codex/prompts/`)
- AgileFlow **agents** → Codex **skills** (`.codex/skills/` per-repo or `~/.codex/skills/` per-user)
- AgileFlow **CLAUDE.md** → Codex **AGENTS.md** (with fallback support for CLAUDE.md)
- AgileFlow **hooks** → No direct equivalent; use `codex exec`, notifications, or MCP

## Key Findings

### Codex CLI Architecture

| Component | Location | Purpose |
|-----------|----------|---------|
| Config home | `~/.codex/` (or `$CODEX_HOME`) | Global configuration directory |
| Main config | `~/.codex/config.toml` | Core settings, profiles, MCP, sandbox |
| Project instructions | `AGENTS.md` at repo root | Per-project guidance (like CLAUDE.md) |
| Custom prompts | `~/.codex/prompts/*.md` | Reusable command templates |
| Skills (per-user) | `~/.codex/skills/*/SKILL.md` | User-level agent modules |
| Skills (per-repo) | `.codex/skills/*/SKILL.md` | Project-level agent modules |
| Exec policies | `~/.codex/rules/*.rules` | Command allowlisting |

### Extension Points (No Plugin API)

Codex CLI doesn't have a plugin API like VSCode. Instead, customization uses:
1. **Custom prompts** - Markdown templates for reusable "commands"
2. **Skills** - Directory modules with `SKILL.md` + optional scripts/assets
3. **AGENTS.md** - Project-level instructions (discovered recursively)
4. **Profiles** - Config bundles for switching modes
5. **MCP servers** - Tool integration via Model Context Protocol
6. **Execpolicy** - Rule files for command allowlisting

### Feature Comparison

| Feature | Claude Code | Codex CLI |
|---------|-------------|-----------|
| Config directory | `.claude/` | `~/.codex/` (or `$CODEX_HOME`) |
| Commands location | `.claude/commands/` | `~/.codex/prompts/` (custom prompts) |
| System prompt file | `CLAUDE.md` | `AGENTS.md` / `AGENTS.override.md` |
| Hooks support | Yes (SessionStart, etc.) | No direct hooks; use notifications/exec/MCP |
| Agent spawning | Yes (Task tool) | No; emulate with Skills + Profiles |
| Sandboxing | Permission system | `sandbox_mode` + `approval_policy` |

## Implementation Approach

### Directory Structure for AgileFlow + Codex

```
project-root/
├── AGENTS.md                          # Project instructions (AgileFlow conventions)
├── .codex/
│   └── skills/
│       ├── agileflow-api/
│       │   └── SKILL.md               # API agent as skill
│       ├── agileflow-database/
│       │   └── SKILL.md               # Database agent as skill
│       ├── agileflow-ui/
│       │   └── SKILL.md               # UI agent as skill
│       └── ... (26 agents total)

~/.codex/
├── config.toml                        # Global config with AgileFlow profile
├── prompts/
│   ├── agileflow-board.md             # /board command as prompt
│   ├── agileflow-sprint.md            # /sprint command as prompt
│   └── ... (41 commands total)
└── skills/                            # Optional: user-level skills
```

### Step-by-Step Integration Plan

1. **Create `codex.js` installer class** (mirrors `claude-code.js`)
   - Detect Codex CLI installation
   - Find Codex home (`~/.codex` or `$CODEX_HOME`)
   - Write prompts to `~/.codex/prompts/`
   - Write skills to `.codex/skills/` (per-repo)

2. **Map AgileFlow agents → Codex skills**
   - Each agent becomes a skill directory
   - `SKILL.md` contains YAML frontmatter + instructions
   - Optional `scripts/` directory for tooling

3. **Map AgileFlow commands → Codex prompts**
   - Each command becomes a prompt template
   - Use `{{input}}` placeholder for context
   - Flat directory structure (no subdirs confirmed)

4. **Generate AGENTS.md scaffolding**
   - Project conventions and test commands
   - "When to use skills" guidance
   - Support for `AGENTS.override.md` in subdirectories

5. **Configure secure defaults**
   - Recommend `approval_policy` and `sandbox_mode`
   - Document execpolicy rules location

## Code Snippets

### Minimal `~/.codex/config.toml`

```toml
# ~/.codex/config.toml

model = "gpt-5-codex"
approval_policy = "on-request"
sandbox_mode = "workspace-write"

# Support CLAUDE.md during migration to AGENTS.md
project_doc_fallback_filenames = ["CLAUDE.md"]

# AgileFlow profile for deep review mode
[profiles.agileflow-review]
model_reasoning_effort = "high"
approval_policy = "never"
```

### Custom Prompt Template (Command → Prompt)

```markdown
# ~/.codex/prompts/agileflow-board.md

# AgileFlow: Kanban Board

You are AgileFlow running inside Codex CLI.
Use the repo's AGENTS.md as the source of truth.

Task:
- Display the current kanban board from docs/09-agents/status.json
- Show stories grouped by status (backlog, ready, in-progress, review, done)
- Highlight blocked items and WIP limits

Context:
{{input}}
```

### Skill Definition (Agent → Skill)

```markdown
# .codex/skills/agileflow-database/SKILL.md

---
name: agileflow-database
description: Database specialist for schema design, migrations, and query optimization
version: 1.0.0
---

# AgileFlow Database Agent

You are a database specialist agent. Your expertise includes:
- Schema design and normalization
- Migration strategies (zero-downtime)
- Query optimization and indexing
- Data modeling best practices

## When to Use
- Schema changes or new tables
- Migration scripts
- Query performance issues
- Database architecture decisions

## Instructions
1. Read existing schema files first
2. Follow project conventions in AGENTS.md
3. Generate migrations with rollback support
4. Consider indexing for all foreign keys
```

### AGENTS.md Template

```markdown
# AGENTS.md

# AgileFlow + Codex Instructions

## Project Commands
- Unit tests: `npm test`
- Lint: `npm run lint`
- Build: `npm run build`

## Conventions
- Prefer running tests before claiming success
- Keep changes small and reviewable
- Use AgileFlow skills when relevant

## When to Use Skills
- Architecture decisions → use `$agileflow-adr-writer`
- Database work → use `$agileflow-database`
- API endpoints → use `$agileflow-api`
- UI components → use `$agileflow-ui`
- CI/CD setup → use `$agileflow-ci`

## AgileFlow Status
- Stories tracked in: `docs/09-agents/status.json`
- Research notes in: `docs/10-research/`
- Architecture decisions in: `docs/03-decisions/`
```

## Security Considerations

- **Approval controls**: `approval_policy` controls when Codex asks before running commands
- **Sandboxing**: `sandbox_mode` controls filesystem/network access for commands
- **Execpolicy allowlisting**: Rules in `~/.codex/rules/*.rules` whitelist specific commands
- **Enterprise governance**: `managed_config.toml` can enforce organization policies

### Recommended Secure Defaults

```toml
# Recommended for AgileFlow
approval_policy = "on-request"  # Ask before destructive actions
sandbox_mode = "workspace-write"  # Limit to project directory
```

## Risks & Gotchas

1. **Feature maturity drift**: Skills + execpolicy are actively evolving; expect breaking changes across Codex CLI versions
2. **No hooks parity**: Cannot replicate Claude's SessionStart, PreCompact hooks directly
3. **Prompt subdirectory support**: Not confirmed; start flat, test before nesting
4. **No agent spawning**: Must emulate with Skills + Profiles + AGENTS.md scoping
5. **Discovery UX**: Users invoke skills with `$skill-name` or `/skills`, not `/agileflow:*`

## ADR Recommendation

**Decision**: Use Skills-first integration + minimal prompts + AGENTS.md

**Rationale**:
- Skills provide the closest native "agent module" system
- Prompts provide "command-like" quick starts
- AGENTS.md provides project policy + conventions
- Aligns with official Codex guidance patterns

**Trade-offs**:
- ✅ Versionable and shareable via repo (`.codex/skills`)
- ✅ Clear mapping from AgileFlow agents → Codex skills
- ❌ No first-class `/agileflow-*` commands
- ❌ Hook parity requires workarounds (exec/MCP)

## Story Breakdown

### US-1001: Add Codex installer class
- **AC1**: New `codex.js` installer detects Codex CLI and finds Codex home
- **AC2**: Installer writes prompts to `~/.codex/prompts/` and skills to `.codex/skills/`
- **AC3**: Follows existing installer pattern (`_base-ide.js`)

### US-1002: Map AgileFlow agents → Codex skills
- **AC1**: Each AgileFlow agent produces a Codex skill folder with `SKILL.md`
- **AC2**: Skills discoverable via `/skills` command
- **AC3**: Skill metadata includes name, description, version

### US-1003: Map AgileFlow commands → Codex prompts
- **AC1**: Each slash command has a prompt template file
- **AC2**: Prompts use `{{input}}` placeholder for context
- **AC3**: Documentation explains invocation in Codex sessions

### US-1004: Provide secure defaults + execpolicy guidance
- **AC1**: Docs include recommended `approval_policy` + `sandbox_mode`
- **AC2**: Docs explain execpolicy rules and `codex execpolicy check`

### US-1005: Add AGENTS.md scaffolding
- **AC1**: Installer generates repo-root `AGENTS.md` with AgileFlow conventions
- **AC2**: Supports directory overrides with `AGENTS.override.md`

### US-1006: Add cleanup/rollback support
- **AC1**: Uninstall removes `~/.codex/prompts/agileflow-*`
- **AC2**: Uninstall removes `.codex/skills/agileflow-*`
- **AC3**: Does not touch user's `config.toml` unless explicitly requested

## Rollback Plan

1. **Uninstall prompts**: Delete `~/.codex/prompts/agileflow-*`
2. **Uninstall per-user skills**: Delete `~/.codex/skills/agileflow-*` (if used)
3. **Uninstall per-repo skills**: Delete `.codex/skills/agileflow-*` and remove from git
4. **Revert AGENTS.md**: Restore previous or remove if installer-generated
5. **Config cleanup**: Only remove `[profiles.agileflow]` block if added

## References

- [Configuring Codex](https://developers.openai.com/codex/local-config/) - Accessed 2025-12-24
- [Custom instructions with AGENTS.md](https://developers.openai.com/codex/guides/agents-md/) - Accessed 2025-12-24
- [Introducing Codex](https://openai.com/index/introducing-codex/) - Published 2025-05-16
- [AGENTS.md Standard](https://agents.md/) - Accessed 2025-12-24
- [Agent Skills Overview](https://developers.openai.com/codex/skills/) - Accessed 2025-12-24
- [Create Custom Skills](https://developers.openai.com/codex/skills/create-skill/) - Accessed 2025-12-24
- [Codex CLI Reference](https://developers.openai.com/codex/cli/reference/) - Accessed 2025-12-24
- [Codex Security Guide](https://developers.openai.com/codex/security/) - Accessed 2025-12-24
- [openai/codex GitHub Repository](https://github.com/openai/codex) - Accessed 2025-12-24
