#!/bin/bash
#
# AgileFlow Automated Release Script
#
# Usage: ./scripts/release.sh <version> <release-title>
# Example: ./scripts/release.sh 2.32.0 "Dynamic Content Injection System"
#
# This script automates the entire release process:
# 1. Syncs README from root to packages/cli/
# 2. Updates CHANGELOG.md with commits since last tag (auto-parsed)
# 3. Bumps version in packages/cli/package.json
# 4. Bumps version in root package.json
# 5. Commits and pushes all changes
# 6. Pushes to GitHub
# 7. Creates and pushes git tag
# 8. Creates GitHub release
# → GitHub Actions automatically publishes to npm
#

set -e  # Exit on error

VERSION=$1
TITLE=$2

# Validate arguments
if [ -z "$VERSION" ]; then
  echo "Error: Version number required"
  echo "Usage: ./scripts/release.sh <version> <release-title>"
  echo "Example: ./scripts/release.sh 2.32.0 \"Dynamic Content Injection\""
  exit 1
fi

if [ -z "$TITLE" ]; then
  echo "Error: Release title required"
  echo "Usage: ./scripts/release.sh <version> <release-title>"
  echo "Example: ./scripts/release.sh 2.32.0 \"Dynamic Content Injection\""
  exit 1
fi

echo "Starting release process for v$VERSION - $TITLE"
echo ""

# Step 1: Sync README from root to CLI (root is source of truth)
echo "Step 1: Syncing README.md from root to packages/cli/..."
cp README.md packages/cli/README.md

# Step 2: Update CHANGELOG.md
echo "Step 2: Updating CHANGELOG.md..."
CHANGELOG_FILE="packages/cli/CHANGELOG.md"
DATE=$(date +%Y-%m-%d)

# Get the last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

# Get commits since last tag, parse conventional commits
if [ -n "$LAST_TAG" ]; then
  COMMITS=$(git log ${LAST_TAG}..HEAD --pretty=format:"%s" --no-merges 2>/dev/null || echo "")
else
  COMMITS=$(git log --pretty=format:"%s" --no-merges -20 2>/dev/null || echo "")
fi

# Parse commits into categories
ADDED=""
CHANGED=""
FIXED=""

while IFS= read -r commit; do
  [ -z "$commit" ] && continue
  # Skip version bump commits
  [[ "$commit" == *"bump version"* ]] && continue
  [[ "$commit" == *"chore: bump"* ]] && continue

  if [[ "$commit" == feat:* ]] || [[ "$commit" == feat\(*\):* ]]; then
    # Remove prefix and add to ADDED
    msg=$(echo "$commit" | sed 's/^feat[^:]*: //')
    ADDED="${ADDED}- ${msg}\n"
  elif [[ "$commit" == fix:* ]] || [[ "$commit" == fix\(*\):* ]]; then
    msg=$(echo "$commit" | sed 's/^fix[^:]*: //')
    FIXED="${FIXED}- ${msg}\n"
  elif [[ "$commit" == refactor:* ]] || [[ "$commit" == perf:* ]] || [[ "$commit" == chore:* ]]; then
    msg=$(echo "$commit" | sed 's/^[a-z]*[^:]*: //')
    CHANGED="${CHANGED}- ${msg}\n"
  fi
done <<< "$COMMITS"

# Build the new changelog section
NEW_SECTION="## [${VERSION}] - ${DATE}\n\n"

if [ -n "$ADDED" ]; then
  NEW_SECTION="${NEW_SECTION}### Added\n${ADDED}\n"
fi

if [ -n "$CHANGED" ]; then
  NEW_SECTION="${NEW_SECTION}### Changed\n${CHANGED}\n"
fi

if [ -n "$FIXED" ]; then
  NEW_SECTION="${NEW_SECTION}### Fixed\n${FIXED}\n"
fi

# If no categorized commits, add the title as the main change
if [ -z "$ADDED" ] && [ -z "$CHANGED" ] && [ -z "$FIXED" ]; then
  NEW_SECTION="${NEW_SECTION}### Added\n- ${TITLE}\n\n"
fi

# Insert new section after ## [Unreleased]
if [ -f "$CHANGELOG_FILE" ]; then
  # Create temp file with new content
  awk -v section="$NEW_SECTION" '
    /^## \[Unreleased\]/ {
      print
      print ""
      printf section
      next
    }
    { print }
  ' "$CHANGELOG_FILE" > "${CHANGELOG_FILE}.tmp"
  mv "${CHANGELOG_FILE}.tmp" "$CHANGELOG_FILE"
  echo "  Updated $CHANGELOG_FILE with v$VERSION changes"
else
  echo "  Warning: $CHANGELOG_FILE not found, skipping changelog update"
fi

# Step 3: Bump version in packages/cli/package.json
echo "Step 3: Bumping version in packages/cli/package.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" packages/cli/package.json

# Step 4: Bump version in root package.json
echo "Step 4: Bumping version in root package.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json

# Step 5: Commit changes
echo ""
echo "Step 5: Committing changes..."
git add README.md packages/cli/README.md packages/cli/package.json package.json packages/cli/CHANGELOG.md
git commit -m "chore: bump version to v${VERSION}"

# Step 6: Push to GitHub
echo "Step 6: Pushing to GitHub..."
git push origin main

# Step 7: Create and push git tag
echo "Step 7: Creating and pushing git tag v${VERSION}..."
git tag -a v${VERSION} -m "Release v${VERSION} - ${TITLE}"
git push origin v${VERSION}

# Step 8: Create GitHub release with editor for notes
echo "Step 8: Creating GitHub release..."
echo ""
echo "Enter release notes (opens editor)..."
gh release create v${VERSION} \
  --title "v${VERSION} - ${TITLE}" \
  --generate-notes \
  --latest

echo ""
echo "Release complete!"
echo ""
echo "Next steps:"
echo "   1. GitHub Actions is now publishing to npm"
echo "   2. Check: https://github.com/projectquestorg/AgileFlow/actions"
echo "   3. Verify: npm view agileflow version"
echo ""
