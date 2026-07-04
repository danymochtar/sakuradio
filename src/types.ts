/**
 * Shape of the API JSON (plans/steps). Plain types so the client never imports
 * @prisma/client. Dates arrive as ISO strings over the wire.
 */

export type StepStatus = 'PENDING' | 'ACTIVE' | 'DONE';
export type PlanStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface Step {
  id: string;
  title: string;
  order: number;
  status: StepStatus;
  completedAt: string | null;
}

export interface Plan {
  id: string;
  title: string;
  dream: string | null;
  status: PlanStatus;
  isActive: boolean;
  createdAt: string;
  completedAt: string | null;
  steps: Step[];
}
