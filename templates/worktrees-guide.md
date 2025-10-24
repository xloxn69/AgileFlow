# Git Worktrees with AgileFlow

Git worktrees allow you to work on multiple branches simultaneously in separate directories. This is perfect for isolating experimental work, handling urgent hotfixes during feature development, or comparing different architectural approaches—all without losing your AI context with Claude Code.

## What Are Git Worktrees?

Git worktrees let you check out multiple branches into separate physical directories, all linked to the same repository. Think of it as having multiple "copies" of your project, each on a different branch, without the overhead of multiple clones.

**Key Benefits:**
- **Context Preservation**: Each directory maintains its own `/babysit` session with full AI context
- **Zero Context Switching**: No need to `git stash` and re-explain your work to Claude
- **Safe Isolation**: Experiment with risky changes without affecting your main work
- **Instant Availability**: Your main work stays exactly as you left it

## ✅ GOOD Use Cases

### 1. Critical Hotfix During Feature Development

**Scenario:** You're deep in feature work when a production bug needs immediate attention.

```bash
# You're 2 hours into building a dashboard, Claude has full context
~/myapp/
/babysit "Build analytics dashboard with charts and filters"

# URGENT: Production authentication is broken!
# Create hotfix worktree in 10 seconds
git worktree add ../myapp-hotfix hotfix/auth-bug
code ../myapp-hotfix    # Opens in NEW window

# In hotfix window - fresh babysit session
cd ../myapp-hotfix
/babysit "Fix authentication 500 error in src/auth/login.ts"

# Babysit reads CLAUDE.md, understands architecture, fixes bug
# Creates PR, merges to main

# Close hotfix window, remove worktree
cd ~/myapp
git worktree remove ../myapp-hotfix

# Back to ORIGINAL window - Claude still remembers everything!
"Continue building the dashboard" → Claude picks up exactly where you left off
```

**Time Saved:** 25+ minutes of context switching

### 2. Comparing Architectural Approaches

**Scenario:** You need to evaluate GraphQL vs REST before committing to one.

```bash
# Test GraphQL implementation
git worktree add ../myapp-graphql experiment/graphql-api
cd ../myapp-graphql
/babysit "Implement user API using GraphQL with Apollo Server"

# Test REST implementation
git worktree add ../myapp-rest experiment/rest-api
cd ../myapp-rest
/babysit "Implement user API using Express REST endpoints"

# Compare: Performance, DX, bundle size, complexity
# Merge the winner, delete the loser

cd ~/myapp
git merge experiment/graphql-api  # Or experiment/rest-api
git worktree remove ../myapp-graphql ../myapp-rest
```

### 3. Safe Testing of Risky Refactors

```bash
# Keep main work safe
~/myapp/ → /babysit "Continue building features on stable codebase"

# Test risky migration in isolation
git worktree add ../myapp-ts-migration experiment/typescript
cd ../myapp-ts-migration
/babysit "Migrate entire codebase from JavaScript to TypeScript"

# If migration succeeds → merge
# If it fails catastrophically → delete worktree (no git history pollution)
git worktree remove ../myapp-ts-migration
```

## ⚠️ CRITICAL LIMITATIONS

### DO NOT Run Multiple Babysits on the Same Epic

AgileFlow's status.json and bus/log.jsonl are **file-based** (docs-as-code philosophy). Multiple processes writing the same file simultaneously can cause:
- **Lost status updates** (read-modify-write race condition)
- **Corrupted JSON** (incomplete writes)
- **Inconsistent agent coordination** (message bus conflicts)

**❌ WRONG - Concurrent Edits:**
```bash
# Worktree 1
cd ~/myapp-feature-a
/babysit "Work on EP-001: User Authentication"
# Updates status.json: US-001 → in-progress

# Worktree 2 (SIMULTANEOUSLY)
cd ~/myapp-feature-b
/babysit "Work on EP-001: User Authentication"
# Updates status.json: US-002 → in-progress

# RESULT: Race condition! One update may be lost! ❌
```

**✅ CORRECT - Isolated Epics:**
```bash
# Worktree 1: Epic isolation
cd ~/myapp-auth
/babysit "Work on EP-001: User Authentication"

# Worktree 2: DIFFERENT epic
cd ~/myapp-payment
/babysit "Work on EP-002: Payment System"

# Different epics → different story files → no conflicts ✅
```

### The Golden Rule

**Use worktrees for ISOLATION, not PARALLEL EXECUTION.**

## Quick Start Guide

### Using the Helper Script

```bash
# Easier method (handles naming, branch creation, guidance)
./scripts/worktree-create.sh new-feature

# Opens automatically with instructions
```

### Manual Method

```bash
# Create worktree for new feature
git worktree add ../myapp-new-feature -b feature/new-feature main

# Open in new editor window
code ../myapp-new-feature

# Start babysit
cd ../myapp-new-feature
/babysit
```

### Cleaning Up a Worktree

```bash
# After merging your feature
cd ~/myapp
git merge feature/new-feature

# Remove the worktree
git worktree remove ../myapp-new-feature

# Delete the branch (optional)
git branch -d feature/new-feature
```

## Best Practices

1. **Use Descriptive Names** - `myapp-auth-refactor` not `myapp-1`
2. **One Epic Per Worktree** - Keep work streams completely separate
3. **Clean Up Merged Worktrees** - Run `git worktree remove` regularly
4. **Don't Share Dependencies** - Each worktree should have its own `node_modules/`, `.venv/`, etc.
5. **Keep Main Worktree Stable** - Use main for stable work, worktrees for experiments

## Integration with AgileFlow

### Message Bus Coordination

AgileFlow's message bus (`docs/09-agents/bus/log.jsonl`) is shared across all worktrees. The bus is append-only (JSONL), so concurrent appends are generally safe. However, **status.json** uses read-modify-write, so avoid concurrent edits to the same stories.

### GitHub & Notion Sync

If you have GitHub or Notion MCP integration enabled, each worktree can sync independently. Both updates go to the same GitHub repo/Notion workspace (shared .git).

## Troubleshooting

### "fatal: 'branch' is already checked out"

```bash
# Find where branch is checked out
git worktree list

# Remove the conflicting worktree
git worktree remove /path/to/conflicting/worktree
```

### Disk space issues

```bash
# Use pnpm for automatic dependency deduplication
pnpm install  # Shares packages across worktrees

# Or use shared conda environment (Python)
conda create -n myapp-shared python=3.11
conda activate myapp-shared  # Use in all worktrees
```

### Forgotten worktrees

```bash
# List all worktrees
git worktree list

# Remove unused worktrees
git worktree remove ../myapp-old-experiment

# Auto-prune deleted worktrees
git worktree prune
```

## Summary

**Git worktrees with AgileFlow provide:**
- ✅ Zero context switching - preserve AI understanding
- ✅ Safe isolation - experiment without risk
- ✅ Fast hotfixes - handle urgent work without losing flow
- ✅ Side-by-side comparison - test alternatives in parallel

**Remember:**
- Use worktrees for **ISOLATION**, not **PARALLEL EXECUTION**
- Avoid concurrent edits to the same epic/stories
- Clean up merged worktrees regularly
- Each worktree should work on different features/epics

**Happy coding with preserved context!** 🚀
