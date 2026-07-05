/**
 * Oasis Apply API — Pages Functions Middleware
 * ============================================
 * Adds CORS headers to all /apply/api/* responses.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequest(context) {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: { ...CORS_HEADERS, Allow: 'GET, POST, PUT, DELETE, OPTIONS' },
    });
  }

  // Process the request and add CORS to the response
  const response = await context.next();
  const newHeaders = new Headers(response.headers);
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}