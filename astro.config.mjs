// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// `site` is the canonical origin used by canonical tags, the sitemap, robots.txt and
// JSON-LD. Replace it with the production domain before launch.
export default defineConfig({
  site: 'https://hailbrowser.genrecai.com',
  compressHTML: true,
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  build: { inlineStylesheets: 'auto' },
});

