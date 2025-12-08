import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center text-center flex-1 px-6 py-16 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 tracking-tight">
          AgileFlow
        </h1>
        <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed">
          AI-driven agile development system with <strong className="text-primary">41 commands</strong>,{' '}
          <strong className="text-primary">26 agents</strong>, and{' '}
          <strong className="text-primary">23 skills</strong>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/docs"
            className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            View Documentation
          </Link>
          <a
            href="https://github.com/xloxn69/AgileFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-secondary text-foreground font-medium rounded-lg transition-colors border border-foreground/10"
          >
            GitHub
          </a>
        </div>

        <div className="mt-12 p-6 bg-card rounded-lg border border-foreground/10 shadow-sm">
          <code className="text-sm text-accent font-mono">
            npx @xloxn69/agileflow install
          </code>
        </div>
      </div>
    </div>
  );
}
