import 'server-only';
import fs from 'fs';
import path from 'path';

const CLI_ROOT = path.join(process.cwd(), '../../packages/cli/src/core');

function countFiles(dirPath: string, pattern: string): number {
  try {
    const fullPath = path.join(CLI_ROOT, dirPath);
    if (!fs.existsSync(fullPath)) return 0;

    const files = fs.readdirSync(fullPath);
    return files.filter((file) => file.endsWith(pattern)).length;
  } catch (error) {
    console.error(`Error counting files in ${dirPath}:`, error);
    return 0;
  }
}

export function getAgileFlowStats() {
  return {
    commands: countFiles('commands', '.md'),
    agents: countFiles('agents', '.md'),
    skills: countFiles('skills', 'SKILL.md'),
    ides: 3, // Claude Code, Cursor, Windsurf - this is fixed
  };
}
