/**
 * Oasis Directory — Pages Function
 *
 * Handles /list and /list/ routes by serving list.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle /list and /list/ — everything else passes through
  if (path !== '/list') {
    return context.next();
  }

  // Fetch the static list.html from the Pages assets
  const assetUrl = new URL('/list.html', url);
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