# Building Claude Code Skills From Scratch

**Import Date**: 2025-12-25
**Topic**: Claude Code Skill Architecture & Development
**Source**: IndyDevDan YouTube (transcript import)
**Content Type**: Video transcript

## Summary

This is a comprehensive walkthrough of building a "Fork Terminal" skill for Claude Code from the ground up. The author (IndyDevDan, 15+ years software experience, using LLMs since GPT-3.5) demonstrates the complete process of creating a reusable skill that can fork terminal windows and spin up new agent instances (Claude Code, Gemini CLI, Codex CLI) or run raw CLI commands.

The key philosophy emphasized is **"begin with the end in mind"** - always plan before coding, even when using AI agents. The author literally pushes the laptop aside and writes the plan in a physical notebook first. This is presented as essential to avoid "brain rot" from over-reliance on agents.

The skill demonstrates **progressive disclosure** - conditionally loading additional documentation based on the user's request - and the **cookbook pattern** for organizing tool-specific instructions.

## Key Findings

### Core Four Framework
- **Context**: What the agent knows (codebase, docs, history)
- **Model**: The LLM powering the agent
- **Prompt**: Instructions and templates
- **Tools**: Scripts and commands the agent can execute

### Skill Architecture Pattern
```
.claude/skills/<skill-name>/
├── SKILL.md              # "Pivot file" - central skill definition
├── tools/                # Executable scripts
│   └── fork-terminal.py  # Astral UV single-file script
├── prompts/              # User/system prompts
│   └── fork-summary-user-prompt.md
└── cookbook/             # Per-use-case documentation
    ├── cli-command.md
    ├── claude-code.md
    ├── gemini-cli.md
    └── codex-cli.md
```

### Progressive Disclosure Pattern
- SKILL.md contains conditional routing logic
- If user wants X and feature X is enabled → read cookbook/x.md
- Allows skills to scale without bloating the main prompt
- Cookbook files are "recipes" for specific use cases

### In-Loop vs Out-Loop Agentic Coding
- **In-loop**: Developer present, high effort, maximum control
- **Out-loop**: Agents work autonomously on production codebases
- Use in-loop for new skills/complex work, out-loop for chores/bugs

### Key Engineering Practices
1. **Plan before prompting** - Use notebooks, define deliverables
2. **Start with proof of concept** - Get simplest working version first
3. **Fresh context windows** - Spin up new agents frequently for focus
4. **Blame yourself first** - Before blaming model/tools, check your prompts
5. **Make code agentic** - Return concrete outputs agents can parse
6. **Commit frequently** - Use git to checkpoint working states
7. **Run `--help` before executing** - Have agents learn CLI tools dynamically

### Fork Terminal Skill Features
- Opens new terminal windows on Mac (osascript) and Windows (PowerShell)
- Routes to appropriate agentic coding tool based on request
- Model selection: fast (haiku/flash), base (sonnet), heavy (opus)
- YOLO mode: `--dangerously-skip-permissions` for trusted contexts
- Fork with summary: Compresses conversation history and hands off to new agent

## Code Snippets

### SKILL.md Structure (from video)
```markdown
# Fork Terminal Skill

One sentence description.
Use when: user requests fork terminal, create new terminal, fork session

## Variables
- enable_gemini_cli: true
- enable_codex_cli: true
- enable_claude_code: true
- enable_raw_cli_commands: true

## Cookbook
Based on user's request, determine which tool to use.

### Raw CLI Commands
If user requests a non-agentic coding tool and enable_raw_cli_commands is true:
Then read and execute cookbook/cli-command.md

Examples:
- "create a new terminal to xyz with ffmpeg"
- "fork terminal curl google.com"

### Claude Code
If user enters a claude code agent and enable_claude_code is true:
Then read cookbook/claude-code.md

Examples:
- "fork terminal use claude code to XYZ"
- "fork session claude code summarize work so far"

## Workflow
1. Understand user's request
2. Read cookbook based on request type
3. Execute the tool
```

### Cookbook File Pattern (claude-code.md)
```markdown
# Execute a Claude Code Agent

## Variables
- fast_model: haiku
- base_model: sonnet
- heavy_model: opus
- default_model: sonnet

## Instructions
1. Run `claude --help` to understand the CLI
2. Use default model unless specified
3. If fast requested → use fast_model
4. If heavy requested → use heavy_model
5. Always run with `--dangerously-skip-permissions`
6. Always use interactive mode (leave off -p)
```

### Fork Summary User Prompt Template
```yaml
# Prompt for fork agent

prompt_history_summarized_user_prompt:
  history:
    - user_prompt: "<summarized>"
      response_summary: "<summarized>"
  next_user_request: "<fill in user prompt here for the fork>"

# Instructions to base agent:
# This is the history of the conversation between user and agent.
# Take this and use it to understand the next user's request.
# Create simple, concise history - include summarized versions.
```

### Fork Terminal Python Tool (Astral UV)
```python
#!/usr/bin/env uv run
# Fork terminal using subprocess

import subprocess
import platform

def fork_terminal(command: str) -> str:
    """Fork a new terminal window and run command."""
    cwd = os.getcwd()

    if platform.system() == "Darwin":
        # macOS: use osascript
        script = f'''
        tell application "Terminal"
            do script "cd {cwd} && {command}"
            activate
        end tell
        '''
        result = subprocess.run(["osascript", "-e", script],
                                capture_output=True, text=True)
    elif platform.system() == "Windows":
        # Windows: use cmd.exe
        result = subprocess.run(["cmd.exe", "/c", "start", "cmd", "/k",
                                f"cd {cwd} && {command}"],
                                capture_output=True, text=True)

    if result.returncode != 0:
        return f"Error: {result.stderr}"
    return f"Forked terminal with: {command}"
```

## Action Items

- [ ] **Create fork-terminal skill for AgileFlow** - Implement the pattern shown
- [ ] **Add cookbook pattern to existing skills** - Progressive disclosure improves scalability
- [ ] **Set up prompt code snippets** - Author uses "ag" → skill template, "AGP" → agentic prompt
- [ ] **Add --help pre-execution pattern** - Have agents learn CLIs before running commands
- [ ] **Implement fork summary** - Context compression for handoff between agents
- [ ] **Create /prime command** - Quick codebase priming without bloating memory files
- [ ] **Add model tier variables** - fast/base/heavy model selection in skills

## Story Suggestions

### Potential Epic: EP-FORK - Fork Terminal Skill

**US-FORK-001**: Create fork-terminal skill scaffold
- AC: SKILL.md with variables and routing logic
- AC: Empty cookbook directory with placeholder files
- AC: Tool script with Mac/Windows support

**US-FORK-002**: Implement raw CLI command forking
- AC: Opens new terminal window on current platform
- AC: Runs specified command in new terminal
- AC: Returns success/error to calling agent

**US-FORK-003**: Add Claude Code integration
- AC: Model selection (haiku/sonnet/opus)
- AC: YOLO mode enabled by default
- AC: Runs --help before first use to learn CLI

**US-FORK-004**: Add Gemini CLI integration
- AC: Model selection (flash/pro)
- AC: Equivalent YOLO mode syntax
- AC: Dynamic help documentation

**US-FORK-005**: Add Codex CLI integration
- AC: Model selection (mini/base)
- AC: Sandbox mode configuration
- AC: Help documentation loading

**US-FORK-006**: Implement fork with summary
- AC: Compress conversation history to YAML format
- AC: Pass summary as initial prompt to new agent
- AC: Include next user request in handoff

### Potential Epic: EP-COOKBOOK - Cookbook Pattern for Skills

**US-COOK-001**: Document cookbook pattern in skill development guide
- AC: Explain progressive disclosure concept
- AC: Show file structure conventions
- AC: Include routing logic examples

**US-COOK-002**: Retrofit existing skills with cookbook pattern
- AC: Identify skills that would benefit
- AC: Migrate inline instructions to cookbook files
- AC: Add conditional loading logic

## Security Considerations

- **YOLO mode warning**: `--dangerously-skip-permissions` bypasses safety checks
- **Command injection**: Fork terminal executes arbitrary commands - validate inputs
- **API key exposure**: Environment files (.env) mentioned but should be gitignored
- **Cross-platform concerns**: Windows cmd.exe has different escaping rules than bash

## Testing Strategy

- Test on Mac (osascript) and Windows (PowerShell) separately
- Verify terminal opens in correct working directory
- Test model selection for each agentic coding tool
- Validate fork summary produces parseable YAML
- Check error handling returns actionable messages

## Risks & Gotchas

1. **Claude Code skill caching** - Skills don't update live; must restart session
2. **Path escaping** - Special characters in paths break osascript
3. **Context window size** - Fork summaries may still be too large
4. **Model availability** - Opus may not be available to all users
5. **Platform detection** - WSL reports as Linux, not Windows

## Related Concepts from IndyDevDan

- **Tactical Agentic Coding** - Course covering in-loop/out-loop patterns
- **Agent Experts** - Self-improving agents with expertise files
- **Core Four** - Context/Model/Prompt/Tools framework
- **Scale Compute, Scale Impact** - Philosophy of leveraging multiple agents

## References

- Source: IndyDevDan YouTube channel (video transcript)
- Related: Astral UV single-file scripts
- Related: Claude Code CLI documentation
- Import date: 2025-12-25
