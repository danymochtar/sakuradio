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

## Status — MVP

Full dream-to-action loop:

1. **Sign in / up** — email + password (Better Auth).
2. **Capture** a goal/dream → AI breaks it into 3–7 small, ordered steps
   (Vercel AI Gateway, Claude Haiku) and saves it as a plan.
3. **Home** shows your one active plan as a chain of `RadioDot`s — tap a dot to
   complete a step (fill animation + success haptic), one at a time.
4. **Finish** the plan to free the single free-tier active slot; other plans
   queue and can be activated (the radio-group rule).

`/showcase` still hosts the design-system reference.

## Stack

- **Expo** (SDK 57) + **TypeScript** + **Expo Router**
- **react-native-reanimated** (v4) — dot fill animation · **expo-haptics**
- **Poppins** / **DM Sans** (`@expo-google-fonts/*`)
- **Backend**: Vercel serverless functions (`/api/*`)
- **Better Auth** (email+password) · **Prisma + PostgreSQL** · **Vercel AI Gateway**

## Architecture

```
app/            Expo Router screens (client): index gate, sign-in/up, home, capture, plans
src/            client-only code: theme, components, hooks, authClient, api helpers
api/            Vercel serverless functions (server): auth catch-all, capture, plans, steps
server/         server-only logic: prisma singleton, session, plan ops, AI simplify
lib/auth.ts     Better Auth server config (Prisma adapter)
prisma/         schema + migration (users/sessions/accounts/verifications/plans/steps)
```

The client (`app/` + `src/`) is a static PWA. The backend (`api/` + `server/` +
`lib/`) runs as Vercel functions and is **never** bundled into the client
(verified: no Prisma / secrets in `dist/`). The web app calls `/api/*`
same-origin; the native app uses `EXPO_PUBLIC_API_URL`.

## Run

```bash
npm install
npx expo start        # native: press i / a, or scan with Expo Go
npm run web           # web dev server
```

## Web / PWA

The showcase also ships as an installable **PWA** (the app that lives in your
pocket). Web is a first-class target here — it's what deploys to Vercel.

```bash
npm run build:web     # → dist/ (static export, output: "single")
npm run icons         # regenerate PWA icons from public/icon.svg (needs sharp)
```

PWA wiring:

- `public/manifest.json`, `public/sw.js`, and the icons are copied to the site
  root by Expo's static export.
- `src/pwa/registerPwa.web.ts` injects the manifest link, `apple-touch-icon` +
  iOS metas, and registers the service worker at runtime (web only; the native
  `registerPwa.ts` is a no-op via Metro platform resolution).
- `theme-color` / `description` come from `app.json` → `web` and land in the
  static HTML directly.

Verify the build headlessly (no device needed):

```bash
npm run typecheck                         # types
npm run build:web                         # web Metro bundle → dist/
npx expo export --platform ios --output-dir /tmp/saku-export   # native bundle
```

## Deploy (Vercel)

`vercel.json` builds the client with `npm run build:web` (static SPA in `dist/`)
and the SPA rewrite excludes `/api` so Vercel serves the `api/*` functions.
Push to the connected repo to deploy.

**Required environment variables** (Vercel → Settings → Environment Variables):

| Var | Purpose |
|-----|---------|
| `DATABASE_URL` | Postgres connection (the `sakuradio` database) |
| `BETTER_AUTH_SECRET` | Session signing secret |
| `BETTER_AUTH_URL` | Your production URL, e.g. `https://sakuradio.vercel.app` (correct auth cookies) |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key (powers `/api/capture`) |
| `AI_MODEL` | *optional* — gateway model id, defaults to `anthropic/claude-haiku-4.5` |

Run the DB migration once (see below) before first use. Prisma's client is
generated on install via the `postinstall` hook, with a `rhel-openssl-3.0.x`
binary target for Vercel's serverless runtime.

## Database (Prisma + PostgreSQL)

The **server-side** data layer. Prisma models `User → Plan → Step`, encoding the
radio-button product rules: one **active** plan per user (free tier), steps
worked one at a time. `StepStatus` maps 1:1 to `<RadioDot>`:
`PENDING → empty`, `ACTIVE → active`, `DONE → filled`.

Prisma is Node-only and lives in `prisma/` + `server/` — never imported by the
Expo app, never bundled into the client (verified: no `PrismaClient` and no
`DATABASE_URL` in `dist/`).

**Setup** (run where the DB host is reachable — the DB URL is not committed):

```bash
cp .env.example .env      # then set DATABASE_URL (…@HOST:5432/sakuradio)

# Create the database if it doesn't exist (skip if migrate dev makes it for you):
psql "postgresql://USER:PASSWORD@HOST:5432/postgres" -c "CREATE DATABASE sakuradio;"

npm run db:deploy         # apply the committed init migration → tables
# or, iterating on the schema:
npm run db:migrate        # prisma migrate dev (creates DB if missing, makes new migrations)
npm run db:studio         # browse data
```

**Or migrate from CI** (if your machine can't reach the DB either): the
`.github/workflows/db-migrate.yml` workflow runs the create-DB + migration from a
GitHub-hosted runner (open network egress). Add a repo secret `DATABASE_URL`
(Settings → Secrets and variables → Actions), then run the **DB migrate**
workflow from the Actions tab. It creates `sakuradio` if missing and applies the
committed migration.

The migration (`prisma/migrations/*_init`) creates the Better Auth tables
(`users`, `sessions`, `accounts`, `verifications`) and the product tables
(`plans`, `steps`) with their enums, indexes, and cascade foreign keys. Use the
singleton in `server/prisma.ts` from server code:

```ts
import { prisma } from './server/prisma';
const plans = await prisma.plan.findMany({ where: { userId, status: 'ACTIVE' } });
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
