/**
 * SAKU color tokens — master plan §3.
 *
 * Philosophy: low-sensory calm base (soft, muted) so ADHD brains aren't
 * overwhelmed, with a bright "dopamine" accent used SPARINGLY for celebration
 * moments only (dot fill, plan complete). Never lean on color alone — always
 * pair with icon + text for accessibility.
 */

/** Raw brand palette. Semantic tokens below reference these. */
export const palette = {
  // Base / surface
  paper: '#F7F6F2', // warm off-white
  white: '#FFFFFF',
  ink900: '#14161A', // near-black surface (dark mode base)

  // Primary — calm teal anchor ("medical scrub" calm, not medical)
  teal: '#3BA99C',
  tealDark: '#4FC4B5', // lifted for contrast on dark surfaces

  // Ink / text — softened, never pure black
  ink: '#1F2933',
  inkMuted: '#5A6672',

  // Dopamine accents — CELEBRATION ONLY
  coral: '#FF7A59',
  sunny: '#FFC542',

  // Muted secondary
  sage: '#A9C5A0',
  lavender: '#B8B3E9',

  // Neutral scales for borders / dim surfaces
  slate200: '#E3E6EA',
  slate700: '#2A2F36',
} as const;

/** Semantic color roles consumed by components via useTheme(). */
export interface ThemeColors {
  /** App background. */
  background: string;
  /** Raised card / surface. */
  surface: string;
  /** Primary calm anchor (teal). */
  primary: string;
  /** Primary text. */
  text: string;
  /** Secondary / de-emphasized text. */
  textMuted: string;
  /** Hairline borders, empty radio ring. */
  border: string;
  /** Dopamine accent — reserved for celebration (filled dot, complete). */
  accent: string;
  /** Secondary dopamine accent. */
  accentAlt: string;
  /** Muted decorative tints. */
  sage: string;
  lavender: string;
}

export const lightColors: ThemeColors = {
  background: palette.paper,
  surface: palette.white,
  primary: palette.teal,
  text: palette.ink,
  textMuted: palette.inkMuted,
  border: palette.slate200,
  accent: palette.coral,
  accentAlt: palette.sunny,
  sage: palette.sage,
  lavender: palette.lavender,
};

export const darkColors: ThemeColors = {
  background: palette.ink900,
  surface: palette.slate700,
  primary: palette.tealDark,
  text: '#EDEFF2',
  textMuted: '#9AA4B0',
  border: '#3A414A',
  accent: palette.coral,
  accentAlt: palette.sunny,
  sage: palette.sage,
  lavender: palette.lavender,
};
