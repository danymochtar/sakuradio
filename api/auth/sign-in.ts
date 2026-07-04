/**
 * POST /api/auth/sign-in — { email, password } → sets the session cookie,
 * returns { user }.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signInUser, sessionCookie } from '../../server/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  try {
    const { email, password } = (req.body ?? {}) as { email?: string; password?: string };
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const user = await signInUser(email.trim().toLowerCase(), password);
    res.setHeader('Set-Cookie', sessionCookie(user.id));
    return res.status(200).json({ user });
  } catch (e) {
    return res.status(401).json({ error: (e as Error).message });
  }
}
