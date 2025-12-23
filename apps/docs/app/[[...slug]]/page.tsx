import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { Metadata } from 'next';

// Category eyebrow label component (like Claude Code docs "GETTING STARTED")
function CategoryLabel({ category }: { category?: string }) {
  if (!category) return null;
  return (
    <div className="category-eyebrow">
      {category}
    </div>
  );
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  // Get parent folder name as category
  const slugParts = params.slug || [];
  const category = slugParts.length > 1 ? slugParts[slugParts.length - 2] : 'Getting Started';
  const formattedCategory = category.replace(/-/g, ' ');

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <CategoryLabel category={formattedCategory} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
