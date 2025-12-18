# CI/CD Configuration

CI/CD workflows and automation for AgileFlow.

---

## Current Workflow

AgileFlow uses GitHub Actions with a single workflow:

### npm Publish Workflow

**File**: `.github/workflows/npm-publish.yml`

**Trigger**: Git tag push matching `v*.*.*`

```yaml
on:
  push:
    tags:
      - 'v*.*.*'
```

**Steps**:
1. Checkout repository
2. Setup Node.js 18
3. Extract version from tag
4. Verify package.json version matches tag
5. Install dependencies (if package-lock.json exists)
6. Publish to npm with `NPM_TOKEN`

---

## Required Secrets

| Secret | Purpose | Location |
|--------|---------|----------|
| `NPM_TOKEN` | npm publish authentication | GitHub Repo Settings → Secrets |

---

## Triggering a Release

Use the automated release script:

```bash
./scripts/release.sh <version> "<title>"
```

Example:
```bash
./scripts/release.sh 2.37.0 "New Feature Name"
```

The script:
1. Bumps version in `packages/cli/package.json` and root `package.json`
2. Commits: `chore: bump version to vX.Y.Z`
3. Pushes to main
4. Creates and pushes git tag `vX.Y.Z`
5. Creates GitHub release
6. GitHub Actions automatically publishes to npm

---

## Version Verification

The workflow verifies version consistency:

```bash
EXPECTED_VERSION="${{ steps.version.outputs.version }}"
PACKAGE_VERSION=$(node -p "require('./packages/cli/package.json').version")

if [ "$PACKAGE_VERSION" != "$EXPECTED_VERSION" ]; then
  echo "Error: package.json version ($PACKAGE_VERSION) doesn't match tag ($EXPECTED_VERSION)"
  exit 1
fi
```

---

## Manual npm Publish (Emergency Only)

If GitHub Actions fails:

```bash
cd packages/cli
npm publish --access public
```

Requires `NPM_TOKEN` in local `~/.npmrc`.

---

## Future CI Enhancements

### Lint Workflow (Planned)

```yaml
name: Lint

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint:all
```

### Test Workflow (Planned)

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:all
```

---

## Monorepo Scripts

Available workspace scripts:

| Script | Description |
|--------|-------------|
| `npm run build:all` | Build all workspaces |
| `npm run lint:all` | Lint all workspaces |
| `npm run test:all` | Test all workspaces |
| `npm run dev:website` | Run website dev server |
| `npm run dev:docs` | Run docs dev server |

---

## Troubleshooting

### package-lock.json Out of Sync

**Symptom**: GitHub Actions fails with "npm ci" error

**Fix**:
```bash
npm install
git add package-lock.json
git commit -m "chore: update package-lock.json"
git push
# Re-push tag to trigger Actions
```

### Tag Already Exists

**Symptom**: Can't create tag

**Fix**:
```bash
git tag -d v2.37.0
git push origin :refs/tags/v2.37.0
# Create new tag
```

### ENEEDAUTH Error

**Symptom**: npm publish fails with auth error

**Fix**: Verify `NPM_TOKEN` in GitHub Secrets

---

## Related Documentation

- [Release Process](./releasing.md) - Full release workflow
- [Testing Practices](./testing.md) - Testing strategy
