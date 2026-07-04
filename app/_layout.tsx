/**
 * Root layout — loads fonts, wires the theme + auth providers, registers the
 * PWA (web), and hosts the navigation Stack. Everything below the app tree can
 * call useTheme() / useSession().
 */

import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';

import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { registerPwa } from '../src/pwa/registerPwa';

export const unstable_settings = {
  initialRouteName: 'index',
};

function ThemedStack() {
  const theme = useTheme();
  return (
    <>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'slide_from_right',
        }}
      />
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    registerPwa();
  }, []);

  const [loaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!loaded) {
    return <View style={{ flex: 1, backgroundColor: palette.paper }} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
