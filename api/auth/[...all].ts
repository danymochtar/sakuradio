/**
 * Vercel serverless function — mounts Better Auth at /api/auth/*.
 *
 * Uses the Web-standard Request→Response signature (supported by Vercel's Node
 * runtime), which is exactly what `auth.handler` consumes — no body-parser in
 * the middle to mangle the request.
 */

import { auth } from '../../lib/auth';

export function GET(request: Request): Promise<Response> {
  return auth.handler(request);
}

export function POST(request: Request): Promise<Response> {
  return auth.handler(request);
}
