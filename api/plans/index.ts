/**
 * GET /api/plans — all of the signed-in user's plans (with steps).
 */

import { getUser } from '../../server/session';
import { listPlans } from '../../server/plans';
import { json, unauthorized } from '../../server/http';

export async function GET(request: Request): Promise<Response> {
  const user = await getUser(request);
  if (!user) return unauthorized();
  const plans = await listPlans(user.id);
  return json(plans);
}
