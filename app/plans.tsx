/**
 * /plans — every plan the user has. Free tier keeps one ACTIVE focus; tapping a
 * queued plan makes it the active one (the radio-group rule). Completed plans
 * show as done.
 */

import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { Redirect, Stack, useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { RadioDot } from '../src/components/RadioDot';
import { useSession } from '../src/lib/authClient';
import { fetchPlans, patchPlan } from '../src/lib/plans';
import { Plan } from '../src/types';
import { useTheme } from '../src/theme/ThemeProvider';

export default function Plans() {
  const theme = useTheme();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    let alive = true;
    fetchPlans().then((p) => alive && setPlans(p)).catch(() => alive && setPlans([]));
    return () => {
      alive = false;
    };
  }, []);
  useFocusEffect(load);

  if (!isPending && !session) return <Redirect href="/sign-in" />;

  const activate = async (plan: Plan) => {
    if (plan.isActive || busy) return;
    setBusy(true);
    try {
      await patchPlan(plan.id, 'activate');
      load();
      router.push('/home');
    } finally {
      setBusy(false);
    }
  };

  const dotState = (plan: Plan) =>
    plan.status === 'COMPLETED' ? 'filled' : plan.isActive ? 'active' : 'empty';

  return (
    <Screen scroll contentStyle={{ gap: theme.spacing.md }}>
      <Stack.Screen options={{ headerShown: true, title: 'All plans', headerBackTitle: 'Home' }} />

      {plans === null ? (
        <ActivityIndicator color={theme.colors.primary} style={{ marginTop: theme.spacing.xxl }} />
      ) : plans.length === 0 ? (
        <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
          No plans yet. Capture your first goal from the home screen.
        </Text>
      ) : (
        plans.map((plan) => {
          const doneCount = plan.steps.filter((s) => s.status === 'DONE').length;
          return (
            <Pressable
              key={plan.id}
              onPress={() => activate(plan)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: plan.isActive ? theme.colors.primary : theme.colors.border,
                borderRadius: theme.radius.md,
                padding: theme.spacing.lg,
              }}
            >
              <RadioDot state={dotState(plan)} size={26} />
              <View style={{ flex: 1 }}>
                <Text style={[theme.typography.bodyStrong, { color: theme.colors.text }]}>
                  {plan.title}
                </Text>
                <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
                  {plan.status === 'COMPLETED'
                    ? 'Completed'
                    : plan.isActive
                      ? `Active · ${doneCount}/${plan.steps.length} steps`
                      : `Queued · ${doneCount}/${plan.steps.length} steps`}
                </Text>
              </View>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}
