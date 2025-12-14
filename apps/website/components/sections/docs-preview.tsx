import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import { LottieAsset } from '@/components/lottie-asset';
import type { LandingContent } from '@/lib/landing-content';

export function DocsPreview({ content }: { content: LandingContent['docsPreview'] }) {
  return (
    <section id="docs" className="scroll-mt-24 py-20 sm:py-24 md:py-28">
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
                {content.heading}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content.subhead}</p>
            </Reveal>

            <Reveal className="mt-6">
              <div className="rounded-card border border-[var(--border-default)] bg-[var(--bg-code)] p-5 shadow-tile">
                <div className="code-shiki text-sm" dangerouslySetInnerHTML={{ __html: content.treeHtml }} />
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <div className="rounded-card border border-[var(--border-default)] bg-white/70 p-5 shadow-tile">
                <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">{content.callout.title}</div>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{content.callout.body}</p>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal>
              <div className="surface rounded-card shadow-tile">
                <div className="border-b border-[var(--border-subtle)] px-5 py-4">
                  <div className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
                    Folder tree build
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="rounded-card border border-[var(--border-subtle)] bg-white/60 p-4">
                    <LottieAsset src={content.lottieSrc} className="h-[320px] w-full" posterFrame={20} />
                  </div>
                  <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                    docs/09-agents/ is designed to stay auditable.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

