/**
 * SAKU theme — assembles color / typography / spacing tokens into the object
 * consumed via useTheme(). Components MUST read from here (master plan §6:
 * "NO hardcoded value") so dark mode and future rebrands stay free.
 */

import { darkColors, lightColors, ThemeColors } from './colors';
import { radius, spacing } from './spacing';
import { typography } from './typography';

export interface Theme {
  /** 'light' | 'dark' — useful for conditional art direction. */
  scheme: 'light' | 'dark';
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
}

export const lightTheme: Theme = {
  scheme: 'light',
  colors: lightColors,
  spacing,
  radius,
  typography,
};

export const darkTheme: Theme = {
  scheme: 'dark',
  colors: darkColors,
  spacing,
  radius,
  typography,
};
