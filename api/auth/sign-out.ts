/**
 * POST /api/auth/sign-out — clears the session cookie.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearCookie } from '../../server/auth';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Set-Cookie', clearCookie());
  return res.status(200).json({ ok: true });
}
