/**
 * /showcase — the Phase 0 design-system reference (palette, type, RadioDot,
 * ProgressChain). Kept as a route for visual QA; not part of the product flow.
 */

import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import { palette } from '../src/theme/colors';
import { RadioDot, RadioDotState } from '../src/components/RadioDot';
import { ProgressChain } from '../src/components/ProgressChain';

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

export default function Showcase() {
  const theme = useTheme();
  const [demoState, setDemoState] = useState<RadioDotState>('empty');
  const cycle = () =>
    setDemoState((s) => (s === 'empty' ? 'active' : s === 'active' ? 'filled' : 'empty'));

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ padding: theme.spacing.xl, paddingTop: theme.spacing.xxxl }}
    >
      <Text style={[theme.typography.display, { color: theme.colors.primary }]}>Saku</Text>
      <Text
        style={[
          theme.typography.body,
          { color: theme.colors.textMuted, marginBottom: theme.spacing.xxl },
        ]}
      >
        Phase 0 · Design System
      </Text>

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

      <Section title="Typography">
        <Text style={[theme.typography.display, { color: theme.colors.text }]}>
          Poppins display
        </Text>
        <Text style={[theme.typography.title, { color: theme.colors.text }]}>Poppins title</Text>
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.text, marginTop: theme.spacing.sm },
          ]}
        >
          DM Sans body — optimized for small sizes so long text stays calm and readable.
        </Text>
        <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
          DM Sans caption
        </Text>
      </Section>

      <Section title="RadioDot">
        <View style={styles.dotRow}>
          {(['empty', 'active', 'filled'] as const).map((s) => (
            <View key={s} style={styles.dotItem}>
              <RadioDot state={s} />
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{s}</Text>
            </View>
          ))}
          <View style={styles.dotItem}>
            <RadioDot state={demoState} size={40} onPress={cycle} label="demo dot" />
            <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>tap me</Text>
          </View>
        </View>
      </Section>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dotRow: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  dotItem: { alignItems: 'center', gap: 6 },
});
