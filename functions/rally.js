/**
 * The Gathering — Pages Function
 *
 * Handles /rally and /rally/ routes by serving rally.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle /rally and /rally/ — everything else passes through
  if (path !== '/rally') {
    return context.next();
  }

  // Fetch the static rally.html from the Pages assets
  const assetUrl = new URL('/rally.html', url);
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