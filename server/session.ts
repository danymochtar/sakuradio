/**
 * Resolve the signed-in user from a request's session cookie.
 * Returns null when unauthenticated. Server-side only.
 */

import { sessionUser } from './auth';

export async function getUser(request: Request) {
  return sessionUser(request.headers.get('cookie') ?? undefined);
}
