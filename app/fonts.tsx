/**
 * /fonts — temporary font chooser. Renders the "SAKU" wordmark (uppercase) with
 * the radio mark in several rounded/geometric candidates so we can pick the
 * title face by eye. Delete once chosen.
 */

import { Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Quicksand_700Bold } from '@expo-google-fonts/quicksand/700Bold';
import { Comfortaa_700Bold } from '@expo-google-fonts/comfortaa/700Bold';
import { Fredoka_600SemiBold } from '@expo-google-fonts/fredoka/600SemiBold';
import { Baloo2_700Bold } from '@expo-google-fonts/baloo-2/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Lexend_700Bold } from '@expo-google-fonts/lexend/700Bold';
import { Screen } from '../src/components/Screen';
import { useTheme } from '../src/theme/ThemeProvider';

const CANDIDATES = [
  { name: 'Poppins', family: 'Poppins_600SemiBold' },
  { name: 'Quicksand', family: 'Quicksand_700Bold' },
  { name: 'Comfortaa', family: 'Comfortaa_700Bold' },
  { name: 'Fredoka', family: 'Fredoka_600SemiBold' },
  { name: 'Baloo 2', family: 'Baloo2_700Bold' },
  { name: 'Nunito', family: 'Nunito_800ExtraBold' },
  { name: 'Lexend', family: 'Lexend_700Bold' },
];

function Mark({ size }: { size: number }) {
  const theme = useTheme();
  const ring = Math.max(2, size * 0.13);
  const dot = size * 0.42;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: ring,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View
        style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: theme.colors.accent }}
      />
    </View>
  );
}

export default function Fonts() {
  const theme = useTheme();
  const [loaded] = useFonts({
    Poppins_600SemiBold,
    Quicksand_700Bold,
    Comfortaa_700Bold,
    Fredoka_600SemiBold,
    Baloo2_700Bold,
    Nunito_800ExtraBold,
    Lexend_700Bold,
  });

  if (!loaded) return <Screen center><Text>Loading…</Text></Screen>;

  return (
    <Screen scroll contentStyle={{ gap: theme.spacing.xxl }}>
      <Text style={[theme.typography.heading, { color: theme.colors.textMuted }]}>
        Pick a title font
      </Text>
      {CANDIDATES.map((c) => (
        <View key={c.name} style={{ gap: 4 }}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{c.name}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text style={{ fontFamily: c.family, fontSize: 44, color: theme.colors.primary, letterSpacing: 1 }}>
              SAKU
            </Text>
            <Mark size={34} />
          </View>
        </View>
      ))}
    </Screen>
  );
}
