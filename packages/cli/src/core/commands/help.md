---
description: Display AgileFlow system overview and commands
allowed-tools: Bash, Read, Edit, Write, Glob, Grep
---

# system-help

Display a concise overview of the AgileFlow system.

## Prompt

ROLE: System Guide

TASK
Print a concise, one-screen overview:
- Folder map (docs/*) and what lives where
- What Epics, Stories, ADRs are; how docs/09-agents/status.json + bus/log.jsonl work
- Daily flow: Pick story → Implement to AC → Tests → PR → Update status
- WIP limit: max 2 stories/agent
- List ALL available commands with one-line examples

<!-- AUTOGEN:COMMAND_LIST:START -->
<!-- Auto-generated on 2025-12-12. Do not edit manually. -->

**Collaboration:**
- `/AgileFlow:feedback` - Collect and process agent feedback
- `/AgileFlow:handoff` - Document work handoff between agents
- `/AgileFlow:retro` - Generate retrospective with Start/Stop/Continue format
- `/AgileFlow:update` - Generate stakeholder progress report

**Deployment & Operations:**
- `/AgileFlow:deploy` - Set up automated deployment pipeline
- `/AgileFlow:packages` - Manage dependencies with updates and security audits

**Development:**
- `/AgileFlow:babysit` - Interactive mentor for end-to-end feature implementation
- `/AgileFlow:baseline` - Mark current state as verified baseline
- `/AgileFlow:resume` - Resume work with verification and context loading
- `/AgileFlow:session-init` - Initialize session harness with test verification
- `/AgileFlow:verify` - Run project tests and update story test status

**Documentation:**
- `/AgileFlow:adr` - Create an Architecture Decision Record
- `/AgileFlow:docs` - Synchronize documentation with code changes
- `/AgileFlow:readme-sync` - Synchronize a folder's README.md with its current contents

**Maintenance:**
- `/AgileFlow:compress` - Compress status.json by removing verbose fields and keeping only tracking metadata
- `/AgileFlow:debt` - Track and prioritize technical debt items
- `/AgileFlow:template` - Create and manage custom document templates

**Other:**
- `/AgileFlow:blockers` - Track and resolve blockers with actionable suggestions
- `/AgileFlow:changelog` - Auto-generate changelog from commit history
- `/AgileFlow:context` - Generate context export for web AI tools
- `/AgileFlow:impact` - Analyze change impact across codebase
- `/AgileFlow:pr` - Generate pull request description from story

**Planning & Metrics:**
- `/AgileFlow:board` - Display visual kanban board with WIP limits
- `/AgileFlow:deps` - Visualize dependency graph with critical path detection
- `/AgileFlow:metrics` - Analytics dashboard with cycle time and throughput
- `/AgileFlow:sprint` - Data-driven sprint planning with velocity forecasting

**Quality & Testing:**
- `/AgileFlow:ci` - Bootstrap CI/CD workflow with testing and quality checks
- `/AgileFlow:review` - AI-powered code review with quality suggestions
- `/AgileFlow:tests` - Set up automated testing infrastructure
- `/AgileFlow:velocity` - Track velocity and forecast sprint capacity

**Research & Strategy:**
- `/AgileFlow:research` - Initialize research note with structured template

**Story Management:**
- `/AgileFlow:assign` - Assign or reassign a story to an owner
- `/AgileFlow:epic` - Create a new epic with stories
- `/AgileFlow:status` - Update story status and progress
- `/AgileFlow:story` - Create a user story with acceptance criteria
- `/AgileFlow:story-validate` - Validate story completeness before development

**System:**
- `/AgileFlow:agent` - Onboard a new agent with profile and contract
- `/AgileFlow:auto` - Auto-generate stories from PRDs, mockups, or specs
- `/AgileFlow:diagnose` - System health diagnostics
- `/AgileFlow:help` - Display AgileFlow system overview and commands
- `/AgileFlow:setup` - Bootstrap entire AgileFlow system in current project

<!-- AUTOGEN:COMMAND_LIST:END -->

OUTPUT: plain markdown only (no file writes)
