import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { baseOptions, Banner } from '@/lib/layout.shared';
import type { ReactNode } from 'react';
import './global.css';

export default function Layout({ children }: { children: ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
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
