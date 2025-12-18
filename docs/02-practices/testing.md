# Testing Practices

Testing strategies and patterns for AgileFlow.

---

## Current State

AgileFlow is primarily a documentation and agent framework (markdown, yaml, shell scripts). The codebase has:

- **CLI tool**: JavaScript (CommonJS) in `packages/cli/tools/`
- **Agent prompts**: Markdown files
- **Skills**: Markdown files
- **Experts**: YAML + Markdown files

Currently no automated tests are configured (`npm test` outputs placeholder message).

---

## Test Strategy

### Unit Testing (Future)

For CLI JavaScript code:

```bash
# Recommended framework
npm install --save-dev jest

# Or for ESM projects
npm install --save-dev vitest
```

**Target files:**
- `packages/cli/tools/cli/agileflow-cli.js`
- `packages/cli/tools/installers/*.js`

### Integration Testing (Future)

Test the complete installation flow:

```bash
# Create temp directory
mkdir /tmp/test-agileflow && cd /tmp/test-agileflow

# Test setup
npx agileflow setup

# Verify files created
ls -la .agileflow/
ls -la .claude/commands/agileflow/
ls -la docs/
```

### Manual Testing Checklist

Before release, verify:

- [ ] `npx agileflow setup` creates correct directory structure
- [ ] All 41 commands are installed in `.claude/commands/agileflow/`
- [ ] All 26 agents are installed in `.agileflow/agents/`
- [ ] IDE installers work (Claude Code, Cursor, Windsurf)
- [ ] `agileflow status` shows correct version
- [ ] `agileflow update` detects/applies updates

---

## Test Patterns

### AAA Pattern

```javascript
// Arrange
const config = { ide: 'claude' };

// Act
const result = await installForIde(config);

// Assert
expect(result.files).toContain('.claude/commands/agileflow/');
```

### Fixtures

Store test fixtures in `packages/cli/tests/fixtures/`:

```
tests/
├── fixtures/
│   ├── sample-project/
│   └── expected-output/
├── unit/
│   └── cli.test.js
└── integration/
    └── setup.test.js
```

---

## Running Tests

```bash
# All tests (when configured)
npm run test:all

# Watch mode (development)
npm test -- --watch

# Coverage
npm test -- --coverage
```

---

## Coverage Targets

| Category | Target | Rationale |
|----------|--------|-----------|
| CLI core | 80% | Critical path for users |
| Installers | 70% | Multiple IDE variations |
| Utilities | 60% | Support code |

---

## Session Harness Integration

The AgileFlow `/agileflow:verify` command tracks test status per story:

```json
{
  "US-0042": {
    "test_status": "passing",
    "last_verified": "2025-12-17T10:00:00Z"
  }
}
```

Before marking story complete:
1. Run `/agileflow:verify`
2. Check test_status is "passing"
3. Only then update status to "in-review"

---

## Related Documentation

- [CI Practices](./ci.md) - CI/CD configuration
- [Session Harness](../04-architecture/babysit-mentor-system.md#session-harness)
- [Testing Agent](../../packages/cli/src/core/agents/testing.md)
