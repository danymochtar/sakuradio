/**
 * AI capture — turn a messy "dream" into a short, ordered list of small next
 * actions (master plan §1: single-tasking; smallest next action).
 *
 * Runs through the Vercel AI Gateway (reads AI_GATEWAY_API_KEY automatically);
 * the model id is a gateway "creator/model" string, overridable via AI_MODEL.
 */

import { generateObject } from 'ai';
import { z } from 'zod';

const MODEL = process.env.AI_MODEL ?? 'anthropic/claude-haiku-4.5';

const planSchema = z.object({
  title: z.string().describe('A short, encouraging title for the plan (max ~6 words).'),
  steps: z
    .array(z.string())
    .min(3)
    .max(7)
    .describe('Ordered, concrete, small next actions. Each is one doable thing.'),
});

export type SimplifiedPlan = z.infer<typeof planSchema>;

const SYSTEM = `You are Saku, a calm, supportive planner for people (especially ADHD brains) who feel stuck.
Turn the user's goal or dream into 3–7 concrete, SMALL next actions, in order.
Rules:
- One single doable action per step. No multi-part steps.
- Start each step with a verb. Keep it short and specific.
- Bias toward the smallest possible first step to reduce activation energy.
- Warm, non-judgmental tone. No filler, no numbering (order is implied).
- Also give a short, motivating plan title.`;

export async function simplifyDream(dream: string): Promise<SimplifiedPlan> {
  const { object } = await generateObject({
    model: MODEL,
    schema: planSchema,
    system: SYSTEM,
    prompt: dream,
  });
  return object;
}
