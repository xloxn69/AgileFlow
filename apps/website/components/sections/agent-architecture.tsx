import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { MessageBusDemo } from '@/components/ui/message-bus-demo';
import type { LandingContent } from '@/lib/landing-content';

export function AgentArchitecture({ content }: { content: LandingContent['agents'] }) {
  return (
    <section id="agents" className="scroll-mt-24 py-20 sm:py-24 md:py-28">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
                {content.heading}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content.subhead}</p>
            </Reveal>

            <Reveal className="mt-6">
              <div className="rounded-card border border-[var(--border-default)] bg-white/70 p-5 text-sm leading-6 text-[var(--text-secondary)] shadow-tile">
                {content.highlight}
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <div className="surface rounded-card shadow-tile">
                <div className="border-b border-[var(--border-subtle)] px-5 py-4">
                  <div className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">Message bus</div>
                </div>
                <div className="p-5">
                  <div className="rounded-card border border-[var(--border-subtle)] bg-white/60">
                    <MessageBusDemo className="h-[260px]" />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal>
              <div className="grid gap-4 sm:grid-cols-2">
                {content.keyAgents.map((agent) => (
                  <div
                    key={agent.name}
                    className="surface rounded-card p-5 shadow-tile transition-shadow hover:shadow-tileHover"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                        {agent.name}
                      </div>
                      <div className="rounded-full border border-[var(--border-subtle)] bg-white/60 px-2 py-1 font-mono text-[11px] text-[var(--text-muted)]">
                        agent
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{agent.summary}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

