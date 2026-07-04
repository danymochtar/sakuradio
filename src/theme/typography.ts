/**
 * SAKU typography tokens — master plan §4.
 *
 * Display = Poppins (geometric, near-perfect circles → echoes the radio-dot DNA).
 * Body/UI = DM Sans (low-contrast geometric, optimized for small sizes → keeps
 * long body text readable where a display face would tire the eye).
 *
 * Font family names below match the keys registered by useFonts() in App.tsx.
 */

export const fontFamily = {
  displayRegular: 'Poppins_400Regular',
  displayMedium: 'Poppins_500Medium',
  displaySemiBold: 'Poppins_600SemiBold',
  bodyRegular: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodyBold: 'DMSans_700Bold',
} as const;

export interface TypeStyle {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

/** Type scale. Display roles use Poppins; text/UI roles use DM Sans. */
export const typography = {
  display: { fontFamily: fontFamily.displaySemiBold, fontSize: 34, lineHeight: 40 },
  title: { fontFamily: fontFamily.displayMedium, fontSize: 24, lineHeight: 30 },
  heading: { fontFamily: fontFamily.displayMedium, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fontFamily.bodyRegular, fontSize: 16, lineHeight: 24 },
  bodyStrong: { fontFamily: fontFamily.bodyMedium, fontSize: 16, lineHeight: 24 },
  caption: { fontFamily: fontFamily.bodyRegular, fontSize: 13, lineHeight: 18 },
  mono: { fontFamily: fontFamily.bodyMedium, fontSize: 12, lineHeight: 16 },
} as const satisfies Record<string, TypeStyle>;

export type TypographyToken = keyof typeof typography;
