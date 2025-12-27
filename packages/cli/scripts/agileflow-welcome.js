#!/usr/bin/env node

/**
 * agileflow-welcome.js - Beautiful SessionStart welcome display
 *
 * Shows a transparent ASCII table with:
 * - Project info (name, version, branch, commit)
 * - Story stats (WIP, blocked, completed)
 * - Archival status
 * - Session cleanup status
 * - Last commit
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Session manager path (relative to script location)
const SESSION_MANAGER_PATH = path.join(__dirname, 'session-manager.js');

// Update checker module
let updateChecker;
try {
  updateChecker = require('./check-update.js');
} catch (e) {
  // Update checker not available
}

// ANSI color codes
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',

  brightBlack: '\x1b[90m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightCyan: '\x1b[96m',

  // Brand color (#e8683a)
  brand: '\x1b[38;2;232;104;58m',
};

// Box drawing characters
const box = {
  tl: '╭',
  tr: '╮',
  bl: '╰',
  br: '╯',
  h: '─',
  v: '│',
  lT: '├',
  rT: '┤',
  tT: '┬',
  bT: '┴',
  cross: '┼',
};

function getProjectRoot() {
  let dir = process.cwd();
  while (!fs.existsSync(path.join(dir, '.agileflow')) && dir !== '/') {
    dir = path.dirname(dir);
  }
  return dir !== '/' ? dir : process.cwd();
}

function getProjectInfo(rootDir) {
  const info = {
    name: 'agileflow',
    version: 'unknown',
    branch: 'unknown',
    commit: 'unknown',
    lastCommit: '',
    wipCount: 0,
    blockedCount: 0,
    completedCount: 0,
    readyCount: 0,
    totalStories: 0,
    currentStory: null,
  };

  // Get package info
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(rootDir, 'packages/cli/package.json'), 'utf8')
    );
    info.version = pkg.version || info.version;
  } catch (e) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
      info.version = pkg.version || info.version;
    } catch (e2) {}
  }

  // Get git info
  try {
    info.branch = execSync('git branch --show-current', { cwd: rootDir, encoding: 'utf8' }).trim();
    info.commit = execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
    info.lastCommit = execSync('git log -1 --format="%s"', {
      cwd: rootDir,
      encoding: 'utf8',
    }).trim();
  } catch (e) {}

  // Get status info
  try {
    const statusPath = path.join(rootDir, 'docs/09-agents/status.json');
    if (fs.existsSync(statusPath)) {
      const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
      if (status.stories) {
        for (const [id, story] of Object.entries(status.stories)) {
          info.totalStories++;
          if (story.status === 'in_progress') {
            info.wipCount++;
            if (!info.currentStory) {
              info.currentStory = { id, title: story.title };
            }
          } else if (story.status === 'blocked') {
            info.blockedCount++;
          } else if (story.status === 'completed') {
            info.completedCount++;
          } else if (story.status === 'ready') {
            info.readyCount++;
          }
        }
      }
    }
  } catch (e) {}

  return info;
}

function runArchival(rootDir) {
  const result = { ran: false, threshold: 7, archived: 0, remaining: 0 };

  try {
    const metadataPath = path.join(rootDir, 'docs/00-meta/agileflow-metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      if (metadata.archival?.enabled === false) {
        result.disabled = true;
        return result;
      }
      result.threshold = metadata.archival?.threshold_days || 7;
    }

    const statusPath = path.join(rootDir, 'docs/09-agents/status.json');
    if (!fs.existsSync(statusPath)) return result;

    const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    const stories = status.stories || {};

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - result.threshold);

    let toArchiveCount = 0;
    for (const [id, story] of Object.entries(stories)) {
      if (story.status === 'completed' && story.completed_at) {
        if (new Date(story.completed_at) < cutoffDate) {
          toArchiveCount++;
        }
      }
    }

    result.ran = true;
    result.remaining = Object.keys(stories).length;

    if (toArchiveCount > 0) {
      // Run archival
      try {
        execSync('bash scripts/archive-completed-stories.sh', {
          cwd: rootDir,
          encoding: 'utf8',
          stdio: 'pipe',
        });
        result.archived = toArchiveCount;
        result.remaining -= toArchiveCount;
      } catch (e) {}
    }
  } catch (e) {}

  return result;
}

function clearActiveCommands(rootDir) {
  const result = { ran: false, cleared: 0, commandNames: [] };

  try {
    const sessionStatePath = path.join(rootDir, 'docs/09-agents/session-state.json');
    if (!fs.existsSync(sessionStatePath)) return result;

    const state = JSON.parse(fs.readFileSync(sessionStatePath, 'utf8'));
    result.ran = true;

    if (state.active_commands && state.active_commands.length > 0) {
      result.cleared = state.active_commands.length;
      // Capture command names before clearing
      for (const cmd of state.active_commands) {
        if (cmd.name) result.commandNames.push(cmd.name);
      }
      state.active_commands = [];
    }
    if (state.active_command !== undefined) {
      result.cleared++;
      // Capture single command name
      if (state.active_command.name) {
        result.commandNames.push(state.active_command.name);
      }
      delete state.active_command;
    }

    if (result.cleared > 0) {
      fs.writeFileSync(sessionStatePath, JSON.stringify(state, null, 2) + '\n');
    }
  } catch (e) {}

  return result;
}

function checkParallelSessions(rootDir) {
  const result = {
    available: false,
    registered: false,
    otherActive: 0,
    currentId: null,
    cleaned: 0,
  };

  try {
    // Check if session manager exists
    const managerPath = path.join(rootDir, '.agileflow', 'scripts', 'session-manager.js');
    if (!fs.existsSync(managerPath) && !fs.existsSync(SESSION_MANAGER_PATH)) {
      return result;
    }

    result.available = true;

    // Try to register current session and get status
    const scriptPath = fs.existsSync(managerPath) ? managerPath : SESSION_MANAGER_PATH;

    // Register this session
    try {
      const registerOutput = execSync(`node "${scriptPath}" register`, {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const registerData = JSON.parse(registerOutput);
      result.registered = true;
      result.currentId = registerData.id;
    } catch (e) {
      // Registration failed, continue anyway
    }

    // Get count of other active sessions
    try {
      const countOutput = execSync(`node "${scriptPath}" count`, {
        cwd: rootDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });
      const countData = JSON.parse(countOutput);
      result.otherActive = countData.count || 0;
    } catch (e) {
      // Count failed
    }
  } catch (e) {
    // Session system not available
  }

  return result;
}

function checkPreCompact(rootDir) {
  const result = { configured: false, scriptExists: false, version: null, outdated: false };

  try {
    // Check if PreCompact hook is configured in settings
    const settingsPath = path.join(rootDir, '.claude/settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (settings.hooks?.PreCompact?.length > 0) {
        result.configured = true;
      }
    }

    // Check if the script exists
    const scriptPath = path.join(rootDir, 'scripts/precompact-context.sh');
    if (fs.existsSync(scriptPath)) {
      result.scriptExists = true;
    }

    // Check configured version from metadata
    const metadataPath = path.join(rootDir, 'docs/00-meta/agileflow-metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      if (metadata.features?.precompact?.configured_version) {
        result.version = metadata.features.precompact.configured_version;
        // PreCompact v2.40.0+ has multi-command support
        result.outdated = compareVersions(result.version, '2.40.0') < 0;
      } else if (result.configured) {
        // Hook exists but no version tracked = definitely outdated
        result.outdated = true;
        result.version = 'unknown';
      }
    }
  } catch (e) {}

  return result;
}

// Compare semantic versions: returns -1 if a < b, 0 if equal, 1 if a > b
function compareVersions(a, b) {
  if (!a || !b) return 0;
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const numA = partsA[i] || 0;
    const numB = partsB[i] || 0;
    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }
  return 0;
}

// Check for updates (async but we'll use sync approach for welcome)
async function checkUpdates() {
  const result = {
    available: false,
    installed: null,
    latest: null,
    justUpdated: false,
    previousVersion: null,
    autoUpdate: false,
    changelog: [],
  };

  if (!updateChecker) return result;

  try {
    const updateInfo = await updateChecker.checkForUpdates();
    result.installed = updateInfo.installed;
    result.latest = updateInfo.latest;
    result.available = updateInfo.updateAvailable;
    result.justUpdated = updateInfo.justUpdated;
    result.previousVersion = updateInfo.previousVersion;
    result.autoUpdate = updateInfo.autoUpdate;

    // If just updated, try to get changelog entries
    if (result.justUpdated && result.installed) {
      result.changelog = getChangelogEntries(result.installed);
    }
  } catch (e) {
    // Silently fail - update check is non-critical
  }

  return result;
}

// Parse CHANGELOG.md for entries of a specific version
function getChangelogEntries(version) {
  const entries = [];

  try {
    // Look for CHANGELOG.md in .agileflow or package location
    const possiblePaths = [
      path.join(__dirname, '..', 'CHANGELOG.md'),
      path.join(__dirname, 'CHANGELOG.md'),
    ];

    let changelogContent = null;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        changelogContent = fs.readFileSync(p, 'utf8');
        break;
      }
    }

    if (!changelogContent) return entries;

    // Find the section for this version
    const versionPattern = new RegExp(`## \\[${version}\\].*?\\n([\\s\\S]*?)(?=## \\[|$)`);
    const match = changelogContent.match(versionPattern);

    if (match) {
      // Extract bullet points from Added/Changed/Fixed sections
      const lines = match[1].split('\n');
      for (const line of lines) {
        const bulletMatch = line.match(/^- (.+)$/);
        if (bulletMatch && entries.length < 3) {
          entries.push(bulletMatch[1]);
        }
      }
    }
  } catch (e) {
    // Silently fail
  }

  return entries;
}

// Run auto-update if enabled
async function runAutoUpdate(rootDir) {
  try {
    console.log(`${c.cyan}Updating AgileFlow...${c.reset}`);
    execSync('npx agileflow update', {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: 'inherit',
    });
    return true;
  } catch (e) {
    console.log(`${c.yellow}Auto-update failed. Run manually: npx agileflow update${c.reset}`);
    return false;
  }
}

function getFeatureVersions(rootDir) {
  const result = {
    hooks: { version: null, outdated: false },
    archival: { version: null, outdated: false },
    statusline: { version: null, outdated: false },
    precompact: { version: null, outdated: false },
  };

  // Minimum compatible versions for each feature
  const minVersions = {
    hooks: '2.35.0',
    archival: '2.35.0',
    statusline: '2.35.0',
    precompact: '2.40.0', // Multi-command support
  };

  try {
    const metadataPath = path.join(rootDir, 'docs/00-meta/agileflow-metadata.json');
    if (fs.existsSync(metadataPath)) {
      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

      for (const feature of Object.keys(result)) {
        if (metadata.features?.[feature]?.configured_version) {
          result[feature].version = metadata.features[feature].configured_version;
          result[feature].outdated =
            compareVersions(result[feature].version, minVersions[feature]) < 0;
        }
      }
    }
  } catch (e) {}

  return result;
}

function pad(str, len, align = 'left') {
  const stripped = str.replace(/\x1b\[[0-9;]*m/g, '');
  const diff = len - stripped.length;
  if (diff <= 0) return str;
  if (align === 'right') return ' '.repeat(diff) + str;
  if (align === 'center')
    return ' '.repeat(Math.floor(diff / 2)) + str + ' '.repeat(Math.ceil(diff / 2));
  return str + ' '.repeat(diff);
}

// Truncate string to max length, respecting ANSI codes
function truncate(str, maxLen, suffix = '..') {
  const stripped = str.replace(/\x1b\[[0-9;]*m/g, '');
  if (stripped.length <= maxLen) return str;

  // Find position in original string that corresponds to maxLen - suffix.length visible chars
  const targetLen = maxLen - suffix.length;
  let visibleCount = 0;
  let cutIndex = 0;
  let inEscape = false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\x1b') {
      inEscape = true;
    } else if (inEscape && str[i] === 'm') {
      inEscape = false;
    } else if (!inEscape) {
      visibleCount++;
      if (visibleCount >= targetLen) {
        cutIndex = i + 1;
        break;
      }
    }
  }

  return str.substring(0, cutIndex) + suffix;
}

function formatTable(info, archival, session, precompact, parallelSessions, updateInfo = {}) {
  const W = 58; // inner width
  const R = W - 24; // right column width (34 chars)
  const lines = [];

  // Helper to create a row (auto-truncates right content to fit)
  const row = (left, right, leftColor = '', rightColor = '') => {
    const leftStr = `${leftColor}${left}${leftColor ? c.reset : ''}`;
    const rightTrunc = truncate(right, R);
    const rightStr = `${rightColor}${rightTrunc}${rightColor ? c.reset : ''}`;
    return `${c.dim}${box.v}${c.reset} ${pad(leftStr, 20)} ${c.dim}${box.v}${c.reset} ${pad(rightStr, R)} ${c.dim}${box.v}${c.reset}`;
  };

  // Helper for full-width row (spans both columns)
  const fullRow = (content, color = '') => {
    const contentStr = `${color}${content}${color ? c.reset : ''}`;
    return `${c.dim}${box.v}${c.reset} ${pad(contentStr, W - 1)} ${c.dim}${box.v}${c.reset}`;
  };

  const divider = () =>
    `${c.dim}${box.lT}${box.h.repeat(22)}${box.cross}${box.h.repeat(W - 22)}${box.rT}${c.reset}`;
  const fullDivider = () =>
    `${c.dim}${box.lT}${box.h.repeat(W)}${box.rT}${c.reset}`;
  const topBorder = `${c.dim}${box.tl}${box.h.repeat(22)}${box.tT}${box.h.repeat(W - 22)}${box.tr}${c.reset}`;
  const bottomBorder = `${c.dim}${box.bl}${box.h.repeat(22)}${box.bT}${box.h.repeat(W - 22)}${box.br}${c.reset}`;

  // Header with version and optional update indicator
  const branchColor =
    info.branch === 'main' ? c.green : info.branch.startsWith('fix') ? c.red : c.cyan;

  // Build version string with update status
  let versionStr = `v${info.version}`;
  if (updateInfo.justUpdated && updateInfo.previousVersion) {
    versionStr = `v${info.version} ${c.green}✓${c.reset}${c.dim} (was v${updateInfo.previousVersion})`;
  } else if (updateInfo.available && updateInfo.latest) {
    versionStr = `v${info.version} ${c.yellow}↑${updateInfo.latest}${c.reset}`;
  }

  // Calculate remaining space for branch
  const versionVisibleLen = updateInfo.justUpdated
    ? info.version.length + 20 + (updateInfo.previousVersion?.length || 0)
    : updateInfo.available
      ? info.version.length + 3 + (updateInfo.latest?.length || 0)
      : info.version.length;
  const maxBranchLen = W - 1 - 15 - versionVisibleLen;
  const branchDisplay =
    info.branch.length > maxBranchLen
      ? info.branch.substring(0, Math.max(5, maxBranchLen - 2)) + '..'
      : info.branch;

  const header = `${c.brand}${c.bold}agileflow${c.reset} ${c.dim}${versionStr}${c.reset}  ${branchColor}${branchDisplay}${c.reset} ${c.dim}(${info.commit})${c.reset}`;
  const headerLine = `${c.dim}${box.v}${c.reset} ${pad(header, W - 1)} ${c.dim}${box.v}${c.reset}`;

  lines.push(topBorder);
  lines.push(headerLine);

  // Show update available notification
  if (updateInfo.available && updateInfo.latest && !updateInfo.justUpdated) {
    lines.push(fullDivider());
    lines.push(fullRow(`↑ Update available: v${updateInfo.latest}`, c.yellow));
    lines.push(fullRow(`  Run: npx agileflow update`, c.dim));
  }

  // Show "just updated" changelog
  if (updateInfo.justUpdated && updateInfo.changelog && updateInfo.changelog.length > 0) {
    lines.push(fullDivider());
    lines.push(fullRow(`What's new in v${info.version}:`, c.green));
    for (const entry of updateInfo.changelog.slice(0, 2)) {
      lines.push(fullRow(`• ${truncate(entry, W - 4)}`, c.dim));
    }
    lines.push(fullRow(`Run /agileflow:whats-new for full changelog`, c.dim));
  }

  lines.push(divider());

  // Stories section
  lines.push(
    row(
      'In Progress',
      info.wipCount > 0 ? `${info.wipCount}` : '0',
      c.dim,
      info.wipCount > 0 ? c.yellow : c.dim
    )
  );
  lines.push(
    row(
      'Blocked',
      info.blockedCount > 0 ? `${info.blockedCount}` : '0',
      c.dim,
      info.blockedCount > 0 ? c.red : c.dim
    )
  );
  lines.push(
    row(
      'Ready',
      info.readyCount > 0 ? `${info.readyCount}` : '0',
      c.dim,
      info.readyCount > 0 ? c.cyan : c.dim
    )
  );
  lines.push(
    row(
      'Completed',
      info.completedCount > 0 ? `${info.completedCount}` : '0',
      c.dim,
      info.completedCount > 0 ? c.green : c.dim
    )
  );

  lines.push(divider());

  // Archival section
  if (archival.disabled) {
    lines.push(row('Auto-archival', 'disabled', c.dim, c.dim));
  } else {
    const archivalStatus =
      archival.archived > 0 ? `archived ${archival.archived} stories` : `nothing to archive`;
    lines.push(
      row('Auto-archival', archivalStatus, c.dim, archival.archived > 0 ? c.green : c.dim)
    );
  }

  // Session cleanup
  const sessionStatus = session.cleared > 0 ? `cleared ${session.cleared} command(s)` : `clean`;
  lines.push(row('Session state', sessionStatus, c.dim, session.cleared > 0 ? c.green : c.dim));

  // PreCompact status with version check
  if (precompact.configured && precompact.scriptExists) {
    if (precompact.outdated) {
      const verStr = precompact.version ? ` (v${precompact.version})` : '';
      lines.push(row('Context preserve', `outdated${verStr}`, c.dim, c.yellow));
    } else if (session.commandNames && session.commandNames.length > 0) {
      // Show the preserved command names
      const cmdDisplay = session.commandNames.map(n => `/agileflow:${n}`).join(', ');
      lines.push(row('Context preserve', cmdDisplay, c.dim, c.green));
    } else {
      lines.push(row('Context preserve', 'nothing to compact', c.dim, c.dim));
    }
  } else if (precompact.configured) {
    lines.push(row('Context preserve', 'script missing', c.dim, c.yellow));
  } else {
    lines.push(row('Context preserve', 'not configured', c.dim, c.dim));
  }

  // Parallel sessions status
  if (parallelSessions && parallelSessions.available) {
    if (parallelSessions.otherActive > 0) {
      const sessionStr = `⚠️ ${parallelSessions.otherActive} other active`;
      lines.push(row('Sessions', sessionStr, c.dim, c.yellow));
    } else {
      const sessionStr = parallelSessions.currentId
        ? `✓ Session ${parallelSessions.currentId} (only)`
        : '✓ Only session';
      lines.push(row('Sessions', sessionStr, c.dim, c.green));
    }
  }

  lines.push(divider());

  // Current story (if any) - row() auto-truncates
  if (info.currentStory) {
    lines.push(
      row(
        'Current',
        `${c.blue}${info.currentStory.id}${c.reset}: ${info.currentStory.title}`,
        c.dim,
        ''
      )
    );
  } else {
    lines.push(row('Current', 'No active story', c.dim, c.dim));
  }

  // Last commit - row() auto-truncates
  lines.push(row('Last commit', `${info.commit} ${info.lastCommit}`, c.dim, c.dim));

  lines.push(bottomBorder);

  return lines.join('\n');
}

// Main
async function main() {
  const rootDir = getProjectRoot();
  const info = getProjectInfo(rootDir);
  const archival = runArchival(rootDir);
  const session = clearActiveCommands(rootDir);
  const precompact = checkPreCompact(rootDir);
  const parallelSessions = checkParallelSessions(rootDir);

  // Check for updates (async, cached)
  let updateInfo = {};
  try {
    updateInfo = await checkUpdates();

    // If auto-update is enabled and update available, run it
    if (updateInfo.available && updateInfo.autoUpdate) {
      const updated = await runAutoUpdate(rootDir);
      if (updated) {
        // Re-run welcome after update (the new version will show changelog)
        return;
      }
    }

    // Mark current version as seen to track for next update
    if (updateInfo.justUpdated && updateChecker) {
      updateChecker.markVersionSeen(info.version);
    }
  } catch (e) {
    // Update check failed - continue without it
  }

  console.log(formatTable(info, archival, session, precompact, parallelSessions, updateInfo));

  // Show warning and tip if other sessions are active
  if (parallelSessions.otherActive > 0) {
    console.log('');
    console.log(`${c.yellow}⚠️  Other Claude session(s) active in this repo.${c.reset}`);
    console.log(`${c.dim}   Run /agileflow:session:status to see all sessions.${c.reset}`);
    console.log(`${c.dim}   Run /agileflow:session:new to create isolated workspace.${c.reset}`);
  }
}

main().catch(console.error);
