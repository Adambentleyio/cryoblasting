import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: "https://www.weekendtreesurgeon.netlify.app", // update me!
  integrations: [
    sitemap()
  ]
});