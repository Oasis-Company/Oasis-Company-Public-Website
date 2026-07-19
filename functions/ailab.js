/**
 * Oasis AI Lab — Pages Function
 *
 * Handles /ailab and /ailab/ routes by serving ailab.html.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle /ailab and /ailab/ — everything else passes through
  if (path !== '/ailab') {
    return context.next();
  }

  // Fetch the static ailab.html from the Pages assets
  const assetUrl = new URL('/ailab.html', url);
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
