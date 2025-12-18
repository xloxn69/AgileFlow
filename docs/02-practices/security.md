# Security Practices

Security guidelines and practices for AgileFlow.

---

## Sensitive Data

### Gitignored Files

These files contain sensitive data and must never be committed:

| File | Contains |
|------|----------|
| `.npmrc` | npm authentication token |
| `.mcp.json` | MCP server secrets |
| `CLAUDE.md` | Internal development notes |
| `.claude/settings.local.json` | User-specific settings |

### GitHub Secrets

Store sensitive values in GitHub Secrets, not in code:

| Secret | Purpose |
|--------|---------|
| `NPM_TOKEN` | npm publish authentication |

---

## npm Package Security

### Files Included in Package

The `files` field in `packages/cli/package.json` controls what gets published:

```json
{
  "files": [
    "tools/",
    "src/",
    "LICENSE",
    "README.md"
  ]
}
```

**Never include:**
- `.env` files
- `credentials.json`
- Private keys
- Internal documentation

### Verify Before Publish

```bash
# Preview package contents
cd packages/cli
npm pack --dry-run

# Check actual contents
tar -tzf agileflow-*.tgz
```

---

## Agent Prompt Security

AgileFlow agents have access to file system and shell commands. Follow these guidelines:

### Safe Operations

- Read files
- Write to designated directories
- Run build/test commands
- Generate documentation

### Restricted Operations

- Never store credentials in prompts
- Never include API keys in expertise files
- Avoid executing arbitrary user-provided commands without confirmation
- Use AskUserQuestion for dangerous operations

### User Confirmation Pattern

```xml
<invoke name="AskUserQuestion">
<parameter name="questions">[{
  "question": "Run: rm -rf node_modules?",
  "header": "Confirm",
  "multiSelect": false,
  "options": [
    {"label": "Yes, delete", "description": "Remove node_modules directory"},
    {"label": "No, cancel", "description": "Abort operation"}
  ]
}]</parameter>
</invoke>
```

---

## Dependency Security

### Audit Dependencies

```bash
npm audit
npm audit fix
```

### Update Dependencies

Use `/agileflow:packages` command for managed updates:

```bash
/agileflow:packages
```

### Known Vulnerabilities

Before release:
1. Run `npm audit`
2. Fix critical/high vulnerabilities
3. Document any accepted low-risk vulnerabilities

---

## Code Review Checklist

Before merging:

- [ ] No hardcoded secrets
- [ ] No credentials in commit history
- [ ] No internal URLs exposed
- [ ] User input validated
- [ ] Dangerous operations require confirmation
- [ ] Dependencies audited

---

## Reporting Security Issues

Report security vulnerabilities:

1. **Email**: Create issue with `[SECURITY]` prefix (private if sensitive)
2. **GitHub Security Advisories**: Use repository security tab

**Do NOT** post details of unpatched vulnerabilities publicly.

---

## Related Documentation

- [CI Practices](./ci.md) - Automated security checks
- [Release Process](./releasing.md) - Secure release workflow
