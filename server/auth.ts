/**
 * Minimal email + password auth — SERVER ONLY.
 *
 * Uses Prisma (proven working on Vercel) + Node's built-in crypto, so there's
 * no heavy auth dependency to fail at bundle/load time. Passwords are scrypt-
 * hashed; the session is a stateless HMAC-signed cookie (userId + expiry).
 */

import crypto from 'node:crypto';
import { prisma } from './prisma';

const SECRET = process.env.BETTER_AUTH_SECRET || 'saku-dev-insecure-secret-please-set-env';
const COOKIE = 'saku_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days (seconds)

// ── password hashing ─────────────────────────────────────────────────────────
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(test, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ── signed session token ─────────────────────────────────────────────────────
function sign(value: string): string {
  const sig = crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
  return `${value}.${sig}`;
}

function unsign(signed: string): string | null {
  const i = signed.lastIndexOf('.');
  if (i < 0) return null;
  const value = signed.slice(0, i);
  const sig = signed.slice(i + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(value).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

export function sessionCookie(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = sign(`${userId}.${exp}`);
  return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function userIdFromCookie(cookieHeader: string | undefined): string | null {
  const cookie = cookieHeader ?? '';
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!match) return null;
  const value = unsign(decodeURIComponent(match[1]));
  if (!value) return null;
  const [userId, expStr] = value.split('.');
  const exp = Number(expStr);
  if (!userId || !exp || exp < Math.floor(Date.now() / 1000)) return null;
  return userId;
}

// ── operations ───────────────────────────────────────────────────────────────
export type PublicUser = { id: string; name: string | null; email: string };

export async function signUpUser(
  name: string,
  email: string,
  password: string,
): Promise<PublicUser> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('An account with this email already exists.');
  const user = await prisma.user.create({
    data: {
      name,
      email,
      emailVerified: false,
      accounts: {
        create: { accountId: email, providerId: 'credential', password: hashPassword(password) },
      },
    },
    select: { id: true, name: true, email: true },
  });
  return user;
}

export async function signInUser(email: string, password: string): Promise<PublicUser> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });
  const account = user?.accounts.find((a) => a.providerId === 'credential');
  if (!user || !account?.password || !verifyPassword(password, account.password)) {
    throw new Error('Invalid email or password.');
  }
  return { id: user.id, name: user.name, email: user.email };
}

export async function sessionUser(cookieHeader: string | undefined): Promise<PublicUser | null> {
  const userId = userIdFromCookie(cookieHeader);
  if (!userId) return null;
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
}
