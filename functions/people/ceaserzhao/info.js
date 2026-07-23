/**
 * People — CeaserZhao — Info — Pages Function
 *
 * Handles /people/ceaserzhao/info and /people/ceaserzhao/info/ by serving
 * people/info.html. More-specific path than functions/people/ceaserzhao.js,
 * so it wins without affecting the parent route.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people/ceaserzhao/info') {
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
