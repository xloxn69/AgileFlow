import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { LottieAsset } from '@/components/lottie-asset';
import type { LandingContent } from '@/lib/landing-content';

export function IDEIntegrations({ cards }: { cards: LandingContent['ideCards'] }) {
  return (
    <section aria-label="IDE integrations" className="py-20 sm:py-24 md:py-28">
      <Container>
        <div className="grid gap-10">
          <Reveal>
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
              {cards.heading}
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            {cards.cards.map((card, idx) => (
              <Reveal key={card.name} delay={idx * 0.06}>
                <div className="surface rounded-card p-6 shadow-tile transition-shadow hover:shadow-tileHover">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full border border-[var(--border-subtle)] bg-white/60 p-3">
                      <LottieAsset src={card.lottieSrc} className="h-12 w-12" posterFrame={10} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold tracking-[-0.01em] text-[var(--text-primary)]">
                        {card.name}
                      </div>
                      <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[var(--border-default)] bg-[var(--bg-code)] px-3 py-2 font-mono text-[13px] text-[var(--text-secondary)]">
                        {card.path}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

