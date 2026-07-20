import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { renderOgCard } from '../../../lib/og';

// One social-preview PNG per session, generated at build time as
// /og/sessions/<id>.png. The session page points its og:image here so a shared
// recap link carries that session's own title (see src/pages/sessions/[id].astro).
export async function getStaticPaths() {
  const sessions = await getCollection('sessions');
  return sessions.map((session) => ({ params: { id: session.id }, props: { session } }));
}

export const GET: APIRoute = async ({ props }) => {
  const { session } = props as { session: Awaited<ReturnType<typeof getCollection<'sessions'>>>[number] };
  const date = session.data.date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const png = await renderOgCard({
    kicker: `Session ${session.data.sessionNumber}`,
    title: session.data.title,
    subtitle: date,
  });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
