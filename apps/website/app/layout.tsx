import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './global.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'AgileFlow — AI-driven agile, in your repo',
  description:
    'AgileFlow turns your repo into an AI-friendly agile system with commands, agents, ADRs, and docs-as-code — built for Claude Code, Cursor, Windsurf, and more.',
  metadataBase: new URL('https://agileflow.dev'),
  openGraph: {
    title: 'AgileFlow',
    description:
      'Agile delivery, in your repo—powered by AI. Scrum + Kanban + ADRs + docs-as-code.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh font-sans">{children}</body>
    </html>
  );
}

