import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { baseOptions, Banner } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import { Inter, Source_Serif_4, JetBrains_Mono } from 'next/font/google';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider
          theme={{
            defaultTheme: 'light',
            attribute: 'class',
            enableSystem: true,
          }}
        >
          <Banner />
          <DocsLayout
            tree={source.pageTree}
            {...baseOptions()}
            sidebar={{
              defaultOpenLevel: 0,
              collapsible: true,
              banner: undefined,
            }}
          >
            {children}
          </DocsLayout>
        </RootProvider>
      </body>
    </html>
  );
}
