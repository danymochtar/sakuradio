/**
 * Plan / Step data operations — the radio-button rules live here.
 *
 * Free tier: exactly ONE plan is `isActive` (the current focus). Creating or
 * activating a plan flips the others off. Steps are worked in order; the app
 * derives the single "active" step as the first not-yet-done one.
 */

import { prisma } from './prisma';

export function listPlans(userId: string) {
  return prisma.plan.findMany({
    where: { userId },
    orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
    include: { steps: { orderBy: { order: 'asc' } } },
  });
}

export function getPlan(userId: string, planId: string) {
  return prisma.plan.findFirst({
    where: { id: planId, userId },
    include: { steps: { orderBy: { order: 'asc' } } },
  });
}

/** Create a plan from AI-simplified steps; becomes active only if none is. */
export async function createPlanFromSteps(
  userId: string,
  title: string,
  dream: string,
  stepTitles: string[],
) {
  const activeCount = await prisma.plan.count({
    where: { userId, isActive: true, status: 'ACTIVE' },
  });
  const isActive = activeCount === 0;

  return prisma.plan.create({
    data: {
      userId,
      title,
      dream,
      isActive,
      status: 'ACTIVE',
      steps: {
        create: stepTitles.map((t, i) => ({ title: t, order: i })),
      },
    },
    include: { steps: { orderBy: { order: 'asc' } } },
  });
}

/** Make one plan the single active focus (free-tier radio-group rule). */
export async function setActivePlan(userId: string, planId: string) {
  const plan = await prisma.plan.findFirst({ where: { id: planId, userId } });
  if (!plan) return null;
  await prisma.$transaction([
    prisma.plan.updateMany({ where: { userId, isActive: true }, data: { isActive: false } }),
    prisma.plan.update({ where: { id: planId }, data: { isActive: true, status: 'ACTIVE' } }),
  ]);
  return getPlan(userId, planId);
}

export async function completePlan(userId: string, planId: string) {
  const plan = await prisma.plan.findFirst({ where: { id: planId, userId } });
  if (!plan) return null;
  await prisma.plan.update({
    where: { id: planId },
    data: { status: 'COMPLETED', isActive: false, completedAt: new Date() },
  });
  return getPlan(userId, planId);
}

export async function archivePlan(userId: string, planId: string) {
  const plan = await prisma.plan.findFirst({ where: { id: planId, userId } });
  if (!plan) return null;
  await prisma.plan.update({
    where: { id: planId },
    data: { status: 'ARCHIVED', isActive: false },
  });
  return getPlan(userId, planId);
}

/** Mark a step done/undone. Ownership is checked via the parent plan's userId. */
export async function setStepDone(userId: string, stepId: string, done: boolean) {
  const step = await prisma.step.findFirst({
    where: { id: stepId, plan: { userId } },
  });
  if (!step) return null;
  await prisma.step.update({
    where: { id: stepId },
    data: {
      status: done ? 'DONE' : 'PENDING',
      completedAt: done ? new Date() : null,
    },
  });
  return getPlan(userId, step.planId);
}
