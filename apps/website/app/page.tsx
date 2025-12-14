'use client';

import { useState } from 'react';
import { BackgroundTexture } from '@/components/background-texture';
import { Header } from '@/components/header';
import { StickyBanner } from '@/components/ui/sticky-banner';
import { ScrollDepthTracker } from '@/components/scroll-depth-tracker';
import { Hero } from '@/components/sections/hero';
import { StatsStrip } from '@/components/sections/stats-strip';
import { HowItWorks } from '@/components/sections/how-it-works';
import { BentoFeatures } from '@/components/sections/bento-features';
import { DocsPreview } from '@/components/sections/docs-preview';
import { IDEIntegrations } from '@/components/sections/ide-integrations';
import { CommandsShowcase } from '@/components/sections/commands-showcase';
import { AgentArchitecture } from '@/components/sections/agent-architecture';
import { Testimonials } from '@/components/sections/testimonials';
import { FAQ } from '@/components/sections/faq';
import { FinalCTA } from '@/components/sections/final-cta';
import { Footer } from '@/components/sections/footer';
import { buildLandingContent } from '@/lib/landing-content';
import type { LandingContent } from '@/lib/landing-content';

function PageContent({ content }: { content: LandingContent }) {
  const [bannerClosed, setBannerClosed] = useState(false);

  return (
    <div className="relative">
      <ScrollDepthTracker />
      <Header bannerClosed={bannerClosed} />
      <StickyBanner
        className="bg-gradient-to-r from-[var(--accent)] to-orange-600"
        hideOnScroll
        onClose={() => setBannerClosed(true)}
      >
        <p className="text-white drop-shadow-md">
          🎉 AgileFlow is now open source!{' '}
          <a
            href="https://github.com/projectquestorg/AgileFlow"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline decoration-white/50 transition hover:decoration-white"
          >
            Star us on GitHub
          </a>
        </p>
      </StickyBanner>
      <BackgroundTexture />
      <main id="content" className="pt-28">
        <Hero content={content.hero} />
        <StatsStrip stats={content.stats} />
        <HowItWorks steps={content.howItWorks} />
        <BentoFeatures tiles={content.features} />
        <DocsPreview content={content.docsPreview} />
        <IDEIntegrations cards={content.ideCards} />
        <CommandsShowcase content={content.commands} />
        <AgentArchitecture content={content.agents} />
        <Testimonials content={content.testimonials} />
        <FAQ items={content.faq} />
        <FinalCTA content={content.finalCta} />
        <Footer content={content.footer} />
      </main>
    </div>
  );
}

export default async function Page() {
  const content = await buildLandingContent();
  return <PageContent content={content} />;
}
