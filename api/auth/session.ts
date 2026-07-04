/**
 * GET /api/auth/session — returns { user } or { user: null } from the cookie.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sessionUser } from '../../server/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const user = await sessionUser(req.headers.cookie);
    return res.status(200).json({ user });
  } catch {
    return res.status(200).json({ user: null });
  }
}
