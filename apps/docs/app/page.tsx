import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4">AgileFlow Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        AI-driven agile development system for Claude Code, Cursor, Windsurf, and more
      </p>
      <Link
        href="/docs"
        className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Get Started
      </Link>
    </main>
  );
}
