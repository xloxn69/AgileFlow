'use client';

import { Terminal, TypingAnimation, AnimatedSpan } from './terminal';

interface AgileFlowTerminalProps {
  version: string;
  commands: number;
  agents: number;
  skills: number;
}

export function AgileFlowTerminal({ version, commands, agents, skills }: AgileFlowTerminalProps) {
  return (
    <Terminal className="font-mono">
      <TypingAnimation duration={30}>xloxn69@Mac-mini jottyai-mobile % npx agileflow setup</TypingAnimation>
      <AnimatedSpan className="text-[#e8683a]">
        {` █████╗  ██████╗ ██╗██╗     ███████╗███████╗██╗      ██████╗ ██╗    ██╗`}
      </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a]">
        {`██╔══██╗██╔════╝ ██║██║     ██╔════╝██╔════╝██║     ██╔═══██╗██║    ██║`}
      </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a]">
        {`███████║██║  ███╗██║██║     █████╗  █████╗  ██║     ██║   ██║██║ █╗ ██║`}
      </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a]">
        {`██╔══██║██║   ██║██║██║     ██╔══╝  ██╔══╝  ██║     ██║   ██║██║███╗██║`}
      </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a]">
        {`██║  ██║╚██████╔╝██║███████╗███████╗██║     ███████╗╚██████╔╝╚███╔███╔╝`}
      </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a]">
        {`╚═╝  ╚═╝ ╚═════╝ ╚═╝╚══════╝╚══════╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝`}
      </AnimatedSpan>
      <AnimatedSpan className="text-gray-500">{`  AgileFlow v${version} - AI-Driven Agile Development`}</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#4ec9b0]">? Where would you like to install AgileFlow? <span className="text-gray-400">.</span></AnimatedSpan>
      <AnimatedSpan className="text-[#4ec9b0]">? Select your IDE(s): <span className="text-gray-400">Claude Code</span></AnimatedSpan>
      <AnimatedSpan className="text-[#4ec9b0]">? What should agents call you? <span className="text-gray-400">Developer</span></AnimatedSpan>
      <AnimatedSpan className="text-[#4ec9b0]">? AgileFlow installation folder name: <span className="text-gray-400">.agileflow</span></AnimatedSpan>
      <AnimatedSpan className="text-[#4ec9b0]">? Documentation folder name: <span className="text-gray-400">docs</span></AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a] font-bold">Setting Up AgileFlow</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">Target: /Users/xloxn69/Desktop/jottyai-mobile</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✔ Core installation complete</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✓ Installed {agents} agents</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✓ Installed {commands} commands</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✓ Installed {skills} skills</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a] font-bold">Configuring IDEs</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan>  Setting up Claude Code...</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Claude Code configured:</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">    - {commands} commands installed</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">    - {agents} agents installed</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">    - Path: .claude/commands/AgileFlow</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a] font-bold">Creating Documentation Structure</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">Folder: docs/</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#e8683a]">Creating docs/ structure...</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/00-meta/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/01-brainstorming/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/02-practices/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/03-decisions/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/04-architecture/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/05-epics/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/06-stories/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/07-testing/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/08-project/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/09-agents/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/10-research/README.md (already exists)</AnimatedSpan>
      <AnimatedSpan className="text-gray-500">  ⊘ Skipped docs/09-agents/status.json (already exists)</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✨ Docs structure created: 0 directories, 0 files</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">   20 files skipped (already exist)</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✨ Setup complete!</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="font-bold">Get started:</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">  Open your IDE and use /agileflow:help</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">  Run 'npx agileflow status' to check setup</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">  Run 'npx agileflow update' to get updates</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-gray-500">Installed to: /Users/xloxn69/Desktop/jottyai-mobile/.agileflow</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <TypingAnimation duration={30}>xloxn69@Mac-mini jottyai-mobile % </TypingAnimation>
    </Terminal>
  );
}
