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
      <AnimatedSpan><span className="text-[#4ec9b0]">user@DevMachine</span> my-project % <TypingAnimation duration={30}>npx agileflow setup</TypingAnimation></AnimatedSpan>
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
      <AnimatedSpan className="text-gray-500">Target: /home/user/projects/my-project</AnimatedSpan>
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
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/00-meta/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/01-brainstorming/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/02-practices/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/03-decisions/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/04-architecture/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/05-epics/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/06-stories/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/07-testing/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/08-project/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/09-agents/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/10-research/README.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/00-meta/agileflow-metadata.json</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/09-agents/status.json</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/09-agents/bus/log.jsonl</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/02-practices/testing.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/02-practices/git-branching.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/02-practices/releasing.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/02-practices/security.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created docs/02-practices/ci.md</AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">  ✓ Created .gitignore</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✨ Docs structure created: 15 directories, 21 files</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-[#6a9955]">✨ Setup complete!</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="font-bold">Get started:</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">  Open your IDE and use /agileflow:help</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">  Run &apos;npx agileflow status&apos; to check setup</AnimatedSpan>
      <AnimatedSpan className="text-gray-400">  Run &apos;npx agileflow update&apos; to get updates</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan className="text-gray-500">Installed to: /home/user/projects/my-project/.agileflow</AnimatedSpan>
      <AnimatedSpan> </AnimatedSpan>
      <AnimatedSpan><span className="text-[#4ec9b0]">user@DevMachine</span> my-project % </AnimatedSpan>
    </Terminal>
  );
}
