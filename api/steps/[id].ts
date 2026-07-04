/**
 * PATCH /api/steps/:id — { done: boolean }. Returns the step's parent plan so
 * the client can refresh the whole chain in one round-trip.
 */

import { getUser } from '../../server/session';
import { setStepDone } from '../../server/plans';
import { json, unauthorized, badRequest, notFound, lastSegment } from '../../server/http';

export async function PATCH(request: Request): Promise<Response> {
  const user = await getUser(request);
  if (!user) return unauthorized();
  const id = lastSegment(request);

  let body: { done?: boolean };
  try {
    body = (await request.json()) as { done?: boolean };
  } catch {
    return badRequest('Invalid JSON body.');
  }
  if (typeof body.done !== 'boolean') return badRequest('`done` must be a boolean.');

  const plan = await setStepDone(user.id, id, body.done);
  return plan ? json(plan) : notFound('Step not found.');
}
