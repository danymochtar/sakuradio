/**
 * /capture — type a goal / dream; Saku's AI breaks it into small steps and
 * creates the plan, then returns home.
 */

import { useState } from 'react';
import { Text, View } from 'react-native';
import { Redirect, useRouter, Stack } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { TextField } from '../src/components/TextField';
import { useSession } from '../src/lib/authClient';
import { capturePlan } from '../src/lib/plans';
import { useTheme } from '../src/theme/ThemeProvider';

const PROMPTS = [
  'Plan a trip to Japan',
  'Start running again',
  'Launch my side project',
  'Declutter my room',
];

export default function Capture() {
  const theme = useTheme();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isPending && !session) return <Redirect href="/sign-in" />;

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await capturePlan(dream.trim());
      router.replace('/home');
    } catch (e) {
      setError(String((e as Error).message ?? e));
      setLoading(false);
    }
  };

  return (
    <Screen scroll contentStyle={{ gap: theme.spacing.lg }}>
      <Stack.Screen options={{ headerShown: true, title: '', headerBackTitle: 'Back' }} />

      <Text style={[theme.typography.display, { color: theme.colors.text }]}>
        What do you want to do?
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
        A goal, a dream, anything you're stuck on. Saku turns it into small steps — you take one at
        a time.
      </Text>

      <TextField
        label="Your goal"
        value={dream}
        onChangeText={setDream}
        placeholder="e.g. I want to plan a 2-week trip to Japan"
        multiline
        numberOfLines={4}
        style={{ minHeight: 110, textAlignVertical: 'top' }}
        autoFocus
      />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {PROMPTS.map((p) => (
          <Button key={p} label={p} variant="secondary" onPress={() => setDream(p)} />
        ))}
      </View>

      {error && (
        <Text style={[theme.typography.caption, { color: theme.colors.accent }]}>{error}</Text>
      )}

      <Button
        label="Break it into steps"
        onPress={submit}
        loading={loading}
        disabled={dream.trim().length < 3}
      />
    </Screen>
  );
}
