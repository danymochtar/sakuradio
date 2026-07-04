/**
 * SAKU — Phase 0 design-system showcase.
 *
 * Not a product screen — a living reference that renders every design token and
 * core component so the foundation is verifiable by eye before MVP features are
 * built. Palette · typography · RadioDot states · ProgressChain · taglines.
 */

import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
// Import per-weight subpaths (not the package root) so Metro only bundles the
// 6 weights we actually use, instead of every weight in the family.
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';

import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { palette } from './src/theme/colors';
import { RadioDot, RadioDotState } from './src/components/RadioDot';
import { ProgressChain } from './src/components/ProgressChain';
import { registerPwa } from './src/pwa/registerPwa';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: theme.spacing.xxl }}>
      <Text
        style={[
          theme.typography.heading,
          { color: theme.colors.text, marginBottom: theme.spacing.md },
        ]}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

function Swatch({ name, hex }: { name: string; hex: string }) {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center', width: 92, marginBottom: theme.spacing.md }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: theme.radius.md,
          backgroundColor: hex,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      />
      <Text style={[theme.typography.caption, { color: theme.colors.text, marginTop: 6 }]}>
        {name}
      </Text>
      <Text style={[theme.typography.mono, { color: theme.colors.textMuted }]}>{hex}</Text>
    </View>
  );
}

function Showcase() {
  const theme = useTheme();

  // A tappable dot to feel the fill animation + success haptic.
  const [demoState, setDemoState] = useState<RadioDotState>('empty');
  const cycle = () =>
    setDemoState((s) => (s === 'empty' ? 'active' : s === 'active' ? 'filled' : 'empty'));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar style={theme.scheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.xl,
          paddingTop: theme.spacing.xxxl,
        }}
      >
        {/* Masthead */}
        <Text style={[theme.typography.display, { color: theme.colors.primary }]}>Saku</Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginBottom: theme.spacing.xxl },
          ]}
        >
          Phase 0 · Design System
        </Text>

        {/* Palette */}
        <Section title="Palette">
          <View style={styles.swatchGrid}>
            <Swatch name="paper" hex={palette.paper} />
            <Swatch name="primary" hex={palette.teal} />
            <Swatch name="ink" hex={palette.ink} />
            <Swatch name="accent" hex={palette.coral} />
            <Swatch name="sunny" hex={palette.sunny} />
            <Swatch name="sage" hex={palette.sage} />
            <Swatch name="lavender" hex={palette.lavender} />
            <Swatch name="dark" hex={palette.ink900} />
          </View>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <Text style={[theme.typography.display, { color: theme.colors.text }]}>
            Poppins display
          </Text>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            Poppins title
          </Text>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.text, marginTop: theme.spacing.sm },
            ]}
          >
            DM Sans body — optimized for small sizes so long text stays calm and
            readable.
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            DM Sans caption
          </Text>
        </Section>

        {/* RadioDot states */}
        <Section title="RadioDot">
          <View style={styles.dotRow}>
            <View style={styles.dotItem}>
              <RadioDot state="empty" />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                empty
              </Text>
            </View>
            <View style={styles.dotItem}>
              <RadioDot state="active" />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                active
              </Text>
            </View>
            <View style={styles.dotItem}>
              <RadioDot state="filled" />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                filled
              </Text>
            </View>
            <View style={styles.dotItem}>
              <RadioDot state={demoState} size={40} onPress={cycle} label="demo dot" />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                tap me
              </Text>
            </View>
          </View>
        </Section>

        {/* ProgressChain */}
        <Section title="ProgressChain">
          <ProgressChain
            steps={[
              { label: 'Riset visa Jepang', state: 'filled' },
              { label: 'Susun budget', state: 'filled' },
              { label: 'Booking tiket', state: 'active' },
              { label: 'Bikin itinerary', state: 'empty' },
              { label: 'Packing', state: 'empty' },
            ]}
          />
        </Section>

        {/* Taglines */}
        <Section title="Voice">
          <Text style={[theme.typography.title, { color: theme.colors.primary }]}>
            One thing at a time.
          </Text>
          <Text
            style={[theme.typography.body, { color: theme.colors.textMuted, marginTop: 4 }]}
          >
            Pilih satu, selesaikan.
          </Text>
        </Section>
      </ScrollView>
    </View>
  );
}

export default function App() {
  const scheme = useColorScheme();

  // Wire up the PWA (manifest, icons, service worker) on web; no-op on native.
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
    // Minimal splash — themed background without depending on loaded fonts.
    return (
      <View
        style={[
          styles.splash,
          { backgroundColor: scheme === 'dark' ? palette.ink900 : palette.paper },
        ]}
      />
    );
  }

  return (
    <ThemeProvider>
      <Showcase />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  splash: { flex: 1 },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
  },
  dotItem: {
    alignItems: 'center',
    gap: 6,
  },
});
