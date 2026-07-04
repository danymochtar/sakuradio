/**
 * <RadioDot> — SAKU's signature primitive (master plan §5, §6).
 *
 * The whole product philosophy lives in this shape: a radio button lets you
 * pick exactly ONE thing. Three states:
 *   - empty   → not done yet (hollow ring)
 *   - active  → the current step (gently pulsing ring)
 *   - filled  → done (inner dot springs in + celebration accent + haptic)
 *
 * The fill animates on the UI thread via Reanimated (60fps) and, when tapped,
 * fires a success haptic — visual + tactile land together (<~50ms) so the
 * completion feels like a subtle, satisfying "click".
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHaptic } from '../hooks/useHaptic';
import { useTheme } from '../theme/ThemeProvider';

export type RadioDotState = 'empty' | 'active' | 'filled';

export interface RadioDotProps {
  state: RadioDotState;
  /** Outer diameter in px. Default 28. */
  size?: number;
  /** Called on tap. The dot itself is controlled — parent flips `state`. */
  onPress?: () => void;
  /** Fire the celebration haptic on press. Default true. */
  hapticOnPress?: boolean;
  /** Accessibility label (e.g. the step title). */
  label?: string;
}

export function RadioDot({
  state,
  size = 28,
  onPress,
  hapticOnPress = true,
  label,
}: RadioDotProps) {
  const theme = useTheme();
  const haptic = useHaptic();

  // 0 = empty, 1 = fully filled. Drives the inner dot's scale.
  const fill = useSharedValue(state === 'filled' ? 1 : 0);
  // Pulsing halo opacity for the active state.
  const pulse = useSharedValue(0);

  useEffect(() => {
    fill.value = withSpring(state === 'filled' ? 1 : 0, {
      damping: 12,
      stiffness: 180,
      mass: 0.6,
    });
  }, [state, fill]);

  useEffect(() => {
    if (state === 'active') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 900, easing: Easing.in(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      pulse.value = withTiming(0, { duration: 200 });
    }
  }, [state, pulse]);

  const ringColor =
    state === 'filled'
      ? theme.colors.accent
      : state === 'active'
        ? theme.colors.primary
        : theme.colors.border;

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fill.value }],
    opacity: fill.value,
  }));

  const haloStyle = useAnimatedStyle(() => ({
    opacity: pulse.value * 0.35,
    transform: [{ scale: 1 + pulse.value * 0.6 }],
  }));

  const innerSize = size * 0.5;

  const handlePress = () => {
    if (hapticOnPress) haptic.success();
    onPress?.();
  };

  const content = (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Pulsing halo (active only) */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.halo,
          { borderRadius: size / 2, backgroundColor: theme.colors.primary },
          haloStyle,
        ]}
      />
      {/* Outer ring */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: ringColor,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        {/* Inner filled dot */}
        <Animated.View
          style={[
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
              backgroundColor: theme.colors.accent,
            },
            innerStyle,
          ]}
        />
      </View>
    </View>
  );

  if (!onPress) {
    return (
      <View
        accessibilityRole="image"
        accessibilityLabel={label ?? `radio ${state}`}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="radio"
      accessibilityState={{ selected: state === 'filled' }}
      accessibilityLabel={label ?? `radio ${state}`}
      hitSlop={8}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ring: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    alignSelf: 'center',
  },
});
