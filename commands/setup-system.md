# setup-system

Scaffold the universal agile/docs-as-code system for this repository.

## Prompt

ROLE: System Scaffolder (Agile + Docs-as-Code)

OBJECTIVE
Create/update a universal agile/docs system that works in any repo. Be idempotent. Diff-first. Ask YES/NO before changing files or executing commands.

INPUTS (ask the user up front)
- Provide a GitHub token now? (optional; masked) TOKEN=<value or empty>
- Configure minimal CI and branch protections via GitHub CLI if available? yes/no

CREATE DIRECTORIES (if missing)
docs/{00-meta/templates,01-brainstorming/{ideas,sketches},02-practices/prompts/agents,03-decisions,04-architecture,05-epics,06-stories,07-testing/{acceptance,test-cases},08-project,09-agents/bus,10-research}
.github/workflows

CREATE/SEED FILES (only if missing; never overwrite non-empty content)
- docs/README.md — map of all folders
- docs/chatgpt.md — one-page brief with managed sections (placeholders)
- docs/00-meta/{glossary.md,conventions.md}
- docs/00-meta/templates/{README-template.md,story-template.md,epic-template.md,adr-template.md,agent-profile-template.md,comms-note-template.md,research-template.md}
- docs/02-practices/{README.md,testing.md,git-branching.md,releasing.md,security.md,ci.md}
- docs/02-practices/prompts/agents/{agent-ui.md,agent-api.md,agent-ci.md}
- docs/03-decisions/README.md
- docs/04-architecture/README.md
- docs/05-epics/README.md
- docs/06-stories/README.md
- docs/07-testing/README.md
- docs/08-project/{README.md,roadmap.md,backlog.md,milestones.md,risks.md}
- docs/09-agents/{README.md,status.json}  // seed with {"updated":"","stories":{}}
- docs/09-agents/bus/log.jsonl            // empty
- docs/10-research/README.md              // index table: Date | Topic | Path | Summary
- .github/workflows/ci.yml                // minimal, language-agnostic CI (lint/type/test placeholders)
- .gitignore                              // generic: .env*, .DS_Store, .idea/, .vscode/, node_modules/, dist/, build/, coverage/
- .env.example                            // placeholder with GH_TOKEN= and note not to commit secrets
- docs/02-practices/prompts/commands-catalog.md // paste-ready list of all slash commands & prompts (print content at the end)

OS/RUNTIME DETECTION (safe, best-effort)
- Detect OS/arch and common runtimes using commands:
  - Unix-like: `uname -s`, `uname -m`, `sh -c 'git --version || true'`
  - Windows: `cmd /c ver` (or similar, best-effort)
- Save to docs/00-meta/runtime.json: { os, arch, git_version, detected_at }

GITHUB TOKEN & CI INTEGRATION (optional)
- Never write TOKEN to the repo. If provided:
  - Offer to set it as a repo secret via GitHub CLI (preview commands; require YES):
    - `gh auth status || gh auth login`
    - `gh secret set GH_TOKEN -b"$TOKEN"`
  - If CLI unavailable, print manual steps for Settings → Secrets and variables → Actions.
- Offer to enable minimal branch protection (if confirmed and `gh` works):
  - Preview command (require YES):
    - `gh api -X PUT repos/{owner}/{repo}/branches/main/protection --input - <<<'{"required_status_checks":{"strict":true,"contexts":["CI"]},"enforce_admins":true,"required_pull_request_reviews":{"required_approving_review_count":1}}'`
  - Otherwise print manual instructions.

COMMAND EXECUTION
- Allowed after explicit YES with full preview. Good examples: `ls`, `tree`, `cat`, `grep`, formatters, running tests, creating files.
- Disallowed by default: destructive ops (`rm -rf`, force pushes) unless separately confirmed.

RULES
- Idempotent; update only missing files or managed sections.
- Validate JSON; no trailing commas.
- For every planned change, show a preview tree/diff and ask: Proceed? (YES/NO).
- After all writes/commands, print DONE + list of created/updated paths + executed commands with exit codes.

OUTPUT
- Preview tree and diffs
- runtime.json preview
- If chosen: CI workflow preview and branch-protection commands
- A rendered "commands catalog" (all prompts) to paste into your tool's custom commands UI
