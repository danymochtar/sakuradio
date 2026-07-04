/**
 * Better Auth server config (email + password) — SERVER ONLY.
 *
 * Mounted by the Vercel function at api/auth/[...all].ts. Uses the Prisma
 * adapter over the shared client. Never import this from app/ or src/ — it pulls
 * in Prisma (Node-only) and would break the Metro client bundle.
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { expo } from '@better-auth/expo';
import { prisma } from '../server/prisma';

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL,
  emailAndPassword: {
    enabled: true,
    // MVP: no email provider wired yet, so don't gate sign-in on verification.
    requireEmailVerification: false,
  },
  // Allow the native app's deep-link scheme + any explicitly trusted web origin.
  trustedOrigins: [
    'saku://',
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',').map((s: string) => s.trim()) ?? []),
  ],
  plugins: [expo()],
});

export type Auth = typeof auth;
