#!/bin/bash
#
# AgileFlow Automated Release Script
#
# Usage: ./scripts/release.sh <version> <release-title>
# Example: ./scripts/release.sh 2.32.0 "Dynamic Content Injection System"
#
# This script automates the entire release process:
# 1. Bumps version in 3 files
# 2. Commits and pushes to GitHub
# 3. Creates and pushes git tag
# 4. Creates GitHub release
# 5. GitHub Actions automatically publishes to npm
#

set -e  # Exit on error

VERSION=$1
TITLE=$2

# Validate arguments
if [ -z "$VERSION" ]; then
  echo "❌ Error: Version number required"
  echo "Usage: ./scripts/release.sh <version> <release-title>"
  echo "Example: ./scripts/release.sh 2.32.0 \"Dynamic Content Injection\""
  exit 1
fi

if [ -z "$TITLE" ]; then
  echo "❌ Error: Release title required"
  echo "Usage: ./scripts/release.sh <version> <release-title>"
  echo "Example: ./scripts/release.sh 2.32.0 \"Dynamic Content Injection\""
  exit 1
fi

echo "🚀 Starting release process for v$VERSION - $TITLE"
echo ""

# Step 1: Bump version in packages/cli/package.json
echo "📝 Step 1: Bumping version in packages/cli/package.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" packages/cli/package.json

# Step 2: Bump version in root package.json
echo "📝 Step 2: Bumping version in root package.json..."
sed -i "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json

# Step 3: Prompt for CHANGELOG update
echo ""
echo "⚠️  IMPORTANT: Update CHANGELOG.md manually now!"
echo "   Add a new [${VERSION}] section at the top with release notes."
echo ""
read -p "Press ENTER when CHANGELOG.md is updated..."

# Step 4: Commit changes
echo ""
echo "📦 Step 4: Committing version bump..."
git add packages/cli/package.json package.json CHANGELOG.md
git commit -m "chore: bump version to v${VERSION}

Updated version in all 3 files and CHANGELOG.md with release notes for v${VERSION}."

# Step 5: Push to GitHub
echo "⬆️  Step 5: Pushing to GitHub..."
git push origin main

# Step 6: Create and push git tag
echo "🏷️  Step 6: Creating and pushing git tag v${VERSION}..."
git tag -a v${VERSION} -m "Release v${VERSION} - ${TITLE}"
git push origin v${VERSION}

# Step 7: Extract changelog notes
echo "📋 Step 7: Extracting changelog notes..."
PREV_VERSION=$(git tag --sort=-v:refname | grep -v "v${VERSION}" | head -1 | sed 's/v//')
awk "/## \[${VERSION}\]/,/## \[${PREV_VERSION}\]/ {if (/## \[${PREV_VERSION}\]/) exit; print}" CHANGELOG.md > /tmp/v${VERSION}-notes.txt

# Step 8: Create GitHub release
echo "🎉 Step 8: Creating GitHub release..."
gh release create v${VERSION} \
  --title "Release v${VERSION} - ${TITLE}" \
  --notes-file /tmp/v${VERSION}-notes.txt \
  --latest

echo ""
echo "✅ Release complete!"
echo ""
echo "📊 Next steps:"
echo "   1. GitHub Actions is now publishing to npm (check: https://github.com/projectquestorg/AgileFlow/actions)"
echo "   2. Verify publish: npm view agileflow version"
echo "   3. Release URL: https://github.com/projectquestorg/AgileFlow/releases/tag/v${VERSION}"
echo ""
