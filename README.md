# SAKU

*AI dream-to-action planner for ADHD brains — and anyone stuck on what to do
next. Positioning: wellness / productivity, **not** a medical tool.*

**Saku** = "pocket" (an app that lives in your pocket, ramah kantong / free
tier). The hidden layer: *radio* = **radio button** — you pick exactly **one**
option, step by step, never a checkbox multi-select. That single primitive
encodes the whole philosophy (single-tasking is what actually works for ADHD
brains) and drives the entire design language.

> One thing at a time. · Pilih satu, selesaikan.

Full brand + product plan: [`docs/master-plan.md`](docs/master-plan.md).

---

## Status — Phase 0: Design System

This repo currently contains the **brand + design-system foundation** every
later screen reuses. No MVP features (auth, AI, backend) yet — those are Phase
1+ (see the master plan roadmap).

The app's home screen (`App.tsx`) is a **living design-system showcase**:
palette, typography, all `RadioDot` states, and a `ProgressChain`.

## Stack

- **Expo** (SDK 57) + **TypeScript**
- **react-native-reanimated** (v4, worklets) — dot fill animation on the UI thread
- **expo-haptics** — success/selection/impact feedback
- **Poppins** (display) + **DM Sans** (body/UI) via `@expo-google-fonts/*`

## Run

```bash
npm install
npx expo start        # then press i / a, or scan with Expo Go
```

Verify the build headlessly (no device needed):

```bash
npx tsc --noEmit                          # types
npx expo export --platform ios --output-dir /tmp/saku-export   # Metro bundle
```

## Layout

```
App.tsx                       design-system showcase (Phase 0 deliverable)
src/
  theme/
    colors.ts                 palette + light/dark semantic color roles
    typography.ts             Poppins/DM Sans type scale + font family keys
    spacing.ts                4pt spacing scale + radius tokens
    theme.ts                  assembles lightTheme / darkTheme + Theme type
    ThemeProvider.tsx         <ThemeProvider> + useTheme() / useThemePreference()
  hooks/
    useHaptic.ts              best-effort haptic wrapper (never gates the UI)
  components/
    RadioDot.tsx              signature primitive: empty | active | filled
    ProgressChain.tsx         vertical chain of dots = "one at a time"
docs/master-plan.md           brand identity + full roadmap
```

## Design rules

- **Read tokens via `useTheme()`** — no hardcoded colors/spacing, so dark mode
  and future rebrands stay free (master plan §6).
- **Dopamine accent (coral/sunny) is celebration-only** — filled dot, plan
  complete. Base stays calm and low-sensory (master plan §3).
- **Haptics complement, never gate** — they no-op silently on web / Low Power
  Mode; the visual always stands on its own.

## Next (Phase 1+)

MVP core (auth, one active plan as a radio group, conversational capture → AI
simplify), then the agentic research layer, monetization, and ASO. See the
master plan roadmap.
