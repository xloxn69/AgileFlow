import { Terminal, FolderTree, GitPullRequest } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { LottiePlayer } from '@/components/ui/LottiePlayer';
import { Pill } from '@/components/ui/Pill';

export async function HowItWorks() {
  return (
    <Section id="how" alternate>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <Pill>How it works</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              Install, scaffold, run.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              AgileFlow turns conventions into versioned files: templates, agents, ADRs,
              and commands that stay readable in git.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <div className="mt-6 text-sm text-muted">Everything is versioned. Nothing is hidden.</div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-card border border-border bg-white p-5 shadow-hairline">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tightish">
                  <Terminal className="h-4 w-4 text-muted" />
                  Install
                </div>
                <span className="text-xs font-medium tracking-caps text-muted">step 01</span>
              </div>

              <div className="mt-4">
                <div className="rounded-tile border border-border bg-panel p-2">
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <input
                      defaultChecked
                      type="radio"
                      name="installTab"
                      id="install-npm"
                      className="peer/npm sr-only"
                    />
                    <input
                      type="radio"
                      name="installTab"
                      id="install-npx"
                      className="peer/npx sr-only"
                    />
                    <label
                      htmlFor="install-npm"
                      className="cursor-pointer rounded-full border border-transparent bg-white px-3 py-2 text-center font-medium text-secondary transition peer-checked/npm:border-border peer-checked/npm:text-ink"
                    >
                      npm
                    </label>
                    <label
                      htmlFor="install-npx"
                      className="cursor-pointer rounded-full border border-transparent bg-white px-3 py-2 text-center font-medium text-secondary transition peer-checked/npx:border-border peer-checked/npx:text-ink"
                    >
                      npx
                    </label>

                    <div className="col-span-2 mt-2 hidden peer-checked/npm:block">
                      <CodeBlock label="Install" lang="bash" code="npm install -D agileflow" />
                    </div>
                    <div className="col-span-2 mt-2 hidden peer-checked/npx:block">
                      <CodeBlock label="Setup" lang="bash" code="npx agileflow setup" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 h-20">
                <LottiePlayer
                  src="/lottie/terminal-typing.json"
                  className="h-full w-full"
                  poster={<div className="h-12 w-12 rounded-xl border border-border bg-white" />}
                />
              </div>
            </div>

            <div className="rounded-card border border-border bg-white p-5 shadow-hairline">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tightish">
                  <FolderTree className="h-4 w-4 text-muted" />
                  Scaffold
                </div>
                <span className="text-xs font-medium tracking-caps text-muted">step 02</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                A docs-as-code tree snaps into place—templates, process, and agents.
              </p>

              <div className="mt-4 rounded-tile border border-border bg-white px-4 py-4 shadow-hairline">
                <div className="space-y-1 font-mono text-[12px] leading-relaxed text-secondary">
                  <div>docs/00-meta/</div>
                  <div>docs/01-process/</div>
                  <div>docs/02-planning/</div>
                  <div>docs/03-stories/</div>
                  <div>docs/04-adrs/</div>
                  <div>docs/09-agents/</div>
                </div>
              </div>

              <div className="mt-5 h-20">
                <LottiePlayer
                  src="/lottie/docs-tree-growth.json"
                  className="h-full w-full"
                  poster={<div className="h-12 w-12 rounded-xl border border-border bg-white" />}
                />
              </div>
            </div>

            <div className="rounded-card border border-border bg-white p-5 shadow-hairline">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold tracking-tightish">
                  <GitPullRequest className="h-4 w-4 text-muted" />
                  Run the workflow
                </div>
                <span className="text-xs font-medium tracking-caps text-muted">step 03</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-secondary">
                Commands generate files, keep status traceable, and prep PR-ready output.
              </p>

              <div className="mt-4">
                <CodeBlock
                  label="Example"
                  lang="bash"
                  code={[
                    'agileflow story create --epic "Repo-native delivery"',
                    'agileflow adr record --title "Verification harness"',
                    'agileflow status',
                  ].join('\n')}
                />
              </div>

              <div className="mt-5 h-20">
                <LottiePlayer
                  src="/lottie/command-flow.json"
                  className="h-full w-full"
                  poster={<div className="h-12 w-12 rounded-xl border border-border bg-white" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

