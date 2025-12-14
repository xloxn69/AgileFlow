import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/reveal';
import { CopyButton } from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { LINKS } from '@/lib/links';

export function FinalCTA() {
  return (
    <Section id="install" className="py-20 sm:py-24 lg:py-28">
      <div className="relative overflow-hidden rounded-card border border-border bg-white p-8 shadow-hairline sm:p-10">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.55] texture-grid" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.10] texture-noise" />
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-20 -bottom-28 h-72 bg-[radial-gradient(circle_at_center,rgba(11,13,16,0.10),transparent_60%)]"
        />

        <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tightish text-ink sm:text-3xl">
                Install structure. Ship faster. Keep the record.
              </h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="mt-3 text-base leading-relaxed text-secondary">
                Takes ~2 minutes to scaffold. Fully reversible.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <Reveal delay={0.12}>
              <div className="flex flex-wrap gap-2">
                <CopyButton
                  label="npm install agileflow"
                  value="npm install agileflow"
                  eventName="cta_final_install"
                  variant="primary"
                />
                <Button
                  href={LINKS.docs}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                  eventName="cta_docs_click"
                  eventProps={{ location: 'final' }}
                >
                  Read the docs
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
