/**
 * People — CeaserZhao — Info — Paper — Pages Function
 *
 * Handles /people/ceaserzhao/info/paper and /people/ceaserzhao/info/paper/
 * by serving people/paper.html. More-specific path than
 * functions/people/ceaserzhao/info.js, so it wins without affecting the parent route.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people/ceaserzhao/info/paper') {
    return context.next();
  }

  const assetUrl = new URL('/people/paper.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
