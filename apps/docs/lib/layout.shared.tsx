import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

// Logo component matching Claude Code docs style
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#D97757]"
      >
        <path
          d="M12 2L2 7L12 12L22 7L12 2Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M2 17L12 22L22 17"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2 12L12 17L22 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="font-semibold text-lg">AgileFlow Docs</span>
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
        url: 'https://github.com/xloxn69/AgileFlow',
        active: 'none',
      },
    ],
  };
}
