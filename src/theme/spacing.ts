/**
 * SAKU spacing & radius tokens.
 *
 * A single 4pt-based scale keeps rhythm consistent and gives ADHD-friendly
 * generous whitespace (master plan §3: "banyak white/neutral space = calm").
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
  pill: 999, // radio dots / fully rounded
} as const;

export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
