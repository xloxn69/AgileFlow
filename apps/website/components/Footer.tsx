import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { LINKS } from '@/lib/links';

type FooterLink = { label: string; href: string; external?: boolean };
type FooterColumn = { title: string; links: FooterLink[] };

const COLS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#how' },
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: LINKS.docs, external: true },
      { label: 'Changelog', href: 'https://github.com/projectquestorg/AgileFlow/blob/main/CHANGELOG.md', external: true },
      { label: 'README', href: 'https://github.com/projectquestorg/AgileFlow#readme', external: true },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'GitHub', href: LINKS.github, external: true },
      { label: 'Issues', href: 'https://github.com/projectquestorg/AgileFlow/issues', external: true },
      { label: 'Discussions', href: 'https://github.com/projectquestorg/AgileFlow/discussions', external: true },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'License', href: 'https://github.com/projectquestorg/AgileFlow/blob/main/LICENSE', external: true },
      { label: 'Security', href: 'https://github.com/projectquestorg/AgileFlow/security', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-white">
      <Container className="py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="text-sm font-semibold tracking-tightish text-ink">AgileFlow</div>
            <div className="mt-3 max-w-sm text-sm leading-relaxed text-secondary">
              AI-driven agile development for Claude Code, Cursor, Windsurf, and more—installed as versioned files.
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            {COLS.map((c) => (
              <div key={c.title}>
                <div className="text-xs font-medium tracking-caps text-muted">{c.title}</div>
                <ul className="mt-4 space-y-2 text-sm text-secondary">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full px-2 py-1 transition hover:text-ink focus-ring"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="rounded-full px-2 py-1 transition hover:text-ink focus-ring"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} AgileFlow Contributors</div>
          <div className="font-mono">docs-as-code • traceable • repeatable</div>
        </div>
      </Container>
    </footer>
  );
}
