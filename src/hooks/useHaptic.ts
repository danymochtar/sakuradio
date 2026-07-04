/**
 * useHaptic() — reusable haptic wrapper (master plan §5).
 *
 * Haptics COMPLEMENT the visual, never gate it: iOS Taptic is silent under Low
 * Power Mode / dictation / active camera, and there's no engine on web. So every
 * call is fire-and-forget and swallows errors — the UI never waits on or breaks
 * because of haptics.
 */

import { useMemo } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

type ImpactStrength = 'light' | 'medium' | 'heavy';

export interface HapticApi {
  /** Task done / plan complete celebration. */
  success: () => void;
  /** Warning feedback. */
  warning: () => void;
  /** Error feedback. */
  error: () => void;
  /** Discrete selection change (e.g. switching active plan). */
  selection: () => void;
  /** Physical tap feedback; defaults to light. */
  impact: (strength?: ImpactStrength) => void;
}

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

/** Run a haptic call, ignoring any platform/runtime failure. */
function safe(run: () => Promise<void>): void {
  if (!isSupported) return;
  run().catch(() => {
    /* haptics are best-effort; never surface an error */
  });
}

const IMPACT_STYLE: Record<ImpactStrength, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

export function useHaptic(): HapticApi {
  return useMemo<HapticApi>(
    () => ({
      success: () =>
        safe(() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
        ),
      warning: () =>
        safe(() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
        ),
      error: () =>
        safe(() =>
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
        ),
      selection: () => safe(() => Haptics.selectionAsync()),
      impact: (strength: ImpactStrength = 'light') =>
        safe(() => Haptics.impactAsync(IMPACT_STYLE[strength])),
    }),
    [],
  );
}
