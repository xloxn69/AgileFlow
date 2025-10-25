# MCP Wrapper Scripts

## Why Wrapper Scripts?

Most MCP servers support `${VAR}` environment variable substitution in `.mcp.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    }
  }
}
```

**However**, some MCP servers (like Postgres) **DO NOT** support `${VAR}` substitution. For these servers, you need a wrapper script to:
1. Load environment variables from `.env`
2. Pass them to the MCP server

## When to Use Wrapper Scripts

✅ **Use wrapper scripts** if:
- MCP server doesn't support `${VAR}` syntax
- Server requires credentials as CLI arguments (not env vars)
- You need custom pre-processing before launching the server

❌ **DON'T use wrapper scripts** if:
- MCP server supports `${VAR}` (use direct env vars instead)
- Examples: GitHub MCP, Notion MCP, ClickUp MCP (all support `${VAR}`)

## How to Create a Wrapper Script

### Step 1: Create the wrapper script

Copy the template and customize for your MCP server:

```bash
cp templates/mcp-wrapper-postgres.sh scripts/mcp-wrapper-yourserver.sh
chmod +x scripts/mcp-wrapper-yourserver.sh
```

### Step 2: Update .mcp.json

```json
{
  "mcpServers": {
    "yourserver": {
      "command": "bash",
      "args": ["./scripts/mcp-wrapper-yourserver.sh"]
    }
  }
}
```

### Step 3: Add credentials to .env

```bash
# .env
YOUR_SERVER_HOST=localhost
YOUR_SERVER_PORT=5432
YOUR_SERVER_TOKEN=your_secret_token_here
```

### Step 4: Update .gitignore

Ensure wrapper scripts are committed but .env is NOT:

```bash
# Commit wrapper scripts (they contain no secrets)
git add scripts/mcp-wrapper-*.sh

# Ensure .env is gitignored (contains secrets)
grep '\.env' .gitignore || echo ".env" >> .gitignore
```

## Example: Postgres MCP

See `templates/mcp-wrapper-postgres.sh` for a complete example.

## Security Checklist

- [ ] .env is in .gitignore (CRITICAL)
- [ ] .mcp.json is in .gitignore (CRITICAL)
- [ ] Wrapper scripts contain NO hardcoded secrets
- [ ] .env.example documents all required variables
- [ ] Each team member has their own .env with their own tokens

## Troubleshooting

**"ERROR: VARIABLE not set in .env"**
→ Add the missing variable to your .env file

**"Permission denied"**
→ Make wrapper executable: `chmod +x scripts/mcp-wrapper-*.sh`

**"MCP server not found"**
→ Verify the npx command in the wrapper script matches the actual MCP package name
