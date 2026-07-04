/**
 * GET   /api/plans/:id — one plan with steps.
 * PATCH /api/plans/:id — { action: 'activate' | 'complete' | 'archive' }.
 */

import { toVercelHandler } from '../../server/vercel';
import { getUser } from '../../server/session';
import { getPlan, setActivePlan, completePlan, archivePlan } from '../../server/plans';
import { json, unauthorized, badRequest, notFound, lastSegment } from '../../server/http';

export default toVercelHandler(async (request) => {
  const user = await getUser(request);
  if (!user) return unauthorized();
  const id = lastSegment(request);

  if (request.method === 'GET') {
    const plan = await getPlan(user.id, id);
    return plan ? json(plan) : notFound('Plan not found.');
  }

  if (request.method === 'PATCH') {
    let body: { action?: string };
    try {
      body = (await request.json()) as { action?: string };
    } catch {
      return badRequest('Invalid JSON body.');
    }

    const plan =
      body.action === 'activate'
        ? await setActivePlan(user.id, id)
        : body.action === 'complete'
          ? await completePlan(user.id, id)
          : body.action === 'archive'
            ? await archivePlan(user.id, id)
            : undefined;

    if (plan === undefined) return badRequest('Unknown action.');
    return plan ? json(plan) : notFound('Plan not found.');
  }

  return badRequest('Use GET or PATCH.');
});
