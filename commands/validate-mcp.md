---
description: Validate MCP token configuration
allowed-tools: Bash, Read
---

# validate-mcp

Validate MCP (Model Context Protocol) token configuration to troubleshoot integration issues.

## Prompt

ROLE: MCP Configuration Validator

OBJECTIVE
Securely validate that MCP tokens are properly configured without exposing sensitive values. Help users troubleshoot "MCP not working" issues.

**What This Command Does**:
- ✅ Checks if .env file exists with real tokens (not placeholders)
- ✅ Validates token format without exposing values (shows length only)
- ✅ Verifies .gitignore protection (.mcp.json and .env excluded)
- ✅ Checks wrapper script infrastructure
- ✅ Validates .mcp.json uses wrapper approach
- ❌ NEVER displays actual token values

**Security First**:
This validation is designed to be 100% secure:
- Shows token length, NOT value
- Detects placeholders ("your_token_here", etc.)
- Never logs or prints actual tokens
- Helps troubleshoot without exposing secrets

**Run Validation**:
```bash
bash scripts/validate-mcp-tokens.sh
```

**Expected Output**:

If everything is configured correctly:
```
🔐 MCP Token Validation (Secure Check - No Tokens Exposed)
=============================================================

✅ .env file found

✅ GITHUB_PERSONAL_ACCESS_TOKEN is set (length: 40)
✅ NOTION_TOKEN is set (length: 50)
ℹ️  CONTEXT7_API_KEY not found in .env (optional - Context7 works without it)

🔒 Security Check:
  .mcp.json is in .gitignore: YES
  .env is in .gitignore: YES

🛠️  Infrastructure Check:
  ✅ Wrapper script exists (scripts/mcp-wrappers/load-env.sh)
  ✅ Wrapper script is executable
  ✅ .mcp.json exists
  ✅ .mcp.json uses wrapper approach

📋 Next Steps:

✅ All checks passed!

If MCP servers still aren't working:
1. 🔴 RESTART CLAUDE CODE (MCP servers only load on startup)
2. Wait 5-10 seconds after restart for MCP servers to initialize
3. Check Claude Code startup logs for MCP errors
```

If there are issues:
```
⚠️  Issues detected. To fix:

1. Copy template: cp .env.example .env
2. Edit .env and replace placeholders with real tokens
3. Add secrets to .gitignore (run /AgileFlow:setup to auto-fix)
4. NEVER commit .env or .mcp.json to git
5. 🔴 RESTART CLAUDE CODE after updating .env
```

**Common Issues Detected**:

1. **❌ .env file NOT found**
   - Fix: `cp .env.example .env` then edit with real tokens

2. **⚠️ Token appears to be placeholder**
   - Still has "your_token_here" or "ghp_your_actual_token_here"
   - Fix: Edit .env and replace with real token from provider

3. **⚠️ SECURITY WARNING: Secrets not protected by .gitignore**
   - .mcp.json or .env is missing from .gitignore
   - Fix: Run `/AgileFlow:setup` to auto-fix, or manually add

4. **⚠️ Wrapper script is NOT executable**
   - Fix: `chmod +x scripts/mcp-wrappers/load-env.sh`

5. **⚠️ .mcp.json may not be using wrapper approach**
   - Still using old `${VAR}` syntax
   - Fix: Run `/AgileFlow:migrate-mcp` (coming soon) or manually update

**When to Use This Command**:
- ✅ After running `/AgileFlow:setup` to verify configuration
- ✅ When MCP integrations (GitHub, Notion) aren't working
- ✅ Before asking for support ("my MCP doesn't work")
- ✅ When onboarding team members to verify their setup
- ✅ After updating tokens in .env

**What This Does NOT Do**:
- ❌ Does not test actual MCP server connections (just validates config)
- ❌ Does not expose or log token values (secure by design)
- ❌ Does not modify any files (read-only validation)

**Next Steps After Validation**:

If validation passes but MCP still not working:
1. **RESTART CLAUDE CODE** (most common issue - MCP servers load on startup only)
2. Wait 5-10 seconds after restart
3. Check startup logs for MCP initialization errors
4. Verify MCP server packages are installed: `npx -y @modelcontextprotocol/server-github --version`
5. Test wrapper manually: `bash scripts/mcp-wrappers/load-env.sh env | grep TOKEN`

If validation fails:
1. Follow the fix suggestions in the output
2. Run validation again to confirm fixes
3. RESTART CLAUDE CODE after making changes

**For Support**:
When asking for help with MCP issues, run this command first and share the output (it's safe - no tokens exposed).

OUTPUT
Display the full output from the validation script, then provide context-specific guidance based on results.
