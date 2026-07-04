/**
 * Better Auth server config (email + password) — SERVER ONLY.
 *
 * Exposes getAuth() (lazy singleton) rather than a top-level `auth`, so:
 *  - a STATIC import still lets Vercel's bundler trace + include this file, and
 *  - betterAuth() runs on first request (inside the handler's try/catch), so any
 *    init error surfaces as readable JSON instead of a FUNCTION_INVOCATION_FAILED.
 *
 * Never import this from app/ or src/ (pulls in Prisma / Node-only code).
 */

import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '../server/prisma';

function createAuth() {
  const baseURL =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

  // Fall back so a missing/unapplied env var can't hard-crash the function.
  const secret = process.env.BETTER_AUTH_SECRET || 'saku-dev-insecure-secret-please-set-env';

  return betterAuth({
    database: prismaAdapter(prisma, { provider: 'postgresql' }),
    secret,
    baseURL,
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    trustedOrigins: [
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
      'saku://',
      ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',').map((s: string) => s.trim()) ?? []),
    ],
  });
}

let cached: ReturnType<typeof createAuth> | null = null;

export function getAuth(): ReturnType<typeof createAuth> {
  if (!cached) cached = createAuth();
  return cached;
}
