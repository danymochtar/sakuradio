/**
 * Resolve the signed-in user from a request's Better Auth session cookie.
 * Returns null when unauthenticated. Server-side only.
 */

import { getAuth } from '../lib/auth';

export async function getUser(request: Request) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  return session?.user ?? null;
}
