/**
 * GET /api/ping — trivial function with no app imports. If this responds but
 * other /api routes 404, the problem is those handlers; if this 404s too,
 * Vercel isn't building the api/ directory at all.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ pong: true });
}
