/**
 * Resolve the signed-in user from a request's Better Auth session cookie.
 * Returns null when unauthenticated. Server-side only.
 */

import { auth } from '../lib/auth';

export async function getUser(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user ?? null;
}
