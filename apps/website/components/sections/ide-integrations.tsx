'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/container';
import { Reveal } from '@/components/ui/reveal';
import type { LandingContent } from '@/lib/landing-content';
import { cn } from '@/lib/cn';

const ideIcons: Record<string, React.ReactNode> = {
  claude: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  ),
  cursor: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L8.22 13.44L2.77 18.9C2.35 19.31 1.67 19.07 1.59 18.5L0.02 3.77C-0.06 3.13 0.52 2.59 1.16 2.67L15.89 4.24C16.46 4.32 16.7 5 16.29 5.42L10.85 10.87L18.91 14.96C19.41 15.19 19.62 15.79 19.38 16.29L13.64 21.97Z" />
    </svg>
  ),
  windsurf: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  ),
  codex: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364l2.0201-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.4048-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6099-1.4997Z" />
    </svg>
  ),
};

export function IDEIntegrations({ data }: { data: LandingContent['ideIntegrations'] }) {
  const [activeIde, setActiveIde] = useState(data.ides[0].id);
  const activeData = data.ides.find((ide) => ide.id === activeIde) ?? data.ides[0];

  return (
    <section aria-label="IDE integrations" className="py-20 sm:py-24 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="text-center">
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[32px]">
                {data.heading}
              </h2>
              <p className="mt-3 text-[var(--text-secondary)]">{data.subhead}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10">
              {/* Tab buttons */}
              <div className="flex justify-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-subtle)] p-1">
                {data.ides.map((ide) => (
                  <button
                    key={ide.id}
                    onClick={() => setActiveIde(ide.id)}
                    className={cn(
                      'relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                      activeIde === ide.id
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    {activeIde === ide.id && (
                      <motion.div
                        layoutId="ide-tab-bg"
                        className="absolute inset-0 rounded-full bg-white shadow-sm"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      {ideIcons[ide.id]}
                      <span className="hidden sm:inline">{ide.name}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Content panel */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIde}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6"
                >
                  <div className="surface rounded-card p-6 shadow-tile sm:p-8">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                        {ideIcons[activeData.id]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[var(--text-primary)]">{activeData.name}</h3>
                        {activeData.note && (
                          <span className="text-xs text-[var(--text-tertiary)]">{activeData.note}</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      {/* Config path */}
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                          Config location
                        </div>
                        <div className="mt-2 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-code)] px-3 py-2 font-mono text-sm text-[var(--text-secondary)]">
                          {activeData.configPath}
                        </div>
                      </div>

                      {/* Setup command */}
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                          Setup command
                        </div>
                        <div className="mt-2 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-code)] px-3 py-2 font-mono text-sm text-[var(--text-secondary)]">
                          <span className="text-[var(--accent)]">$</span> {activeData.setupCommand}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mt-6">
                      <div className="text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
                        Features
                      </div>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {activeData.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                            <svg
                              className="h-4 w-4 flex-shrink-0 text-[var(--accent)]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
