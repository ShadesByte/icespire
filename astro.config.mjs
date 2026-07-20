// @ts-check
import { defineConfig } from 'astro/config';

// Deployed to Cloudflare Pages at https://icespire.ghostbloods.net
// Served from the root of its own subdomain, so no `base` prefix is needed.
export default defineConfig({
  site: 'https://icespire.ghostbloods.net',
});
