/**
 * People — Pages Function
 *
 * Handles /people and /people/ by serving people/index.html.
 * More-specific nested routes (functions/people/ceaserzhao.js, etc.)
 * are matched first by Cloudflare, so they are unaffected.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people') {
    return context.next();
  }

  const assetUrl = new URL('/people/index.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
