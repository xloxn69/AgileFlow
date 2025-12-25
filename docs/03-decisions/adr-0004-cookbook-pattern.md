# ADR-0004: Cookbook Pattern for Progressive Disclosure in Skills

**Status**: Proposed
**Date**: 2025-12-25
**Decision Makers**: Development Team
**Research**: [Building Claude Code Skills From Scratch](../10-research/20251225-building-claude-code-skills-from-scratch.md)

---

## Context

AgileFlow skills currently embed all instructions directly in the SKILL.md file. As skills grow in capability (supporting multiple tools, platforms, or modes), this creates problems:

- **Prompt bloat**: SKILL.md becomes too large, consuming valuable context window
- **Irrelevant information loaded**: Agent sees instructions for features it won't use
- **Maintenance difficulty**: Hard to update one use case without affecting others
- **Poor separation of concerns**: All logic crammed into one file

### Research Foundation

Based on research from IndyDevDan's skill-building tutorial, we identified the **Cookbook Pattern** - a progressive disclosure approach where:
- Main skill file (SKILL.md) contains routing logic only
- Detailed instructions live in separate "cookbook" files
- Agent loads only relevant cookbook based on user's request
- Variables enable/disable features at the skill level

See: `docs/10-research/20251225-building-claude-code-skills-from-scratch.md`

---

## Decision

**Adopt the Cookbook Pattern for AgileFlow skills that support multiple use cases.**

### What We're Implementing

A skill architecture that conditionally loads documentation based on user requests:

```
.claude/skills/<skill-name>/
├── SKILL.md              # "Pivot file" - routing logic + variables
├── tools/                # Executable scripts
│   └── main-tool.py
├── prompts/              # Reusable prompt templates
│   └── summary-template.md
└── cookbook/             # Per-use-case documentation
    ├── use-case-a.md
    ├── use-case-b.md
    └── use-case-c.md
```

### How We're Implementing It

**1. SKILL.md becomes a router:**
```markdown
# Skill Name

One sentence description.
Use when: [trigger phrases]

## Variables
- enable_feature_a: true
- enable_feature_b: true
- default_mode: "standard"

## Cookbook
Based on user's request, determine which tool to use.

### Feature A
If user requests feature A and enable_feature_a is true:
Then read and execute cookbook/feature-a.md

Examples:
- "do X with feature A"
- "use feature A to Y"

### Feature B
If user requests feature B and enable_feature_b is true:
Then read cookbook/feature-b.md

## Workflow
1. Understand user's request
2. Read appropriate cookbook file
3. Execute using tools
```

**2. Cookbook files contain detailed instructions:**
```markdown
# Feature A Instructions

## Variables
- specific_setting: value
- mode: default

## Instructions
1. Step one with details
2. Step two with details
3. Step three with details

## Examples
[Detailed examples specific to this feature]
```

**3. Tools remain independent:**
- Single-file scripts (preferably Astral UV for Python)
- Return concrete, parseable output for agents
- Handle errors explicitly with clear messages

---

## Options Considered

### Option 1: Single Monolithic SKILL.md (Current)
- All instructions in one file
- **Rejected**: Doesn't scale, wastes context on unused features

### Option 2: Multiple Independent Skills (Rejected)
- Split into separate skills per use case
- **Rejected**: Loses cohesion, duplicates common logic, harder to maintain

### Option 3: Cookbook Pattern with Progressive Disclosure (Selected)
- Router file + conditional cookbook loading
- **Selected**: Scales well, maintains cohesion, loads only what's needed

### Option 4: Include-Based System (Deferred)
- Use file includes/imports in SKILL.md
- **Deferred**: More complex, tools may not support natively

---

## Consequences

### Benefits

1. **Reduced Context Consumption**
   - Agent only loads relevant cookbook file
   - Variables section is small (~10 lines)
   - Routing logic is concise

2. **Better Maintainability**
   - Each use case isolated in its own file
   - Update one feature without touching others
   - Clear ownership of each cookbook file

3. **Improved Scalability**
   - Add new use cases by adding cookbook files
   - No changes to main SKILL.md needed
   - Feature flags control what's available

4. **Clearer Structure**
   - Developers understand skill organization at a glance
   - Consistent pattern across all complex skills
   - Easier onboarding for new contributors

5. **Conditional Features**
   - Enable/disable features via variables
   - Customize skill behavior per project
   - Support multiple tools (CLI, platforms, modes)

### Trade-offs

1. **More Files to Manage**
   - Multiple files per skill vs. single file
   - Mitigated by clear naming conventions

2. **Indirect Navigation**
   - Must follow routing to find instructions
   - Mitigated by consistent structure

3. **Duplication Risk**
   - Common instructions may appear in multiple cookbooks
   - Mitigated by extracting to prompts/ directory

4. **Agent Understanding**
   - Agent must correctly interpret routing logic
   - Mitigated by clear conditional statements

---

## Implementation Plan

### Phase 1: Pattern Documentation
- [x] Document pattern in ADR (this document)
- [x] Create research file with examples
- [ ] Add to skill development guide

### Phase 2: Pilot Implementation
- [ ] Identify 2-3 existing skills that would benefit
- [ ] Refactor to cookbook pattern
- [ ] Measure context usage before/after

### Phase 3: New Skills
- [ ] Apply pattern to all new multi-feature skills
- [ ] Create skill scaffolding command
- [ ] Update skill templates

### Phase 4: Rollout
- [ ] Retrofit remaining complex skills
- [ ] Document best practices from experience
- [ ] Consider tooling for cookbook validation

---

## Skill Selection Criteria

Apply the cookbook pattern when a skill has:
- **Multiple distinct use cases** (e.g., different tools, modes, or platforms)
- **Feature flags** (enabling/disabling capabilities)
- **Platform-specific logic** (Mac vs. Windows, CLI differences)
- **Growing instruction size** (>100 lines in SKILL.md)

Do NOT apply when:
- Skill has single, focused purpose
- Instructions are naturally short (<50 lines)
- No conditional behavior needed

---

## Example: Fork Terminal Skill

A concrete example from the research:

```
.claude/skills/fork-terminal/
├── SKILL.md                    # Routes to appropriate tool
├── tools/
│   └── fork-terminal.py        # Opens new terminal window
├── prompts/
│   └── fork-summary.md         # Context compression template
└── cookbook/
    ├── cli-command.md          # Raw CLI commands
    ├── claude-code.md          # Claude Code agent forking
    ├── gemini-cli.md           # Gemini CLI agent forking
    └── codex-cli.md            # Codex CLI agent forking
```

Each cookbook file contains:
- Model selection (fast/base/heavy)
- YOLO mode settings
- CLI-specific syntax
- Examples for that tool

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Agent ignores routing | Use clear conditional language ("If X then read...") |
| Wrong cookbook loaded | Include distinctive examples per cookbook |
| Files become inconsistent | Create cookbook template |
| Over-engineering simple skills | Apply criteria checklist before adopting |
| Variables become complex | Keep variables flat (no nesting) |

---

## Success Criteria

The Cookbook Pattern is successful if:

1. **Qualitative**
   - Skills with multiple features remain maintainable
   - New use cases can be added without touching routing
   - Agents correctly select appropriate cookbook

2. **Quantitative** (to be measured)
   - 30%+ reduction in context used per skill invocation
   - 50%+ faster to add new use case (file creation vs. editing)
   - Zero routing errors in production usage

---

## Related Documents

- [Research: Building Claude Code Skills](../10-research/20251225-building-claude-code-skills-from-scratch.md)
- [ADR-0001: Agent Expert System](./adr-0001-agent-expert-system.md)
- [Skills Directory](../../packages/cli/src/core/skills/)
