import { ArrowRight } from 'lucide-react';
import { Section } from '@/components/ui/Section';
import { Pill } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/CopyButton';
import { Reveal } from '@/components/ui/Reveal';
import { LottiePlayer } from '@/components/ui/LottiePlayer';

function HeroSystem() {
  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-white shadow-hairline">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] texture-grid"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08] texture-noise" />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 -top-24 h-64 bg-[radial-gradient(circle_at_center,rgba(11,13,16,0.08),transparent_60%)]"
      />

      <div className="relative grid gap-4 p-4 sm:p-6 lg:grid-cols-12 lg:gap-6">
        <div className="rounded-tile border border-border bg-white/80 p-4 lg:col-span-4">
          <div className="mb-3 text-xs font-medium tracking-caps text-muted">repo</div>
          <div className="space-y-1 font-mono text-[12px] leading-relaxed text-secondary">
            <div>docs/00-meta/</div>
            <div>docs/01-process/</div>
            <div>docs/02-planning/</div>
            <div>docs/03-stories/</div>
            <div>docs/04-adrs/</div>
            <div>docs/09-agents/</div>
          </div>
        </div>

        <div className="rounded-tile border border-border bg-white/80 p-4 lg:col-span-5">
          <div className="mb-3 text-xs font-medium tracking-caps text-muted">epics → stories</div>
          <div className="grid gap-2">
            <div className="rounded-xl border border-hairline bg-white px-3 py-2">
              <div className="text-sm font-medium tracking-tightish text-ink">
                Epic: Repo-native delivery
              </div>
              <div className="mt-1 text-xs text-muted">
                6 stories • velocity-aware • versioned
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {[
                'Story: Setup scaffold',
                'Story: Define AC',
                'Story: Record ADR',
                'Story: Verify baseline',
              ].map((t) => (
                <div
                  key={t}
                  className="rounded-xl border border-hairline bg-white px-3 py-2 text-xs text-secondary"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-tile border border-border bg-white/80 p-4 lg:col-span-3">
          <div className="mb-3 text-xs font-medium tracking-caps text-muted">commands</div>
          <div className="space-y-2">
            {['/AgileFlow:setup', '/AgileFlow:story', '/AgileFlow:adr'].map((c) => (
              <div
                key={c}
                className="flex items-center justify-between rounded-full border border-hairline bg-white px-3 py-2 font-mono text-[12px] text-ink"
              >
                <span>{c}</span>
                <span className="text-muted">run</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-12">
          <div className="flex flex-col gap-4 rounded-tile border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium tracking-tightish text-ink">
                System boot
              </div>
              <div className="mt-1 text-xs text-muted">
                Install → scaffold → story → ADR → verify → PR
              </div>
            </div>
            <div className="h-20 w-full sm:h-16 sm:w-64">
              <LottiePlayer
                src="/lottie/hero-system-boot.json"
                className="h-full w-full"
                poster={
                  <div className="h-12 w-12 rounded-full border border-border bg-white shadow-hairline" />
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <Section id="product" className="pt-10 sm:pt-14 lg:pt-20">
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Reveal>
            <Pill>AI-driven agile for modern IDEs</Pill>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tightish text-ink sm:text-5xl">
              Agile delivery, in your repo—powered by AI.
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-secondary">
              Scrum + Kanban + ADRs + docs-as-code—installed into Claude Code, Cursor,
              Windsurf, and more.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <CopyButton
                label="Install in this repo"
                value="npx agileflow setup"
                eventName="cta_install_in_repo"
                variant="primary"
              />
              <Button
                href="#how"
                variant="secondary"
                eventName="cta_see_system"
              >
                See the system <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-6 text-xs text-muted">
              Everything is versioned. Nothing is hidden.
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={0.1}>
            <HeroSystem />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
