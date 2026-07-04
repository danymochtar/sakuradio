/**
 * Vercel serverless function — mounts Better Auth at /api/auth/*.
 *
 * The auth config is imported lazily INSIDE the handler so that any
 * initialization error surfaces as a readable JSON 500 (via the adapter's
 * try/catch) instead of a generic FUNCTION_INVOCATION_FAILED crash.
 */

import { toVercelHandler } from '../../server/vercel';

export default toVercelHandler(async (request) => {
  const { auth } = await import('../../lib/auth');
  return auth.handler(request);
});
