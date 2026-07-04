/**
 * ThemeProvider + useTheme() — the single access point for design tokens.
 *
 * Auto-selects light/dark from the OS via useColorScheme(), with a manual
 * override slot reserved for the future "Calm Mode" (master plan §3: dim
 * colors, stop animation).
 */

import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, Theme } from './theme';

type SchemePreference = 'system' | 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  /** Current explicit preference; 'system' follows the OS. */
  preference: SchemePreference;
  setPreference: (preference: SchemePreference) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<SchemePreference>('system');

  const value = useMemo<ThemeContextValue>(() => {
    const resolved =
      preference === 'system' ? (systemScheme ?? 'light') : preference;
    return {
      theme: resolved === 'dark' ? darkTheme : lightTheme,
      preference,
      setPreference,
    };
  }, [preference, systemScheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Access the active theme tokens. Throws if used outside ThemeProvider. */
export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx.theme;
}

/** Access + mutate the light/dark preference (for a future Calm/theme toggle). */
export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within a ThemeProvider');
  }
  return { preference: ctx.preference, setPreference: ctx.setPreference };
}
