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

<!-- {{COMMAND_LIST}} -->

OUTPUT: plain markdown only (no file writes)
