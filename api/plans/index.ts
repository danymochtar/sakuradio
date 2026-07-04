/**
 * GET /api/plans — all of the signed-in user's plans (with steps).
 */

import { toVercelHandler } from '../../server/vercel';
import { getUser } from '../../server/session';
import { listPlans } from '../../server/plans';
import { json, unauthorized, badRequest } from '../../server/http';

export default toVercelHandler(async (request) => {
  if (request.method !== 'GET') return badRequest('Use GET.');
  const user = await getUser(request);
  if (!user) return unauthorized();
  const plans = await listPlans(user.id);
  return json(plans);
});
