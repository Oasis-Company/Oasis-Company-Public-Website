/**
 * People — CeaserZhao — Article — oasis-containment-design — Pages Function
 *
 * Handles /people/ceaserzhao/article/oasis-containment-design and its
 * trailing-slash form by serving
 * people/article/oasis-containment-design.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (path !== '/people/ceaserzhao/article/oasis-containment-design') {
    return context.next();
  }

  const assetUrl = new URL('/people/article/oasis-containment-design.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
