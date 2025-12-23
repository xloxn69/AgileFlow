#!/usr/bin/env node
/**
 * obtain-context.js
 *
 * Gathers all project context in a single execution for any AgileFlow command or agent.
 * Optionally registers the command/agent for PreCompact context preservation.
 * Outputs structured summary to reduce tool calls and startup time.
 *
 * Usage:
 *   node scripts/obtain-context.js              # Just gather context
 *   node scripts/obtain-context.js babysit      # Gather + register 'babysit'
 *   node scripts/obtain-context.js mentor       # Gather + register 'mentor'
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Optional: Register command for PreCompact context preservation
const commandName = process.argv[2];
if (commandName) {
  const sessionStatePath = 'docs/09-agents/session-state.json';
  if (fs.existsSync(sessionStatePath)) {
    try {
      const state = JSON.parse(fs.readFileSync(sessionStatePath, 'utf8'));
      state.active_command = { name: commandName, activated_at: new Date().toISOString(), state: {} };
      fs.writeFileSync(sessionStatePath, JSON.stringify(state, null, 2) + '\n');
    } catch (e) {
      // Silently continue if session state can't be updated
    }
  }
}

// ANSI colors
const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
};

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function safeReadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function safeLs(dirPath) {
  try {
    return fs.readdirSync(dirPath);
  } catch {
    return [];
  }
}

function safeExec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function section(title) {
  console.log(`\n${C.cyan}${C.bold}═══ ${title} ═══${C.reset}`);
}

function subsection(title) {
  console.log(`${C.dim}───${C.reset} ${title}`);
}

// ============================================
// MAIN CONTEXT GATHERING
// ============================================

const title = commandName ? `AgileFlow Context [${commandName}]` : 'AgileFlow Context';
console.log(`${C.magenta}${C.bold}${title}${C.reset}`);
console.log(`${C.dim}Generated: ${new Date().toISOString()}${C.reset}`);

// 1. GIT STATUS
section('Git Status');
const branch = safeExec('git branch --show-current') || 'unknown';
const status = safeExec('git status --short') || '';
const statusLines = status.split('\n').filter(Boolean);
const lastCommit = safeExec('git log -1 --format="%h %s"') || 'no commits';

console.log(`Branch: ${C.green}${branch}${C.reset}`);
console.log(`Last commit: ${C.dim}${lastCommit}${C.reset}`);
if (statusLines.length > 0) {
  console.log(`Uncommitted: ${C.yellow}${statusLines.length} file(s)${C.reset}`);
  statusLines.slice(0, 10).forEach(line => console.log(`  ${C.dim}${line}${C.reset}`));
  if (statusLines.length > 10) console.log(`  ${C.dim}... and ${statusLines.length - 10} more${C.reset}`);
} else {
  console.log(`Uncommitted: ${C.green}clean${C.reset}`);
}

// 2. STATUS.JSON - Full Content (this is crucial context)
section('Status.json (Full Content)');
const statusJsonPath = 'docs/09-agents/status.json';
const statusJsonRaw = safeRead(statusJsonPath);
const statusJson = safeReadJSON(statusJsonPath);

if (statusJson) {
  // Show the full JSON content - it's usually not that big and super valuable
  console.log(`${C.dim}${'─'.repeat(50)}${C.reset}`);
  console.log(JSON.stringify(statusJson, null, 2).split('\n').map(l => `  ${l}`).join('\n'));
  console.log(`${C.dim}${'─'.repeat(50)}${C.reset}`);

  // Also provide a quick summary for at-a-glance view
  subsection('Quick Summary');
  const epics = statusJson.epics || {};
  const stories = statusJson.stories || {};
  const epicCount = Object.keys(epics).length;
  const storyCount = Object.keys(stories).length;

  // Count by status
  const byStatus = {};
  Object.entries(stories).forEach(([id, story]) => {
    const s = story.status || 'unknown';
    byStatus[s] = (byStatus[s] || 0) + 1;
  });

  console.log(`  Epics: ${epicCount}, Stories: ${storyCount}`);
  Object.entries(byStatus).forEach(([status, count]) => {
    const color = status === 'in-progress' ? C.yellow :
                  status === 'ready' ? C.green :
                  status === 'blocked' ? C.red :
                  status === 'done' ? C.dim : C.reset;
    console.log(`    ${color}${status}${C.reset}: ${count}`);
  });

  // Highlight READY stories (actionable)
  const readyStories = Object.entries(stories).filter(([_, s]) => s.status === 'ready');
  if (readyStories.length > 0) {
    console.log(`\n  ${C.green}⭐ Ready to Implement:${C.reset}`);
    readyStories.forEach(([id, story]) => {
      console.log(`    ${id}: ${story.title}`);
    });
  }
} else {
  console.log(`${C.dim}No status.json found${C.reset}`);
}

// 3. SESSION STATE
section('Session State');
const sessionState = safeReadJSON('docs/09-agents/session-state.json');
if (sessionState) {
  const current = sessionState.current_session;
  if (current && current.started_at) {
    const started = new Date(current.started_at);
    const duration = Math.round((Date.now() - started.getTime()) / 60000);
    console.log(`Active session: ${C.green}${duration} min${C.reset}`);
    if (current.current_story) {
      console.log(`Working on: ${C.yellow}${current.current_story}${C.reset}`);
    }
  } else {
    console.log(`${C.dim}No active session${C.reset}`);
  }

  const last = sessionState.last_session;
  if (last && last.ended_at) {
    console.log(`Last session: ${C.dim}${last.ended_at} (${last.duration_minutes || '?'} min)${C.reset}`);
    if (last.summary) console.log(`  Summary: ${C.dim}${last.summary}${C.reset}`);
  }

  // Active command (for context preservation)
  if (sessionState.active_command) {
    console.log(`Active command: ${C.cyan}${sessionState.active_command.name}${C.reset}`);
  }
} else {
  console.log(`${C.dim}No session-state.json found${C.reset}`);
}

// 4. DOCS STRUCTURE
section('Documentation');
const docsDir = 'docs';
const docFolders = safeLs(docsDir).filter(f => {
  try {
    return fs.statSync(path.join(docsDir, f)).isDirectory();
  } catch {
    return false;
  }
});

if (docFolders.length > 0) {
  docFolders.forEach(folder => {
    const folderPath = path.join(docsDir, folder);
    const files = safeLs(folderPath);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    const jsonFiles = files.filter(f => f.endsWith('.json') || f.endsWith('.jsonl'));

    let info = [];
    if (mdFiles.length > 0) info.push(`${mdFiles.length} md`);
    if (jsonFiles.length > 0) info.push(`${jsonFiles.length} json`);

    console.log(`  ${C.dim}${folder}/${C.reset} ${info.length > 0 ? `(${info.join(', ')})` : ''}`);
  });
}

// 5. RESEARCH NOTES - Read full content of most recent
section('Research Notes');
const researchDir = 'docs/10-research';
const researchFiles = safeLs(researchDir).filter(f => f.endsWith('.md') && f !== 'README.md');
if (researchFiles.length > 0) {
  // Sort by date (filename starts with YYYYMMDD) - newest first
  researchFiles.sort().reverse();

  // List all research files
  subsection('Available Research Notes');
  researchFiles.forEach(file => {
    console.log(`  ${C.dim}${file}${C.reset}`);
  });

  // Read the most recent research note in FULL (no truncation)
  const mostRecentFile = researchFiles[0];
  const mostRecentPath = path.join(researchDir, mostRecentFile);
  const mostRecentContent = safeRead(mostRecentPath);

  if (mostRecentContent) {
    console.log(`\n${C.green}📄 Most Recent: ${mostRecentFile}${C.reset}`);
    console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`);
    // Full content - no truncation
    console.log(mostRecentContent);
    console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`);
  }
} else {
  console.log(`${C.dim}No research notes${C.reset}`);
}

// 6. BUS MESSAGES (last 5)
section('Recent Agent Messages');
const busPath = 'docs/09-agents/bus/log.jsonl';
const busContent = safeRead(busPath);
if (busContent) {
  const lines = busContent.trim().split('\n').filter(Boolean);
  const recent = lines.slice(-5);
  if (recent.length > 0) {
    recent.forEach(line => {
      try {
        const msg = JSON.parse(line);
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : '?';
        console.log(`  ${C.dim}[${time}]${C.reset} ${msg.from || '?'}: ${msg.type || msg.message || '?'}`);
      } catch {
        console.log(`  ${C.dim}${line.substring(0, 80)}...${C.reset}`);
      }
    });
  } else {
    console.log(`${C.dim}No messages${C.reset}`);
  }
} else {
  console.log(`${C.dim}No bus log found${C.reset}`);
}

// 7. KEY FILES - Read FULL content (no truncation - full context is valuable)
section('Key Context Files');

const keyFilesToRead = [
  { path: 'CLAUDE.md', label: 'CLAUDE.md (Project Instructions)' },
  { path: 'README.md', label: 'README.md (Project Overview)' },
  { path: 'docs/04-architecture/README.md', label: 'Architecture Index' },
  { path: 'docs/02-practices/README.md', label: 'Practices Index' },
  { path: 'docs/08-project/roadmap.md', label: 'Roadmap' },
];

keyFilesToRead.forEach(({ path: filePath, label }) => {
  const content = safeRead(filePath);
  if (content) {
    console.log(`\n${C.green}✓ ${label}${C.reset} ${C.dim}(${filePath})${C.reset}`);
    console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`);
    // Full content - no truncation
    console.log(content);
    console.log(`${C.dim}${'─'.repeat(60)}${C.reset}`);
  } else {
    console.log(`${C.dim}○ ${label} (not found)${C.reset}`);
  }
});

// Also show Claude settings existence
const settingsExists = fs.existsSync('.claude/settings.json');
console.log(`\n  ${settingsExists ? `${C.green}✓${C.reset}` : `${C.dim}○${C.reset}`} .claude/settings.json`);

// 8. EPICS FOLDER
section('Epic Files');
const epicFiles = safeLs('docs/05-epics').filter(f => f.endsWith('.md') && f !== 'README.md');
if (epicFiles.length > 0) {
  epicFiles.forEach(file => {
    console.log(`  ${C.dim}${file}${C.reset}`);
  });
} else {
  console.log(`${C.dim}No epic files${C.reset}`);
}

// FOOTER
console.log(`\n${C.dim}─────────────────────────────────────────${C.reset}`);
console.log(`${C.dim}Context gathered in single execution. Ready for task selection.${C.reset}\n`);
