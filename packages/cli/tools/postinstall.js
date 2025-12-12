#!/usr/bin/env node

/**
 * AgileFlow Postinstall Script
 *
 * Automatically runs AgileFlow installation after npm install.
 * Includes smart detection to avoid running in inappropriate contexts.
 */

const { execSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// ANSI color codes for terminal output
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  dim: '\x1b[2m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function shouldSkipInstall() {
  // Skip if environment variable is set
  if (process.env.AGILEFLOW_SKIP_INSTALL === 'true') {
    log('ℹ️  Skipping auto-install (AGILEFLOW_SKIP_INSTALL=true)', 'dim');
    return true;
  }

  // Skip if running in npm cache or npx temp directory
  if (__dirname.includes('_npx') || __dirname.includes('.npm')) {
    log('ℹ️  Skipping auto-install (npm cache or npx temp directory)', 'dim');
    return true;
  }

  // Skip if we're in the AgileFlow monorepo itself (development mode)
  // Check for monorepo structure: packages/cli/tools/postinstall.js
  // __dirname is tools/ so ../ goes to packages/cli/
  const packageJsonPath = path.join(__dirname, '..', 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    if (packageJson.name === 'agileflow') {
      // Check multiple indicators of monorepo development:
      // 1. Parent directory structure (packages/cli pattern)
      const isInPackagesDir = __dirname.includes('/packages/cli/');

      // 2. Workspace root package.json exists
      // Path from tools/ -> packages/cli -> packages -> AgileFlow
      const rootPackageJson = path.join(__dirname, '..', '..', '..', 'package.json');
      let isWorkspaceRoot = false;
      if (fs.existsSync(rootPackageJson)) {
        try {
          const rootPkg = JSON.parse(fs.readFileSync(rootPackageJson, 'utf-8'));
          isWorkspaceRoot = rootPkg.name === 'agileflow-monorepo' || Boolean(rootPkg.workspaces);
        } catch (e) {
          // Ignore parse errors
        }
      }

      // 3. Git repository check (look for .git in monorepo root)
      // Path from tools/ -> packages/cli -> packages -> AgileFlow -> .git
      const gitDir = path.join(__dirname, '..', '..', '..', '.git');
      const isGitRepo = fs.existsSync(gitDir);

      if (isInPackagesDir || isWorkspaceRoot || isGitRepo) {
        log('ℹ️  Skipping auto-install (running in development/monorepo)', 'dim');
        return true;
      }
    }
  }

  // Get the installation directory (user's project root)
  const installDir = process.cwd();

  // Skip if .agileflow or .claude/commands/AgileFlow folder already exists
  const agileflowPath = path.join(installDir, '.agileflow');
  const claudeAgileflowPath = path.join(installDir, '.claude', 'commands', 'AgileFlow');

  if (fs.existsSync(agileflowPath) || fs.existsSync(claudeAgileflowPath)) {
    log('ℹ️  AgileFlow already installed in this project', 'dim');
    return true;
  }

  return false;
}

function runAutoInstall() {
  try {
    console.log(''); // Blank line for spacing
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    log('  AgileFlow Auto-Setup', 'blue');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
    console.log('');

    log('🚀 Setting up AgileFlow in your project...', 'green');
    console.log('');

    // Path to the CLI
    const cliPath = path.join(__dirname, 'cli', 'agileflow-cli.js');

    if (!fs.existsSync(cliPath)) {
      log('⚠️  Could not find AgileFlow CLI. Run "npx agileflow install" manually.', 'yellow');
      return;
    }

    // Run install command with --yes flag (non-interactive)
    execSync(`node "${cliPath}" install --yes`, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    console.log('');
    log('✨ AgileFlow is ready to use!', 'green');
    console.log('');
    log('To skip auto-install in the future, set: AGILEFLOW_SKIP_INSTALL=true', 'dim');
    console.log('');

  } catch (error) {
    console.log('');
    log('⚠️  Auto-installation encountered an issue.', 'yellow');
    log('   You can run "npx agileflow install" manually to complete setup.', 'yellow');
    console.log('');

    if (process.env.DEBUG) {
      console.error(error);
    }
  }
}

// Main execution
if (shouldSkipInstall()) {
  process.exit(0);
}

runAutoInstall();
