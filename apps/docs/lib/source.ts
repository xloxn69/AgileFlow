import { docs } from '@/.source';
import { loader } from 'fumadocs-core/source';

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
