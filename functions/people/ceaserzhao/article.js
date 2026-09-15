/**
 * People — CeaserZhao — Article — Pages Function
 *
 * Handles /people/ceaserzhao/article and /people/ceaserzhao/article/ by serving
 * people/article.html. More-specific path than functions/people/ceaserzhao.js,
 * so it wins without affecting the parent route. Deeper article slugs are
 * handled by functions/people/ceaserzhao/article/*.js.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people/ceaserzhao/article') {
    return context.next();
  }

  const assetUrl = new URL('/people/article.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
