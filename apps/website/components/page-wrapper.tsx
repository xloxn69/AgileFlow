'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { StickyBanner } from '@/components/ui/sticky-banner';

interface PageWrapperProps {
  version: string;
  children: React.ReactNode;
}

export function PageWrapper({ version, children }: PageWrapperProps) {
  const [bannerClosed, setBannerClosed] = useState(false);

  return (
    <>
      <Header bannerClosed={bannerClosed} />
      <StickyBanner
        className="bg-gradient-to-r from-[var(--accent)] to-orange-600"
        hideOnScroll
        onClose={() => setBannerClosed(true)}
      >
        <p className="text-white drop-shadow-md">
          <span className="hidden sm:inline">🎉 Introducing AgileFlow v{version}! </span>
          <span className="sm:hidden">🎉 v{version} released! </span>
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
      {children}
    </>
  );
}
