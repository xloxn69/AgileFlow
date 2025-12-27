# AI Agent Skills - Reusable Workflows

**Import Date**: 2025-12-27
**Topic**: AI Agent Skills - Reusable Workflows
**Source**: Video transcript (Agency Swarm / VRSEN)
**Content Type**: Video transcript

## Summary

This video provides a comprehensive mental model for AI agent skills - what they are, how they differ from MCPs and traditional tool calling, and how to build them effectively. The key insight is that skills are **reusable on-demand workflows** that an agent can pull in when needed, not static tools or prompts.

The presenter demonstrates a practical example: a deck-building agent that produced "garbage" layouts with traditional tool calling, but generated much better results when given a single code execution tool with a skill containing working code. The first run explored and iterated, then the solution was saved as a skill - reducing subsequent runs from 76,000 tokens to 8,000 tokens (10x improvement).

Skills are positioned as the layer that makes agents **compound** instead of starting from scratch every time. They solve two major walls: token bloat (paying context cost for all tools) and workflow learning (repeating mistakes each run).

## Key Findings

### What Skills Are
- **Reusable on-demand** instructions and scripts for specific workflows
- Not loaded into agent prompt permanently - pulled in only when needed
- Each skill = a folder containing instructions + code
- Agent reuses working code instead of reinventing from scratch

### What Skills Are NOT
- **Not a replacement for MCPs** - MCPs still best for external systems (Google Drive, Notion, Slack, Gmail, databases)
- **Not a replacement for function calling** - For single tool, simple action, classic tool calling is better (faster, predictable, debuggable)
- Skills sit on top of MCPs/tools, or can exist independently

### When to Use Skills vs Tools
| Use Case | Best Approach |
|----------|---------------|
| Submit one Jira ticket | Tool call |
| Fetch one record | Tool call |
| Create a formatted document | Skill |
| Generate spreadsheet with formulas | Skill |
| Build presentation deck | Skill |
| Multi-step workflow with edge cases | Skill |

### The Mental Model Diagram
```
                    SKILLS
                   (workflows)
                       │
            ┌──────────┼──────────┐
            ▼          ▼          ▼
         Tools       MCPs       Code
            │          │          │
            └──────────┴──────────┘
                       │
                     CODE
              (everything is code)
```

- Tools = code wrapped in callable interface (runs locally)
- MCPs = standardized tools running on external servers
- Skills = workflows that chain code + tools together (reusable)

### Two Walls Skills Solve

1. **Token Bloat**: Classic tool calling burns context on ALL tools even when using one. MCP servers amplify this (tens of thousands of tokens before agent starts working).

2. **Workflow Learning**: Complex workflows require specific sequences. Without saving knowledge, agent repeats same mistakes every run.

### Benefits of Skills

1. **Increased Autonomy**: Agent executes full workflow in code, adapts as it goes
2. **Reuse**: Figure out hard part once, reuse forever
3. **Cost**: First run may be expensive, but subsequent runs dramatically cheaper
4. **Consistency**: Users get docs/sheets/decks with same structure instead of random layouts

### Trade-offs and Safety

**Debugging Visibility**
- Tool calls show exactly what happened
- Skills show massive code chunk - harder to see mistakes
- Must read through code to understand what went wrong

**Safety with Code Execution**
- Same risk category as MCP tools (can still wipe databases)
- Risk is faster and potentially more destructive
- Need secure sandbox for production

**Simple Safety Rule**
> Agents can USE skills but cannot MODIFY the skills directory

- Lock skills folder with permissions in sandbox
- Agent can generate new skills elsewhere, but can't override trusted ones
- Every skill is reviewable, versioned in repo

### Skill Structure (Anthropic/ChatGPT Pattern)
```
skills/<skill-name>/
├── SKILL.md          # Name, description, usage instructions
├── scripts/          # Executable scripts for the workflow
└── examples/         # Optional example usage (agent can read on demand)
```

**SKILL.md Contents:**
- Name and description (for agent discovery)
- Specific instructions on how to use scripts
- References to other markdown files for examples

### Building Skills with Claude

1. Ask Claude which skills it currently has
2. Use the **skill-creator skill** from Anthropic's GitHub repo
3. Provide YOUR documentation, SOPs, and specific process details
4. Don't prompt AI to create prompts without context = "slop machine"
5. Bigger model (Claude Opus) can create skills for smaller models (model distillation)

### Skill Router Pattern
Create a **discover-skills tool** that:
- Lists all skills with names and descriptions
- Agent picks appropriate skill before executing task
- Prevents loading unnecessary skill context

### Token Efficiency Example
| Run | Tokens | Notes |
|-----|--------|-------|
| First (exploration) | 76,000 | Agent learning workflow |
| Second (with skill) | 8,000 | 10x reduction, more reliable |

## Action Items

- [ ] Review existing AgileFlow skills for code-first approach
- [ ] Consider adding skill router/discovery mechanism
- [ ] Evaluate skills that are instruction-only vs code-backed
- [ ] Lock skills directory permissions in any sandbox deployment
- [ ] Document skill structure pattern for AgileFlow skills

## Story Suggestions

### Potential Epic: EP-XXXX - Skill Enhancement

- **US-XXXX**: Add skill discovery tool for agents
  - AC: Agent can list available skills before task execution
  - AC: Descriptions are concise and actionable

- **US-XXXX**: Implement code-backed skills pattern
  - AC: Skills include executable scripts, not just instructions
  - AC: Scripts are reusable across multiple skill invocations

- **US-XXXX**: Add skill sandbox safety controls
  - AC: Skills directory is read-only to agents
  - AC: Agents can generate new skills to separate location
  - AC: All skills are version-controlled

## Relevance to AgileFlow

AgileFlow already has a robust skills system (`packages/cli/src/core/skills/`) with 24+ skills. This research validates the current approach and suggests enhancements:

1. **Already doing well**: Skills with SKILL.md pivot files, code snippets, examples
2. **Consider adding**: Skill router/discovery tool for complex multi-skill tasks
3. **Safety**: Skills directory is already read-only in installed projects
4. **Token efficiency**: Progressive disclosure pattern (load skill only when needed) is already in use

## Raw Content Reference

<details>
<summary>Original transcript excerpt (click to expand)</summary>

[00:00:00] The first time I tried to build a deck agent the normal way with a clean set of hard-coded tools, the output was garbage. The deck existed, but the layouts were all over the place. So, I tried just one change. I removed almost all the tools, gave the agent a single code execution tool and forced it to generate the slides directly by writing open-ended code. Instantly, the layouts got way better...

[00:01:00] That's what skills are. Reusable ondemand scripts and instructions an agent can call to run a specific workflow efficiently. They're not just MCPS and they're not just normal tool calling either. They're the layer that makes agents compound instead of starting from scratch every single time...

</details>

## References

- Source: Video transcript (Agency Swarm / VRSEN channel)
- Import date: 2025-12-27
- Related: [20251225-building-claude-code-skills-from-scratch.md](./20251225-building-claude-code-skills-from-scratch.md) - Complementary skill architecture patterns
