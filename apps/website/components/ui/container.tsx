import { cn } from '@/lib/cn';

export function Container({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-content px-4 sm:px-6 lg:px-6', className)} {...props} />;
}

