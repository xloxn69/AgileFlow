# AgileFlow Release Scripts

Automated scripts to streamline the release process and reduce cognitive strain.

## 📦 Release Script

**Purpose**: Automate the entire release process from version bump to npm publish.

**Usage**:
```bash
./scripts/release.sh <version> <release-title>
```

**Example**:
```bash
./scripts/release.sh 2.32.0 "Dynamic Content Injection System"
```

**What it does**:
1. ✅ Bumps version in `packages/cli/package.json`
2. ✅ Bumps version in root `package.json`
3. ⏸️ Prompts you to update `CHANGELOG.md` manually (then press ENTER)
4. ✅ Commits changes with conventional commit message
5. ✅ Pushes to GitHub
6. ✅ Creates and pushes git tag `vX.Y.Z`
7. ✅ Extracts changelog notes for this version
8. ✅ Creates GitHub release with extracted notes
9. ✅ GitHub Actions automatically publishes to npm

**Benefits**:
- No manual steps to remember
- Consistent release process every time
- Automatic changelog extraction
- Automatic tag creation
- Zero chance of forgetting to push the tag

## 🎯 Quick Release Flow

For a typical release:

```bash
# 1. Make your changes
git add -A
git commit -m "feat: add new feature"
git push origin main

# 2. Update CHANGELOG.md with new [X.Y.Z] section

# 3. Run release script
./scripts/release.sh 2.32.0 "New Feature Name"

# 4. Wait for GitHub Actions to publish to npm
# (Check: https://github.com/projectquestorg/AgileFlow/actions)

# 5. Verify publish
npm view agileflow version
```

## 🔧 Troubleshooting

**If GitHub Actions fails**:
- Check that `NPM_TOKEN` secret is configured: https://github.com/projectquestorg/AgileFlow/settings/secrets/actions
- Check workflow run logs: https://github.com/projectquestorg/AgileFlow/actions

**If tag already exists**:
```bash
# Delete local and remote tag
git tag -d v2.32.0
git push origin :refs/tags/v2.32.0

# Re-run release script
./scripts/release.sh 2.32.0 "Feature Name"
```

**Manual publish** (if GitHub Actions fails):
```bash
cd packages/cli
npm publish --access public
```
