import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import Link from 'next/link';

// Logo component with actual logo image
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="AgileFlow"
        width={32}
        height={32}
        className="rounded"
      />
      <span className="font-semibold text-lg">AgileFlow</span>
    </div>
  );
}

// Banner component
function Banner() {
  return (
    <div className="flex items-center justify-center gap-2 bg-fd-primary/10 text-fd-primary py-2 px-4 text-sm">
      <span>🚀</span>
      <span>AgileFlow v2.51 is out!</span>
      <Link
        href="https://github.com/projectquestorg/AgileFlow/releases"
        className="underline font-medium hover:no-underline"
        target="_blank"
      >
        View changelog →
      </Link>
    </div>
  );
}

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <Logo />,
      url: '/',
      transparentMode: 'none',
    },
    links: [
      {
        text: 'Website',
        url: 'https://agileflow.projectquestorg.com',
        active: 'none',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/projectquestorg/AgileFlow',
        active: 'none',
      },
    ],
  };
}

export { Banner };
