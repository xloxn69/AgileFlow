import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'AgileFlow',
      url: 'https://agileflow.projectquestorg.com',
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
