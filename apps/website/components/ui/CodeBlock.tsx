import { codeToHtml } from '@/lib/shiki';
import { cn } from '@/lib/cn';

export async function CodeBlock({
  code,
  lang,
  label,
  className,
}: {
  code: string;
  lang: string;
  label?: string;
  className?: string;
}) {
  const html = await codeToHtml(code, lang);
  return (
    <div className={cn('overflow-hidden rounded-tile border border-border bg-white shadow-hairline', className)}>
      {label ? (
        <div className="flex items-center justify-between border-b border-hairline px-4 py-2 text-xs text-muted">
          <span className="font-medium tracking-caps">{label}</span>
          <span className="font-mono text-[12px] text-secondary">{lang}</span>
        </div>
      ) : null}
      <div
        className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

