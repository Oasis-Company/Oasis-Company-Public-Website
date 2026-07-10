/**
 * Root Page — Pages Function
 *
 * Handles / and /? routes by serving index.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle / and /? — everything else passes through
  if (path !== '/') {
    return context.next();
  }

  // Fetch the static index.html from the Pages assets
  const assetUrl = new URL('/index.html', url);
  const response = await env.ASSETS.fetch(assetUrl);

  // Return the HTML with correct content-type
  return new Response(response.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}