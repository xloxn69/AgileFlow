'use client';

import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Container } from '@/components/ui/container';
import { cn } from '@/lib/cn';
import { LINKS } from '@/lib/links';
import { track } from '@/lib/track';

type NavItem = { label: string; href: string; kind?: 'anchor' | 'external' };

export function Header() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [isSticky, setIsSticky] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = useMemo<NavItem[]>(
    () => [
      { label: 'Product', href: '#product' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Features', href: '#features' },
      { label: 'Commands', href: '#commands' },
      { label: 'Agents', href: '#agents' },
      { label: 'Testimonials', href: '#testimonials' },
      { label: 'Docs', href: '#docs' },
      { label: 'GitHub', href: LINKS.github, kind: 'external' },
    ],
    [],
  );

  useMotionValueEvent(scrollY, 'change', (value) => setIsSticky(value > 40));

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <a
        href="#content"
        className="focus-ring absolute left-4 top-2 z-[60] -translate-y-20 rounded-full bg-white px-3 py-2 text-sm text-[var(--text-primary)] shadow-tile transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <motion.header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 border-b',
          isSticky || menuOpen ? 'border-[var(--border-default)]' : 'border-transparent',
        )}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                backgroundColor: isSticky || menuOpen ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.0)',
              }
        }
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          backdropFilter: isSticky || menuOpen ? 'blur(12px)' : 'none',
        }}
      >
        <Container className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="focus-ring rounded-md"
              onClick={() => track('nav_home')}
            >
              <Image
                src="/banner.png"
                alt="AgileFlow"
                width={120}
                height={28}
                className="h-7 w-auto"
              />
            </Link>
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
            {nav.slice(0, 7).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-md text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                onClick={() => track('nav_anchor', { href: item.href, label: item.label })}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-md text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              onClick={() => track('nav_github')}
            >
              GitHub
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="#install"
              className={cn(
                'focus-ring hidden h-10 items-center rounded-full px-4 text-sm font-medium md:inline-flex',
                'bg-[var(--accent)] text-white shadow-tile transition-shadow hover:shadow-tileHover',
              )}
              onClick={() => track('cta_install_header')}
            >
              Install
            </Link>
            <a
              href={LINKS.docs}
              target="_blank"
              rel="noreferrer"
              className="focus-ring hidden h-10 items-center rounded-full px-3 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] md:inline-flex"
              onClick={() => track('cta_docs_header')}
            >
              Docs
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="focus-ring hidden h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] md:inline-flex"
              aria-label="AgileFlow on GitHub"
              onClick={() => track('cta_github_icon')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.21-.25-4.53-1.11-4.53-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.56 1.38.21 2.4.1 2.65.65.7 1.03 1.59 1.03 2.68 0 3.85-2.32 4.7-4.54 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
              </svg>
            </a>

            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label="Toggle menu"
              onClick={() => {
                setMenuOpen((v) => !v);
                track('nav_mobile_toggle', { open: !menuOpen });
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </Container>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              id="mobile-nav"
              className="md:hidden"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              <Container className="pb-4">
                <div className="surface rounded-card shadow-tile">
                  <div className="grid gap-1 p-2">
                    <Link
                      href="#install"
                      className="focus-ring rounded-xl px-3 py-3 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent)]"
                      onClick={() => {
                        setMenuOpen(false);
                        track('cta_install_mobile');
                      }}
                    >
                      Install
                    </Link>
                    {nav.map((item) =>
                      item.kind === 'external' ? (
                        <a
                          key={item.href}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="focus-ring rounded-xl px-3 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          onClick={() => {
                            setMenuOpen(false);
                            track('nav_mobile_external', { href: item.href, label: item.label });
                          }}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="focus-ring rounded-xl px-3 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                          onClick={() => {
                            setMenuOpen(false);
                            track('nav_mobile_anchor', { href: item.href, label: item.label });
                          }}
                        >
                          {item.label}
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>

      {/* Gradient fade overlay */}
      <motion.div
        className="pointer-events-none fixed left-0 right-0 top-16 z-40 h-24"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                opacity: isSticky ? 1 : 0,
              }
        }
        transition={{ duration: 0.2, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
    </>
  );
}

