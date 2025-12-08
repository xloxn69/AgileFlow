import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      {...baseOptions()}
      // Disable search since we don't have a search API configured
      sidebar={{
        banner: undefined,
      }}
    >
      {children}
    </DocsLayout>
  );
}
