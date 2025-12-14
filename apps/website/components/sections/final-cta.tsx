'use client';

import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { CommandButton } from '@/components/ui/command-button';
import type { LandingContent } from '@/lib/landing-content';
import { track } from '@/lib/track';

export function FinalCTA({ content }: { content: LandingContent['finalCta'] }) {
  return (
    <section id="install" className="scroll-mt-24 py-20 sm:py-24 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-card border border-[var(--border-default)] bg-white/70 shadow-tile">
          <div className="absolute inset-0 bg-dot-grid opacity-[0.08]" aria-hidden="true" />
          <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-multiply" aria-hidden="true" />

          <div className="relative grid gap-8 px-6 py-10 sm:px-10">
            <div className="max-w-[70ch]">
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
                {content.heading}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{content.subhead}</p>
            </div>

            <div className="grid gap-3 sm:max-w-[640px]">
              <CommandButton command={content.primaryCommand} eventName="cta_install_final" />
              <Link
                href={content.secondaryHref}
                target={content.secondaryHref.startsWith('#') ? undefined : '_blank'}
                rel={content.secondaryHref.startsWith('#') ? undefined : 'noreferrer'}
                className="focus-ring inline-flex h-10 items-center justify-center rounded-full border border-[var(--border-default)] bg-white px-4 text-sm text-[var(--text-primary)] shadow-tile transition-shadow hover:shadow-tileHover"
                onClick={() => track('cta_secondary_final', { href: content.secondaryHref })}
              >
                {content.secondaryLabel}
              </Link>
            </div>

            <div className="text-xs font-medium tracking-wide text-[var(--text-muted)]">
              No paid tiers. No hosted lock-in.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
