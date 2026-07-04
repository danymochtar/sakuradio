/**
 * /home — the one active plan, worked one step at a time.
 *
 * Tap a step's RadioDot to complete it (fill animation + success haptic).
 * When every step is done, celebrate and let the user finish the plan, which
 * frees the single free-tier active slot for the next one.
 */

import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Redirect, useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../src/components/Screen';
import { Button } from '../src/components/Button';
import { RadioDot } from '../src/components/RadioDot';
import { useSession, signOut } from '../src/lib/authClient';
import { fetchPlans, toggleStep, patchPlan, planToChain, isPlanComplete } from '../src/lib/plans';
import { Plan } from '../src/types';
import { useTheme } from '../src/theme/ThemeProvider';
import { useHaptic } from '../src/hooks/useHaptic';

export default function Home() {
  const theme = useTheme();
  const haptic = useHaptic();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [busyStepId, setBusyStepId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    let alive = true;
    fetchPlans()
      .then((p) => alive && setPlans(p))
      .catch((e) => alive && setError(String(e.message ?? e)));
    return () => {
      alive = false;
    };
  }, []);

  useFocusEffect(load);

  if (isPending) {
    return (
      <Screen center>
        <ActivityIndicator color={theme.colors.primary} />
      </Screen>
    );
  }
  if (!session) return <Redirect href="/sign-in" />;

  const active = plans?.find((p) => p.isActive && p.status === 'ACTIVE') ?? null;
  const firstName = session.user.name?.split(' ')[0] ?? 'there';

  const onToggle = async (stepId: string, done: boolean) => {
    setBusyStepId(stepId);
    setError(null);
    try {
      const updated = await toggleStep(stepId, done);
      setPlans((prev) => (prev ? prev.map((p) => (p.id === updated.id ? updated : p)) : [updated]));
    } catch (e) {
      setError(String((e as Error).message ?? e));
    } finally {
      setBusyStepId(null);
    }
  };

  const onCompletePlan = async () => {
    if (!active) return;
    haptic.success();
    try {
      await patchPlan(active.id, 'complete');
      load();
    } catch (e) {
      setError(String((e as Error).message ?? e));
    }
  };

  return (
    <Screen scroll>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            Hi {firstName}
          </Text>
          <Text style={[theme.typography.title, { color: theme.colors.text }]}>
            One thing at a time
          </Text>
        </View>
        <Pressable onPress={() => signOut()} accessibilityRole="button">
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>Sign out</Text>
        </Pressable>
      </View>

      {error && (
        <Text style={[theme.typography.caption, { color: theme.colors.accent, marginBottom: 12 }]}>
          {error}
        </Text>
      )}

      {plans === null ? (
        <View style={{ paddingVertical: theme.spacing.xxxl, alignItems: 'center' }}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : active ? (
        <ActivePlan
          plan={active}
          busyStepId={busyStepId}
          onToggle={onToggle}
          onComplete={onCompletePlan}
        />
      ) : (
        <EmptyState onCapture={() => router.push('/capture')} />
      )}

      {/* Secondary nav */}
      {plans !== null && (
        <View style={{ marginTop: theme.spacing.xxl, gap: theme.spacing.sm }}>
          {active && (
            <Button label="+ New goal" variant="secondary" onPress={() => router.push('/capture')} />
          )}
          <Pressable onPress={() => router.push('/plans')} style={{ alignItems: 'center' }}>
            <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
              All plans
            </Text>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

function ActivePlan({
  plan,
  busyStepId,
  onToggle,
  onComplete,
}: {
  plan: Plan;
  busyStepId: string | null;
  onToggle: (stepId: string, done: boolean) => void;
  onComplete: () => void;
}) {
  const theme = useTheme();
  const chain = planToChain(plan);
  const complete = isPlanComplete(plan);

  return (
    <View>
      <Text style={[theme.typography.display, { color: theme.colors.text }]}>{plan.title}</Text>
      {plan.dream ? (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textMuted, marginTop: theme.spacing.xs },
          ]}
        >
          {plan.dream}
        </Text>
      ) : null}

      <View style={{ marginTop: theme.spacing.xl }}>
        {chain.map((step, i) => {
          const isLast = i === chain.length - 1;
          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.rail}>
                <RadioDot
                  state={step.state}
                  size={32}
                  onPress={busyStepId ? undefined : () => onToggle(step.id, !step.done)}
                  hapticOnPress={!step.done}
                  label={step.label}
                />
                {!isLast && (
                  <View
                    style={[
                      styles.segment,
                      {
                        backgroundColor: step.done ? theme.colors.accent : theme.colors.border,
                        height: theme.spacing.lg,
                      },
                    ]}
                  />
                )}
              </View>
              <Text
                style={[
                  theme.typography.bodyStrong,
                  {
                    color: step.done ? theme.colors.textMuted : theme.colors.text,
                    textDecorationLine: step.done ? 'line-through' : 'none',
                    marginLeft: theme.spacing.md,
                    marginBottom: isLast ? 0 : theme.spacing.lg,
                    flex: 1,
                  },
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      {complete && (
        <View style={{ marginTop: theme.spacing.xl, gap: theme.spacing.sm }}>
          <Text style={[theme.typography.heading, { color: theme.colors.primary }]}>
            🎉 Every step done. Nice work.
          </Text>
          <Button label="Finish this plan" onPress={onComplete} />
        </View>
      )}
    </View>
  );
}

function EmptyState({ onCapture }: { onCapture: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ paddingTop: theme.spacing.xxl, gap: theme.spacing.lg }}>
      <RadioDot state="active" size={56} />
      <Text style={[theme.typography.title, { color: theme.colors.text }]}>
        Pick one thing to start.
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
        Tell Saku a goal or a messy dream. It'll break it into small steps — and you focus on one
        at a time.
      </Text>
      <Button label="Capture your first goal" onPress={onCapture} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start' },
  rail: { alignItems: 'center' },
  segment: { width: 2, marginVertical: 2 },
});
