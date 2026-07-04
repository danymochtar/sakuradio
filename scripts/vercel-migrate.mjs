/**
 * Runs `prisma migrate deploy` during the Vercel build.
 *
 * The Vercel build container can reach the database (unlike local/CI setups that
 * can't), so this applies pending migrations automatically on every deploy —
 * no separate migration step needed. Idempotent: a no-op once up to date.
 *
 * Skips cleanly if DATABASE_URL isn't set yet (e.g. before env vars are added),
 * and never fails the build — diagnose via /api/health + these build logs.
 */

import { execSync } from 'node:child_process';

if (!process.env.DATABASE_URL) {
  console.log('[vercel-migrate] DATABASE_URL not set — skipping migration.');
  process.exit(0);
}

console.log('[vercel-migrate] Applying database migrations…');
try {
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  console.log('[vercel-migrate] ✓ Migrations applied.');
} catch (err) {
  console.error('[vercel-migrate] ✗ Migration FAILED:', err?.message ?? err);
  console.error('[vercel-migrate] Build continues; check /api/health after deploy.');
}
