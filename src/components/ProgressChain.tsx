/**
 * <ProgressChain> — vertical chain of RadioDots (master plan §6).
 *
 * The literal visual of "one at a time": completed steps are filled, the
 * current step is active (pulsing), upcoming steps are empty. Connecting
 * segments tint to show how far the momentum has travelled.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioDot, RadioDotState } from './RadioDot';
import { useTheme } from '../theme/ThemeProvider';

export interface ProgressStep {
  label: string;
  state: RadioDotState;
}

export interface ProgressChainProps {
  steps: ProgressStep[];
  /** Dot diameter in px. Default 28. */
  dotSize?: number;
}

export function ProgressChain({ steps, dotSize = 28 }: ProgressChainProps) {
  const theme = useTheme();

  return (
    <View>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        // Segment below a completed step is "travelled" → accent tint.
        const segmentColor =
          step.state === 'filled' ? theme.colors.accent : theme.colors.border;

        return (
          <View key={`${step.label}-${index}`} style={styles.row}>
            <View style={styles.rail}>
              <RadioDot state={step.state} size={dotSize} label={step.label} />
              {!isLast && (
                <View
                  style={[
                    styles.segment,
                    { backgroundColor: segmentColor, height: theme.spacing.lg },
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                theme.typography.body,
                {
                  color:
                    step.state === 'empty'
                      ? theme.colors.textMuted
                      : theme.colors.text,
                  marginLeft: theme.spacing.md,
                  marginBottom: isLast ? 0 : theme.spacing.lg,
                },
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rail: {
    alignItems: 'center',
  },
  segment: {
    width: 2,
    marginVertical: 2,
  },
});
