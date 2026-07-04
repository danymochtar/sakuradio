/**
 * Tiny helpers for the Vercel Web-style API functions.
 */

export function json(data: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
}

export const unauthorized = () => json({ error: 'Unauthorized' }, { status: 401 });
export const badRequest = (msg: string) => json({ error: msg }, { status: 400 });
export const notFound = (msg = 'Not found') => json({ error: msg }, { status: 404 });
export const serverError = (msg = 'Something went wrong') => json({ error: msg }, { status: 500 });

/** Last path segment of the request URL, decoded (e.g. /api/plans/abc → "abc"). */
export function lastSegment(request: Request): string {
  const { pathname } = new URL(request.url);
  const parts = pathname.split('/').filter(Boolean);
  return decodeURIComponent(parts[parts.length - 1] ?? '');
}
