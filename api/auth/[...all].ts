/**
 * Vercel serverless function — mounts Better Auth at /api/auth/*.
 *
 * Static import so Vercel's bundler traces + includes lib/auth (a dynamic
 * import is NOT traced and 404s at runtime). getAuth() constructs better-auth
 * lazily on first request, so init errors return as JSON via the adapter's
 * try/catch instead of a load-time crash.
 */

import { toVercelHandler } from '../../server/vercel';
import { getAuth } from '../../lib/auth';

export default toVercelHandler((request) => getAuth().handler(request));
