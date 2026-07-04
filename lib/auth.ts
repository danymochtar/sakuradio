/**
 * Better Auth server config (email + password) — SERVER ONLY.
 *
 * Mounted by the Vercel function at api/auth/[...all].ts. Uses the Prisma
 * adapter over the shared client. Never import this from app/ or src/.
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../server/prisma';

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

// Fall back to a placeholder so a missing env var can't hard-crash the auth
// function (sessions just won't persist across redeploys until it's set).
const secret = process.env.BETTER_AUTH_SECRET || 'saku-dev-insecure-secret-please-set-env';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  secret,
  baseURL,
  emailAndPassword: {
    enabled: true,
    // MVP: no email provider wired yet, so don't gate sign-in on verification.
    requireEmailVerification: false,
  },
  // Trust the deployment origin + any explicitly configured ones. (The native
  // expo() plugin is added later when we wire the mobile client.)
  trustedOrigins: [
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    'saku://',
    ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',').map((s: string) => s.trim()) ?? []),
  ],
});

export type Auth = typeof auth;
