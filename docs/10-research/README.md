# Research Notes

Research findings, investigations, and technical explorations.

## Format

Use `/agileflow:research` to create new research notes.

| Date | Topic | Path | Summary |
|------|-------|------|---------|
| 2025-12-16 | Agent Experts: Self-Improving Agents | [20251216-agent-experts-self-improving-agents.md](./20251216-agent-experts-self-improving-agents.md) | Self-improving agents with expertise files (mental models) that automatically learn from their actions. Three-step workflow: Act → Learn → Reuse. From IndyDevDan's Tactical Agentic Coding Course Lesson 13. |
| 2025-12-16 | Agent Expert Pilot Retrospective | [20251216-agent-expert-pilot-retro.md](./20251216-agent-expert-pilot-retro.md) | Post-pilot analysis of EP-0001 Agent Expert implementation. GO recommendation for full rollout. Includes metrics, lessons learned, and rollout plan (completed 2025-12-17). |
| 2025-12-16 | Mermaid.js Diagramming | [20251216-mermaid-js-diagramming.md](./20251216-mermaid-js-diagramming.md) | Comprehensive guide to Mermaid.js for technical documentation. Covers flowcharts, sequence diagrams, architecture diagrams, class diagrams, state diagrams. Includes syntax reference, GitHub integration, and best practices. |
| 2025-12-17 | Mermaid SVG Styling | [20251217-mermaid-svg-styling.md](./20251217-mermaid-svg-styling.md) | Advanced Mermaid diagram styling with CSS classes, themes, and SVG customization techniques. |
| 2025-12-21 | Session Tracking Best Practices | [20251221-session-tracking-best-practices.md](./20251221-session-tracking-best-practices.md) | Developer session tracking patterns from WakaTime, Code Time, RescueTime. Recommended schema for session-state.json, metrics to track, regression detection, and anti-patterns to avoid. |
| 2025-12-23 | Fumadocs + Shadcn Integration | [20251223-fumadocs-shadcn-integration.md](./20251223-fumadocs-shadcn-integration.md) | Integration guide for Fumadocs UI with Shadcn styling. Key fix: use `cssPrefix: 'fuma-'` (not 'fd-'), `addGlobalColors: false`, and bridge variables with `--fd-*: var(--*)`. |
| 2025-12-24 | OpenAI Codex CLI Integration | [20251224-openai-codex-cli-integration.md](./20251224-openai-codex-cli-integration.md) | How to add Codex CLI support to AgileFlow. Maps commands→prompts, agents→skills, CLAUDE.md→AGENTS.md. Includes installer architecture, story breakdown, and rollback plan. |
| 2025-12-25 | Top 2% Agentic Engineer 2026 | [20251225-top-2pct-agentic-engineer-2026.md](./20251225-top-2pct-agentic-engineer-2026.md) | IndyDevDan's 11 bets for 2026: Year of Trust thesis, Anthropic dominance, tool calling as opportunity, custom agents above all, multi-agent orchestration, agent sandboxes, in-loop vs out-loop coding, Agentic Coding 2.0, benchmark breakdown, UI vs agents, AGI hype dies. |
| 2025-12-25 | Building Claude Code Skills From Scratch | [20251225-building-claude-code-skills-from-scratch.md](./20251225-building-claude-code-skills-from-scratch.md) | Complete walkthrough of building a Fork Terminal skill. Covers skill architecture (SKILL.md, tools/, prompts/, cookbook/), progressive disclosure pattern, Core Four framework (Context/Model/Prompt/Tools), in-loop vs out-loop coding, and fork summary for context handoff. |
