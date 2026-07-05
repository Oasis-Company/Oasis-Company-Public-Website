/**
 * Apply Oasis — Pages Function
 *
 * Handles /apply and /apply/ routes by serving apply.html.
 * API routes under /apply/api/* are handled by the more specific
 * functions/apply/api/[[catchall]].js (Cloudflare auto-routes to the
 * most specific match first).
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle /apply and /apply/ — everything else passes through
  if (path !== '/apply') {
    return context.next();
  }

  // Fetch the static apply.html from the Pages assets
  const assetUrl = new URL('/apply.html', url);
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