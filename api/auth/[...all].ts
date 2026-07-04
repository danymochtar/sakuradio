/**
 * Vercel serverless function — mounts Better Auth at /api/auth/*.
 * Classic default export (via the Web→Node adapter) for reliable detection.
 */

import { toVercelHandler } from '../../server/vercel';
import { auth } from '../../lib/auth';

export default toVercelHandler((request) => auth.handler(request));
