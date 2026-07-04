/**
 * Saku wordmark lockup — a selected radio button (ring + filled coral dot, the
 * same mark as the app icon) sits beside the fully-readable "Saku" wordmark.
 *
 * Replacing a letter with the dot made it read "Soku", so the radio button
 * rides alongside the word instead — still unmistakably the brand mark, still
 * legible (master plan §2).
 */

import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { fontFamily } from '../theme/typography';

interface LogoProps {
  size?: number;
  /** Wordmark color; the dot always uses the dopamine accent. */
  color?: string;
}

export function Logo({ size = 34, color }: LogoProps) {
  const theme = useTheme();
  const wordColor = color ?? theme.colors.primary;

  const mark = size * 0.92;
  const ring = Math.max(2, mark * 0.13);
  const dot = mark * 0.42;

  return (
    <View
      accessibilityRole="header"
      accessibilityLabel="Saku"
      style={{ flexDirection: 'row', alignItems: 'center', gap: size * 0.28 }}
    >
      <View
        style={{
          width: mark,
          height: mark,
          borderRadius: mark / 2,
          borderWidth: ring,
          borderColor: wordColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: theme.colors.accent,
          }}
        />
      </View>
      <Text
        style={{
          fontFamily: fontFamily.displaySemiBold,
          fontSize: size,
          lineHeight: size * 1.12,
          color: wordColor,
        }}
      >
        Saku
      </Text>
    </View>
  );
}
