/**
 * People — CeaserZhao — Pages Function
 *
 * Handles /people/ceaserzhao and /people/ceaserzhao/ by serving
 * people/ceaserzhao.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle /people/ceaserzhao — everything else passes through
  if (path !== '/people/ceaserzhao') {
    return context.next();
  }

  // Fetch the static people/ceaserzhao.html from the Pages assets
  const assetUrl = new URL('/people/ceaserzhao.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
