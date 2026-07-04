/**
 * Shared PrismaClient singleton (server-side only).
 *
 * This is the data-access entry point for the API layer built in later phases.
 * It is deliberately OUTSIDE src/ so nothing in the Expo app imports it and
 * Metro never tries to bundle Prisma (a Node-only library) into the client.
 *
 * The global cache avoids exhausting DB connections when a dev server hot-reloads.
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
