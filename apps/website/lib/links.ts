export const LINKS = {
  docs: process.env.NEXT_PUBLIC_DOCS_URL ?? 'https://docs.agileflow.projectquestorg.com',
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? 'https://github.com/projectquestorg/AgileFlow',
} as const;
