/**
 * POST /api/capture — { dream } → AI-simplified plan of steps, persisted.
 */

import { getUser } from '../server/session';
import { simplifyDream } from '../server/ai';
import { createPlanFromSteps } from '../server/plans';
import { json, unauthorized, badRequest, serverError } from '../server/http';

export async function POST(request: Request): Promise<Response> {
  const user = await getUser(request);
  if (!user) return unauthorized();

  let body: { dream?: string };
  try {
    body = (await request.json()) as { dream?: string };
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const dream = (body.dream ?? '').trim();
  if (dream.length < 3) return badRequest('Tell me a bit more about what you want to do.');

  try {
    const { title, steps } = await simplifyDream(dream);
    const plan = await createPlanFromSteps(user.id, title, dream, steps);
    return json(plan, { status: 201 });
  } catch (err) {
    console.error('capture failed', err);
    return serverError('Could not create your plan right now. Try again in a moment.');
  }
}
