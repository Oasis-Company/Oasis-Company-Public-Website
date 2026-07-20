/**
 * Oasis AI Lab — Fundamental — Pages Function
 *
 * Handles /ailab/fundamental and /ailab/fundamental/ routes by serving
 * fundamental.html. Cloudflare routes this more-specific path before
 * functions/ailab.js, so the parent AI Lab route is unaffected.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';

  // Only handle /ailab/fundamental — everything else passes through
  if (path !== '/ailab/fundamental') {
    return context.next();
  }

  // Fetch the static fundamental.html from the Pages assets
  const assetUrl = new URL('/fundamental.html', url);
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
