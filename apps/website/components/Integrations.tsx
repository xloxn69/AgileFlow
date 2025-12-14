import { Code, CheckCircle2 } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Pill } from '@/components/ui/Pill';
import { Reveal } from '@/components/ui/reveal';
import { MicroDemo } from '@/components/ui/MicroDemo';

const CARDS = [
  {
    title: 'Claude Code',
    path: '.claude/commands/agileflow.yml',
  },
  {
    title: 'Cursor',
    path: '.cursor/rules/agileflow.md',
  },
  {
    title: 'Windsurf',
    path: '.windsurf/agents.json',
  },
  {
    title: 'Framework-agnostic',
    path: 'docs/ (versioned workflow)',
  },
] as const;

export function Integrations() {
  return (
    <Section id="integrations">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <Reveal>
            <Pill>Integrations</Pill>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-5 text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
              Built for modern IDE workflows.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-4 text-base leading-relaxed text-secondary">
              AgileFlow installs as files: commands, rules, and agents that remain portable across editors and frameworks.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="grid gap-4 sm:grid-cols-2">
            {CARDS.map((c, idx) => (
              <Reveal key={c.title} delay={0.04 * Math.min(idx, 4)}>
                <div className="relative overflow-hidden rounded-card border border-border bg-white p-5 shadow-hairline">
                  <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.35] texture-grid" />
                  <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08] texture-noise" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-muted" />
                        <div className="text-sm font-semibold tracking-tightish text-ink">{c.title}</div>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-white px-2.5 py-1 text-xs text-secondary shadow-hairline">
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted" />
                        Supported
                      </div>
                    </div>
                    <div className="h-12 w-12">
                      <MicroDemo name="configCheck" className="h-full w-full" />
                    </div>
                  </div>

                  <div className="relative mt-5 rounded-tile border border-border bg-panel px-4 py-3">
                    <div className="text-xs font-medium tracking-caps text-muted">config path</div>
                    <div className="mt-1 font-mono text-[12px] text-ink">{c.path}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
