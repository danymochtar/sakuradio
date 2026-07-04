/**
 * Client-side calls to the plans/steps API, plus the mapping from Step status
 * to <RadioDot> display state.
 */

import { apiJson } from './api';
import { Plan } from '../types';
import { RadioDotState } from '../components/RadioDot';

export const fetchPlans = () => apiJson<Plan[]>('/api/plans');

export const capturePlan = (dream: string) =>
  apiJson<Plan>('/api/capture', { method: 'POST', body: JSON.stringify({ dream }) });

export const toggleStep = (stepId: string, done: boolean) =>
  apiJson<Plan>(`/api/steps/${stepId}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
  });

export const patchPlan = (planId: string, action: 'activate' | 'complete' | 'archive') =>
  apiJson<Plan>(`/api/plans/${planId}`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });

export interface ChainStep {
  id: string;
  label: string;
  state: RadioDotState;
  done: boolean;
}

/**
 * Map a plan's steps to display states: DONE → filled, the first not-done step →
 * active ("one at a time"), the rest → empty.
 */
export function planToChain(plan: Plan): ChainStep[] {
  let activeAssigned = false;
  return [...plan.steps]
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const done = s.status === 'DONE';
      let state: RadioDotState;
      if (done) {
        state = 'filled';
      } else if (!activeAssigned) {
        state = 'active';
        activeAssigned = true;
      } else {
        state = 'empty';
      }
      return { id: s.id, label: s.title, state, done };
    });
}

export const isPlanComplete = (plan: Plan) =>
  plan.steps.length > 0 && plan.steps.every((s) => s.status === 'DONE');
