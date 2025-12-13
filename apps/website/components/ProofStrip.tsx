import { Container } from '@/components/ui/Container';

const ITEMS = [
  { value: '41', label: 'commands' },
  { value: '26', label: 'specialized agents' },
  { value: '23', label: 'code generation skills' },
  { value: 'Claude Code • Cursor • Windsurf', label: 'IDE support' },
] as const;

export function ProofStrip() {
  return (
    <div className="border-y border-hairline bg-white">
      <Container className="py-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.label}
              className="group rounded-tile border border-hairline bg-white px-4 py-3 shadow-hairline transition duration-200 ease-quiet hover:border-border"
            >
              <div className="text-lg font-semibold tracking-tightish text-ink transition group-hover:text-black">
                {item.value}
              </div>
              <div className="mt-1 text-xs font-medium tracking-caps text-muted">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

