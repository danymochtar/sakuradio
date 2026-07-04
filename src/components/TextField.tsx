/**
 * Themed labeled text input.
 */

import { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface TextFieldProps extends TextInputProps {
  label: string;
}

export function TextField({ label, style, ...props }: TextFieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{label}</Text>
      <TextInput
        placeholderTextColor={theme.colors.textMuted}
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[
          theme.typography.body,
          {
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
            borderWidth: 1.5,
            borderColor: focused ? theme.colors.primary : theme.colors.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
          },
          style,
        ]}
      />
    </View>
  );
}
