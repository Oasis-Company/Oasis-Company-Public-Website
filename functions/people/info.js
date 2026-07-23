/**
 * People — Info — Pages Function
 *
 * Handles /people/info and /people/info/ by serving people/info.html.
 * Placeholder page; full content to be supplied later.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people/info') {
    return context.next();
  }

  const assetUrl = new URL('/people/info.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
