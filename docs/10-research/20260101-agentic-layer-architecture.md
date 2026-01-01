# Agentic Layer Architecture

**Import Date**: 2026-01-01
**Topic**: Agentic Layer Architecture
**Source**: Video transcript (IndyDevDan - Agentic Horizon series)
**Content Type**: transcript

---

## Summary

The **agentic layer** is a new conceptual ring around your codebase where you teach AI agents to operate your application on your behalf. This framework introduces three classes with multiple grades, progressing from minimal setups (memory files + prime commands) to sophisticated orchestration systems with feedback loops and custom tools.

The ultimate goal is the **codebase singularity** - the moment when you, the engineer, realize your agents can run your codebase better than you can. At this point, nothing ships to production without your teams of agents reviewing and validating the work.

Building the agentic layer is positioned as the highest ROI action for any engineer in the age of agents. The key insight: when you scale your compute (more agent workflows), you scale your impact.

---

## Key Findings

- **Two-Layer Architecture**: Every codebase should have an application layer (database, frontend, backend, scripts, DevOps) surrounded by an agentic layer (prompts, agents, skills, tools)

- **Bundling Multiple Applications**: The agentic layer wraps around multiple applications/repositories so agents can "see everything" across your codebase

- **Three Classes of Agentic Layers**:
  - **Class 1**: Foundation (memory files, prompts, sub-agents, skills, MCP servers)
  - **Class 2**: Referenced but not detailed in this transcript
  - **Class 3**: Orchestrator-driven workflows with end-to-end automation

- **Class 1 has 5 Grades**:
  1. **Grade 1**: Prime prompt + memory files (thinnest possible layer)
  2. **Grade 2**: Specialized prompts for planning + sub-agents + AI docs
  3. **Grade 3**: Custom tools via skills, MCP servers, or tool-enabled prompts
  4. **Grade 4**: Feedback loops and closed-loop prompts (request→validate→resolve)
  5. **Grade 5**: Referenced, continues from lesson three concepts

- **Core Four Framework**: Context, Model, Prompt, Tools - understanding these lets you bypass MCP complexity with simple prompts

- **Closed-Loop Prompts**: The key differentiator at Grade 4 - agents review their own work and spin until the job is done

- **Common Mistakes at Grade 3**:
  - Too many tools (overengineering)
  - Token-heavy MCP servers when simple prompts would work
  - Poorly designed tool interfaces that won't scale

---

## Implementation Approach

### Grade 1: Minimal Setup
1. Create `CLAUDE.md` or equivalent memory file
2. Create a "prime command" that activates specific workflows
3. Agent can immediately understand and operate the codebase

### Grade 2: Add Planning & Sub-Agents
1. Add `specs/` directory for written plans
2. Add `ai-docs/` for documentation agents can reference
3. Create sub-agents (e.g., `fetch-docs`, `test-writer`)
4. Use plan files before implementation

### Grade 3: Add Custom Tools
1. Create skills that teach agents specific tool usage (e.g., database migration)
2. Optionally add MCP servers (Postgres, Firecrawl, Jira, Notion)
3. Create prompts with embedded tool instructions (e.g., `prime-db-with-tools`)
4. **Key insight**: Skills and MCPs can often be replaced with well-crafted prompts

### Grade 4: Add Feedback Loops
1. Add review workflows (`app-review/` directory)
2. Create closed-loop prompts: plan → build → review → fix
3. Specialize prompts by domain: `test-backend`, `test-frontend`
4. Have agents output reviews into concrete files
5. Implement request→validate→resolve pattern

### Grade 5: Scale Further
(Content continues in next lesson - involves concepts from lesson three)

---

## Code Snippets

### Example Directory Structure - Grade 1
```
project/
├── .claude/
│   └── commands/
│       └── prime.md        # Prime command (workflow activator)
├── CLAUDE.md               # Memory file (always loaded)
└── user-management/        # Application layer
    └── backend/
```

### Example Directory Structure - Grade 3
```
project/
├── .claude/
│   ├── commands/
│   │   ├── prime.md
│   │   ├── plan.md
│   │   └── prime-db-with-tools.md   # Tool-enabled prompt
│   ├── agents/
│   │   ├── fetch-docs.md
│   │   └── test-writer.md
│   └── skills/
│       ├── migrate-database/
│       └── start-stop-application/
├── mcp.json                # MCP server config
├── specs/                  # Planning documents
├── ai-docs/                # Agent documentation
└── user-management/
    ├── backend/
    └── tests/
```

### Example Directory Structure - Grade 4
```
project/
├── .claude/
│   ├── commands/
│   │   ├── plan.md
│   │   ├── build.md
│   │   ├── review.md           # Closed-loop review
│   │   ├── reproduce-bug.md
│   │   ├── test-backend.md     # Domain-specific
│   │   └── test-frontend.md
│   ├── agents/
│   │   └── review-agent.md
│   └── skills/
├── app-reviews/                 # Review output directory
├── specs/
└── applications/
    ├── client/                  # Frontend
    └── server/                  # Backend
```

---

## Action Items

- [ ] Assess current codebase's agentic layer grade (1-5)
- [ ] If Grade 1: Add specialized prompts for planning work
- [ ] If Grade 2: Implement at least one custom skill or tool-enabled prompt
- [ ] If Grade 3: Add closed-loop prompts with feedback mechanisms
- [ ] Audit existing tools - remove over-engineered or token-heavy ones
- [ ] Create domain-specific prompts (test-backend, test-frontend, review)
- [ ] Implement request→validate→resolve pattern in key workflows

---

## Risks & Gotchas

- **Grade 3 trap**: Engineers get stuck with too many poorly-designed tools that burn tokens and don't scale
- **MCP token overhead**: MCP servers are token-heavy; often a well-crafted prompt achieves the same result
- **Prompt engineering is required**: From Grade 3+, you must understand how to write effective prompts
- **Complexity grows**: Trade-off between capability and maintainability as you progress through grades

---

## Story Suggestions

### Potential Epic: EP-XXXX Agentic Layer Grade Assessment & Upgrade

**US-XXXX**: Audit current agentic layer and document grade level
- AC: Document current prompts, agents, skills, tools
- AC: Identify grade (1-5) with justification

**US-XXXX**: Implement closed-loop review workflow
- AC: Create review.md with request→validate→resolve pattern
- AC: Agent outputs reviews to app-reviews/ directory

**US-XXXX**: Create domain-specific test prompts
- AC: Separate test-backend.md and test-frontend.md
- AC: Each uses closed-loop pattern until tests pass

---

## Raw Content Reference

<details>
<summary>Original content (click to expand)</summary>

[00:00:00] There is one mental framework that sits at the center. An idea so important that if you capture it, it can change the way you engineer forever. The agentic layer. This is the new ring around your codebase where you teach your agents to operate your application on your behalf as well and even better than you and your team ever could. Focusing on building the agentic layer of your codebase is the highest return on investment action for any engineer in the age of agents we live in...

</details>

---

## References

- Source: Video transcript (IndyDevDan - Agentic Horizon series)
- Import date: 2026-01-01
- Related: Tactical Agentic Coding lessons (referenced Lesson 3, Lesson 5)
