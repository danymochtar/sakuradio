/**
 * Themed button. Primary = teal fill; secondary = outline; ghost = text-only.
 * Descriptive labels, not "click here" (ADHD-friendly copy — master plan §8).
 */

import { ActivityIndicator, Pressable, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useHaptic } from '../hooks/useHaptic';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const theme = useTheme();
  const haptic = useHaptic();
  const isDisabled = disabled || loading;

  const bg =
    variant === 'primary' ? theme.colors.primary : 'transparent';
  const borderColor =
    variant === 'secondary' ? theme.colors.border : 'transparent';
  const textColor =
    variant === 'primary' ? '#FFFFFF' : theme.colors.primary;

  return (
    <Pressable
      onPress={() => {
        if (isDisabled) return;
        haptic.impact('light');
        onPress();
      }}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'secondary' ? 1.5 : 0,
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing.md + 2,
          paddingHorizontal: theme.spacing.lg,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[theme.typography.bodyStrong, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}
