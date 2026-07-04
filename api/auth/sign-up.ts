/**
 * POST /api/auth/sign-up — { name?, email, password } → creates the account,
 * sets the session cookie, returns { user }.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { signUpUser, sessionCookie } from '../../server/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  try {
    const { name, email, password } = (req.body ?? {}) as {
      name?: string;
      email?: string;
      password?: string;
    };
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters.' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await signUpUser((name ?? '').trim() || cleanEmail.split('@')[0], cleanEmail, password);
    res.setHeader('Set-Cookie', sessionCookie(user.id));
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(400).json({ error: (e as Error).message });
  }
}
