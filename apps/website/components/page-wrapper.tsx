'use client';

import { Header } from '@/components/header';
import { StickyBanner } from '@/components/ui/sticky-banner';

interface PageWrapperProps {
  children: React.ReactNode;
  version?: string;
}

export function PageWrapper({ children, version }: PageWrapperProps) {
  return (
    <>
      <StickyBanner className="bg-[#e8683a]">
        <p className="text-white">
          {version && (
            <>
              <span className="font-medium">Introducing AgileFlow v{version}</span>
              <span className="mx-2">—</span>
            </>
          )}
          If you like it, give it a star on{' '}
          <a
            href="https://github.com/projectquestorg/AgileFlow"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:no-underline"
          >
            GitHub
          </a>
        </p>
      </StickyBanner>
      <Header />
      {children}
    </>
  );
}
