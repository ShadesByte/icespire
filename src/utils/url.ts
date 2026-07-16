// The site is served from a subpath on GitHub Pages (/icespire), so all
// internal links must be prefixed with the configured base.
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
