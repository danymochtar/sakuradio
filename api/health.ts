/**
 * GET /api/health — quick diagnostics you can hit in a browser.
 *
 * Reports which env vars are present (booleans only — no secret values) and
 * whether the database is reachable and migrated. Handy for verifying a fresh
 * deploy. Safe to delete once things are green.
 */

import { prisma } from '../server/prisma';
import { json } from '../server/http';

export async function GET(): Promise<Response> {
  const result: Record<string, unknown> = {
    env: {
      DATABASE_URL: Boolean(process.env.DATABASE_URL),
      BETTER_AUTH_SECRET: Boolean(process.env.BETTER_AUTH_SECRET),
      AI_GATEWAY_API_KEY: Boolean(process.env.AI_GATEWAY_API_KEY),
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? null,
    },
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    result.database = 'connected';
    try {
      const users = await prisma.user.count();
      result.tables = `migrated (${users} users)`;
    } catch {
      result.tables = 'NOT migrated — run the DB migration (tables missing)';
    }
  } catch (e) {
    result.database = `ERROR: ${(e as Error).message.slice(0, 300)}`;
  }

  return json(result);
}
