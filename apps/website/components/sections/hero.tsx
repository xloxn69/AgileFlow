import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { CommandButton } from '@/components/ui/command-button';
import { Reveal } from '@/components/ui/reveal';
import { LottieAsset } from '@/components/lottie-asset';
import type { LandingContent } from '@/lib/landing-content';
import { LINKS } from '@/lib/links';

export function Hero({ content }: { content: LandingContent['hero'] }) {
  return (
    <section id="product" className="scroll-mt-24 py-20 sm:py-24 md:py-28">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-white/70 px-3 py-1 text-xs font-medium tracking-wide text-[var(--text-secondary)]">
                <span>{content.eyebrow}</span>
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <h1 className="max-w-[22ch] text-[40px] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--text-primary)] sm:text-[46px]">
                {content.headline}
              </h1>
            </Reveal>

            <Reveal className="mt-5">
              <p className="max-w-[60ch] text-[15px] leading-7 text-[var(--text-secondary)]">
                {content.subhead}
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <div className="grid gap-3 sm:max-w-[560px]">
                <CommandButton command={content.primaryCommand} eventName="cta_install_hero" />
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={content.secondaryCta.href}
                    className="focus-ring inline-flex h-10 items-center rounded-full border border-[var(--border-default)] bg-white/70 px-4 text-sm text-[var(--text-primary)] shadow-tile transition-shadow hover:shadow-tileHover"
                  >
                    {content.secondaryCta.label}
                  </Link>
                  <div className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border-default)] bg-white/60 px-4 text-sm text-[var(--text-secondary)]">
                    <span className="text-xs font-medium tracking-wide text-[var(--text-muted)]">Alternative</span>
                    <code className="text-[13px] text-[var(--text-primary)]">{content.altCommand}</code>
                  </div>
                  <a
                    href={LINKS.github}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex h-10 items-center rounded-full px-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-10">
              <dl className="grid gap-3 rounded-card border border-[var(--border-default)] bg-white/70 p-5 text-sm text-[var(--text-secondary)] shadow-tile">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <dt className="font-medium text-[var(--text-primary)]">Developer-native</dt>
                  <dd className="sm:ml-auto sm:text-right">npm install • lives in your repo</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <dt className="font-medium text-[var(--text-primary)]">Repeatable</dt>
                  <dd className="sm:ml-auto sm:text-right">folders • templates • conventions</dd>
                </div>
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                  <dt className="font-medium text-[var(--text-primary)]">Scales</dt>
                  <dd className="sm:ml-auto sm:text-right">solo → team → multi-agent</dd>
                </div>
              </dl>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal className="relative">
              <div className="surface rounded-card shadow-tile">
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-5 py-4">
                  <div className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">System boot</div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-black/15" />
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                    <span className="h-2 w-2 rounded-full bg-black/10" />
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="rounded-card border border-[var(--border-subtle)] bg-white/60 p-4">
                    <LottieAsset src={content.lottieSrc} className="h-[320px] w-full sm:h-[380px]" />
                  </div>
                  <p className="mt-4 text-xs leading-5 text-[var(--text-muted)]">
                    Install → scaffold → record decisions → track lifecycle.
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
