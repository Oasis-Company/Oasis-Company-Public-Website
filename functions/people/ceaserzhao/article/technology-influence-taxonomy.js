/**
 * People — CeaserZhao — Article — technology-influence-taxonomy — Pages Function
 *
 * Handles /people/ceaserzhao/article/technology-influence-taxonomy and its
 * trailing-slash form by serving
 * people/article/technology-influence-taxonomy.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people/ceaserzhao/article/technology-influence-taxonomy') {
    return context.next();
  }

  const assetUrl = new URL('/people/article/technology-influence-taxonomy.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
