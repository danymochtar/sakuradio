/**
 * Safe-area screen wrapper with themed background and consistent padding.
 */

import { ScrollView, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  center?: boolean;
  contentStyle?: ViewStyle;
}

export function Screen({ children, scroll = false, center = false, contentStyle }: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    paddingTop: insets.top + theme.spacing.lg,
    paddingBottom: insets.bottom + theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  };

  if (scroll) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={[padding, contentStyle]}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View
      style={[
        { flex: 1, backgroundColor: theme.colors.background },
        padding,
        center && { justifyContent: 'center' },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );
}
