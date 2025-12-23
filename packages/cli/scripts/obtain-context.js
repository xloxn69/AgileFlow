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

// 2. STATUS.JSON - Stories & Epics
section('Stories & Epics');
const statusJson = safeReadJSON('docs/09-agents/status.json');
if (statusJson) {
  // Epics summary
  const epics = statusJson.epics || {};
  const epicList = Object.entries(epics);
  if (epicList.length > 0) {
    subsection('Epics');
    epicList.forEach(([id, epic]) => {
      const statusColor = epic.status === 'complete' ? C.green : epic.status === 'active' ? C.yellow : C.dim;
      console.log(`  ${id}: ${epic.title} ${statusColor}[${epic.status}]${C.reset}`);
    });
  }

  // Stories summary by status
  const stories = statusJson.stories || {};
  const storyList = Object.entries(stories);
  const byStatus = {};
  storyList.forEach(([id, story]) => {
    const s = story.status || 'unknown';
    if (!byStatus[s]) byStatus[s] = [];
    byStatus[s].push({ id, ...story });
  });

  // Priority order for display
  const statusOrder = ['in-progress', 'ready', 'blocked', 'draft', 'in-review', 'done'];

  subsection('Stories by Status');
  statusOrder.forEach(status => {
    if (byStatus[status] && byStatus[status].length > 0) {
      const color = status === 'in-progress' ? C.yellow :
                    status === 'ready' ? C.green :
                    status === 'blocked' ? C.red :
                    status === 'done' ? C.dim : C.reset;
      console.log(`  ${color}${status}${C.reset}: ${byStatus[status].length}`);
      byStatus[status].slice(0, 5).forEach(story => {
        console.log(`    ${C.dim}${story.id}: ${story.title}${C.reset}`);
      });
      if (byStatus[status].length > 5) {
        console.log(`    ${C.dim}... and ${byStatus[status].length - 5} more${C.reset}`);
      }
    }
  });

  // Show READY stories prominently (these are actionable)
  if (byStatus['ready'] && byStatus['ready'].length > 0) {
    subsection(`${C.green}⭐ Ready to Implement${C.reset}`);
    byStatus['ready'].forEach(story => {
      console.log(`  ${story.id}: ${story.title} (${story.epic || 'no epic'})`);
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

// 5. RESEARCH NOTES
section('Research Notes');
const researchDir = 'docs/10-research';
const researchFiles = safeLs(researchDir).filter(f => f.endsWith('.md') && f !== 'README.md');
if (researchFiles.length > 0) {
  // Sort by date (filename starts with YYYYMMDD)
  researchFiles.sort().reverse();
  researchFiles.slice(0, 5).forEach(file => {
    console.log(`  ${C.dim}${file}${C.reset}`);
  });
  if (researchFiles.length > 5) {
    console.log(`  ${C.dim}... and ${researchFiles.length - 5} more${C.reset}`);
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

// 7. KEY FILES PRESENCE
section('Key Files');
const keyFiles = [
  { path: 'CLAUDE.md', label: 'CLAUDE.md (project instructions)' },
  { path: 'README.md', label: 'README.md (project overview)' },
  { path: 'docs/08-project/roadmap.md', label: 'Roadmap' },
  { path: 'docs/02-practices/README.md', label: 'Practices index' },
  { path: '.claude/settings.json', label: 'Claude settings' },
];

keyFiles.forEach(({ path: filePath, label }) => {
  const exists = fs.existsSync(filePath);
  const icon = exists ? `${C.green}✓${C.reset}` : `${C.dim}○${C.reset}`;
  console.log(`  ${icon} ${label}`);
});

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
