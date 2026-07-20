// Prefixes internal links with Astro's configured base path. The site now
// serves from the root of icespire.ghostbloods.net, so BASE_URL is "/" and
// this is effectively a passthrough — kept so links stay correct if a base
// path is ever reintroduced.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
