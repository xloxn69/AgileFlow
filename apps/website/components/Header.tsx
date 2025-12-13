'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Github, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { CopyButton } from '@/components/CopyButton';
import { LINKS } from '@/lib/links';
import { trackEvent } from '@/lib/analytics';

const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how' },
  { label: 'Features', href: '#features' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Pricing', href: '#pricing' },
] as const;

function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 rounded-full px-2 py-1 focus-ring"
      onClick={() => trackEvent('nav_logo_click')}
    >
      <span
        aria-hidden
        className={cn(
          'relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl border border-border bg-white shadow-hairline',
        )}
      >
        <span className="absolute inset-0 opacity-[0.35] texture-grid" />
        <span className="absolute inset-0 opacity-[0.08] texture-noise" />
        <span className="relative h-2 w-2 rounded-full bg-ink" />
      </span>
      <span className="text-sm font-semibold tracking-tightish text-ink">AgileFlow</span>
    </Link>
  );
}

export function Header() {
  const [stuck, setStuck] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const installCmd = useMemo(() => 'npm install -D agileflow', []);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition duration-200 ease-quiet',
        stuck ? 'backdrop-blur-md bg-white/80 border-b border-hairline' : 'bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
        </div>

        <nav className="hidden items-center gap-6 text-sm text-secondary lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-2 py-1 transition hover:text-ink focus-ring"
              onClick={() => trackEvent('nav_anchor_click', { href: item.href })}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <CopyButton
            label="Start with npm"
            value={installCmd}
            eventName="cta_start_with_npm"
            variant="primary"
          />
          <Button
            href={LINKS.docs}
            variant="ghost"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('cta_docs_click', { location: 'header' })}
          >
            View docs
          </Button>
          <Button
            href={LINKS.github}
            variant="ghost"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent('cta_github_click', { location: 'header' })}
            className="px-3"
          >
            <span className="sr-only">GitHub</span>
            <Github className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="ghost"
            onClick={() => setMenuOpen((v) => !v)}
            className="px-3"
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </Container>

      {menuOpen ? (
        <div className="border-b border-hairline bg-white/90 backdrop-blur-md lg:hidden">
          <Container className="py-4">
            <div className="grid gap-2">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink shadow-hairline focus-ring"
                  onClick={() => {
                    setMenuOpen(false);
                    trackEvent('nav_anchor_click', { href: item.href, mobile: true });
                  }}
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-2 grid gap-2">
                <CopyButton
                  label="Start with npm"
                  value={installCmd}
                  eventName="cta_start_with_npm"
                  variant="primary"
                />
                <Button
                  href={LINKS.docs}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('cta_docs_click', { location: 'mobile_menu' })}
                >
                  View docs
                </Button>
                <Button
                  href={LINKS.github}
                  variant="secondary"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackEvent('cta_github_click', { location: 'mobile_menu' })}
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}

