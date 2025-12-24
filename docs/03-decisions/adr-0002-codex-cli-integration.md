# ADR-0002: OpenAI Codex CLI Integration Strategy

**Status**: Accepted
**Date**: 2025-12-24
**Decision Makers**: Development Team
**Research**: See [OpenAI Codex CLI Integration Research](../10-research/20251224-openai-codex-cli-integration.md)

## Context

AgileFlow currently supports three IDEs/CLI tools:
- Claude Code (primary, via `.claude/commands/`)
- Cursor (via `.cursorrules`)
- Windsurf (via windsurf config)

OpenAI released Codex CLI, a terminal-based coding agent that's gaining adoption. Users have requested AgileFlow support for Codex CLI to maintain workflow consistency across tools.

### Codex CLI Extension Model

Codex CLI doesn't have a traditional plugin API. Instead, it offers:
1. **Skills** - Directory modules with `SKILL.md` (closest to our agents)
2. **Custom Prompts** - Markdown templates (closest to our slash commands)
3. **AGENTS.md** - Project-level instructions (equivalent to CLAUDE.md)
4. **Profiles** - Config bundles for switching modes
5. **MCP Servers** - Tool integration via Model Context Protocol

## Decision

**We will implement Codex CLI support using a Skills-first approach with complementary prompts and AGENTS.md scaffolding.**

### Mapping Strategy

| AgileFlow Component | Codex Implementation |
|--------------------|---------------------|
| 26 Agents | `.codex/skills/agileflow-*/SKILL.md` (per-repo) |
| 41 Slash Commands | `~/.codex/prompts/agileflow-*.md` (per-user) |
| CLAUDE.md | `AGENTS.md` at repo root |
| Hooks | Not directly supported; document workarounds |

### Why Skills-First?

1. **Native module system**: Skills are Codex's official way to package specialized behaviors
2. **Per-repo distribution**: Skills in `.codex/skills/` are versionable and shareable via git
3. **Discoverability**: Users can invoke skills with `$skill-name` or list via `/skills`
4. **Asset support**: Skills can include scripts, references, and assets

## Options Considered

### Option 1: Prompts-Only
Map all AgileFlow commands and agents to custom prompts in `~/.codex/prompts/`.

**Pros**: Simple, single location
**Cons**: No per-repo sharing, loses agent specialization structure

### Option 2: Skills-First (Selected)
Map agents to skills (per-repo), commands to prompts (per-user).

**Pros**: Proper separation, versionable, follows Codex conventions
**Cons**: Two install locations, more complex installer

### Option 3: AGENTS.md-Only
Put everything in a comprehensive AGENTS.md file.

**Pros**: Simplest, single file
**Cons**: Doesn't scale, no modularity, poor UX

### Option 4: External Orchestrator
Use `codex exec` from AgileFlow as subprocess runner.

**Pros**: Full control
**Cons**: Complex, different UX, not native

## Consequences

### Positive
- Users get familiar AgileFlow workflows in Codex CLI
- Skills are shareable via git (team consistency)
- Follows official Codex extension patterns
- Clear upgrade path as Codex evolves

### Negative
- No `/agileflow:*` command syntax (users use `$agileflow-*` or prompt names)
- Hook system not directly portable (SessionStart, PreCompact, etc.)
- Two install locations to manage (skills per-repo, prompts per-user)
- Must track Codex CLI breaking changes

### Neutral
- New installer class required (`codex.js`)
- Documentation needed for Codex-specific invocation patterns
- AGENTS.md coexists with CLAUDE.md (both supported)

## Implementation

See [EP-0003: Codex CLI Support](../05-epics/EP-0003-codex-cli-support.md) for detailed stories.

### Key Files to Create
- `packages/cli/tools/cli/installers/ide/codex.js` - Installer class
- Skill templates for each agent
- Prompt templates for each command
- AGENTS.md generator

## References

- [OpenAI Codex CLI Integration Research](../10-research/20251224-openai-codex-cli-integration.md)
- [Codex CLI Documentation](https://developers.openai.com/codex/)
- [Codex Skills Guide](https://developers.openai.com/codex/skills/)
- [AGENTS.md Standard](https://agents.md/)
