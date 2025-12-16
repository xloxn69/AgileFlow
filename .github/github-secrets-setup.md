# GitHub Secrets Setup for Automated npm Publishing

## One-Time Setup Required

The automated npm publishing workflow requires a GitHub Secret to authenticate with npm.

## Steps

### 1. Navigate to Repository Secrets
Go to: https://github.com/projectquestorg/AgileFlow/settings/secrets/actions

Or manually:
1. Go to your repository on GitHub
2. Click "Settings" (top menu)
3. In left sidebar, click "Secrets and variables" → "Actions"

### 2. Create New Secret
1. Click "New repository secret" button
2. Fill in:
   - **Name**: `NPM_TOKEN`
   - **Value**: Your npm authentication token (starts with `npm_`)
3. Click "Add secret"

### 3. Verify Setup
- Secret should appear in the list as `NPM_TOKEN`
- The value will be hidden (encrypted)
- GitHub Actions can now use it via `${{ secrets.NPM_TOKEN }}`

## Security Notes

- ✅ **Secure**: Token is encrypted and never exposed in logs
- ✅ **Private**: Only repository admins can see or edit secrets
- ✅ **Isolated**: Secret is only accessible to GitHub Actions workflows
- ✅ **No commits**: Secrets are never committed to the repository

## How It Works

When you push a git tag (e.g., `v2.31.0`):
1. GitHub Actions workflow triggers (`.github/workflows/npm-publish.yml`)
2. Workflow checks out code and verifies versions
3. Workflow uses `NPM_TOKEN` secret to authenticate
4. Package is published to npm automatically
5. Summary appears in GitHub Actions tab

## Verification

After setup, test by:
1. Creating a test tag: `git tag v0.0.0-test`
2. Pushing the tag: `git push origin v0.0.0-test`
3. Check GitHub Actions tab for workflow run
4. If successful, delete test tag and unpublish test version

## Getting Your npm Token

If you need a new token:
1. Go to https://www.npmjs.com/
2. Click your profile → "Access Tokens"
3. Click "Generate New Token" → "Classic Token"
4. Select "Automation" type
5. Copy the token (starts with `npm_`)
6. Add it to GitHub Secrets as shown above

## Current Status

- ⏳ **Action Required**: npm token needs to be added to GitHub Secrets
- 📝 **Secret Name**: `NPM_TOKEN`
- 🔧 **Workflow File**: `.github/workflows/npm-publish.yml`

Once this is set up, all future releases will automatically publish to npm when you create a git tag!
