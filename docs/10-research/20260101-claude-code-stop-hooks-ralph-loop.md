# Claude Code Stop Hooks & Ralph Loop for Autonomous Execution

**Import Date**: 2026-01-01
**Topic**: Claude Code Stop Hooks and Ralph Wiggum Plugin
**Source**: Video transcript (IndyDevDan - Claude Code autonomous execution)
**Content Type**: transcript

---

## Summary

This video explains how to configure Claude Code to run autonomously for extended periods (hours to days) using **stop hooks** and the **Ralph Wiggum plugin**. The key insight is that Claude Code's non-deterministic LLM behavior can be made persistent by adding deterministic checkpoints via hooks.

Recent Meter benchmarks show Claude Opus 4.5 can run autonomously for 4 hours 49 minutes at 50% completion rate - a massive improvement from GPT-4's 5-minute limit. Boris Jaworsky (Claude Code creator) reports landing 259 PRs and 457 commits in 30 days using stop hooks, with every line written by Claude Code.

The core pattern: when Claude stops (whether completing a task or asking a question), a stop hook intercepts, runs validation (tests, checks), and re-feeds context to continue. This creates a loop until max iterations or a completion promise is met.

---

## Key Findings

- **Stop hooks enable persistence**: When Claude finishes or tries to stop, the hook fires automatically, allowing you to run tests/validation and feed results back
- **Deterministic + Non-deterministic**: Combine deterministic hooks with Claude's non-deterministic behavior for reliable long-running tasks
- **Self-driving car analogy**: Start with permissions enabled, learn the capabilities, then gradually trust the system more
- **Test-driven loops**: Run unit/integration tests after each iteration; if tests fail, Claude fixes before continuing
- **Ralph Wiggum plugin**: Official Anthropic pattern for persistent loops - named after the Simpsons character who keeps trying until it works
- **Boris Jaworsky stats**: 259 PRs, 457 commits, 40K lines added, 38K removed in 30 days - all via Claude Code with stop hooks
- **Claude Code hooks types**: Pre-tool, post-tool, stop (this video focuses on stop hooks)
- **To-do list pattern**: Point Claude at a markdown checklist; it processes each item, validates, marks complete, repeats
- **Stack multiple hooks**: Can combine logging, notifications, and validation hooks together
- **Must set limits**: Always specify max_iterations AND completion_promise to prevent infinite loops

---

## Implementation Approach

### The Ralph Loop Pattern

1. **Install Ralph Wiggum plugin** - Provides stop hook trigger and `/ralph-loop` command
2. **Define your task** - Create a todo.md or describe the task in prompt
3. **Set parameters**:
   - `prompt`: What Claude should do
   - `max_iterations`: Safety limit (prevents infinite loops)
   - `completion_promise`: Validation criteria for "done"
4. **Start the loop** - Claude works, stop hook catches exit, re-feeds context
5. **Iterate until complete** - Loop continues until promise met or max iterations

### Hook Configuration

```json
{
  "hooks": {
    "Stop": {
      "command": "node .claude/hooks/ralph-stop.js",
      "description": "Ralph loop stop handler"
    }
  }
}
```

### To-Do List Workflow

```markdown
## task.md
- [ ] Implement user authentication
  - Run: npm test auth
- [ ] Add rate limiting
  - Run: npm test rate-limit
- [ ] Update API documentation
  - Run: npm run docs:check
```

Claude processes each unchecked item, runs validation, marks complete, continues.

---

## Code Snippets

### Ralph Loop Invocation

```
/ralph-loop "Go through my to-do list step by step and mark down every step that is complete once it's actually done" --max-iterations=20 --promise="All tasks in todo.md are checked"
```

### Stop Hook Structure

```javascript
// .claude/hooks/stop-hook.js
module.exports = {
  formatter: (output) => output,
  iteration: 0,
  maxIteration: 20,
  completionPromise: "All tests pass and todo list complete"
};
```

---

## Action Items

- [ ] Install Ralph Wiggum plugin: `claude plugins install ralph-wiggum`
- [ ] Create `.claude/hooks/` directory for custom stop hooks
- [ ] Set up a test todo.md file to practice the pattern
- [ ] Configure max_iterations and completion_promise for safety
- [ ] Add test validation to stop hook for TDD workflow
- [ ] Document project-specific completion promises

---

## Risks & Gotchas

- **Infinite loops**: If you don't set max_iterations AND completion_promise, the loop runs forever (burns tokens)
- **Trust calibration**: Start with manual permissions, gradually increase trust as you learn Claude's capabilities
- **Dangerous operations**: Claude can delete, push, modify - set guardrails appropriately
- **Context drift**: Long-running tasks can drift off course; use validation steps to catch early
- **Test reliability**: If tests are flaky, the loop may spin unnecessarily

---

## Use Cases

1. **Test-Driven Development**: Write tests first, Ralph loop implements until tests pass
2. **Large Refactors**: Define refactor steps in todo.md, let Claude work through systematically
3. **Migrations**: Database migrations, API version upgrades, dependency updates
4. **Feature Implementation**: Scaffold plan, validate each step with tests
5. **Documentation**: Generate docs, validate with linter/checker

---

## Story Suggestions

### Potential Epic: Stop Hook Integration for AgileFlow

**US-XXXX**: Add Ralph Loop Command
- AC: Create `/agileflow:ralph-loop` command with prompt, max_iterations, completion_promise params

**US-XXXX**: Implement Stop Hook for Test Validation
- AC: Stop hook runs `npm test` and re-feeds failures to Claude

**US-XXXX**: Document Stop Hook Best Practices
- AC: Add docs/02-practices/stop-hooks.md with patterns and anti-patterns

---

## References

- Source: IndyDevDan video on autonomous Claude Code execution
- Ralph Wiggum Plugin: Official Anthropic repository
- Boris Jaworsky tweet: Claude Code creator's usage stats
- Import date: 2026-01-01
