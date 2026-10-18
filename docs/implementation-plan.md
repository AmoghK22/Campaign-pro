# Implementation Plan — Campaign Amplification Platform

Status: planning pass only (no application code changed).
Source of truth: `README_IMPLEMENTATION.md`. Phase prompts: `OPENCODE_PHASE_PROMPTS.md`.

## 1. What was inspected

- Repository contents: only specification/planning documents exist
  (`README_IMPLEMENTATION.md`, `OPENCODE_FIRST_PROMPT.md`, `OPENCODE_PHASE_PROMPTS.md`,
  `ACCEPTANCE_CHECKLIST.md`, `DEMO_VIDEO_SCRIPT.md`, `ENV_EXAMPLE.txt`).
  No `package.json`, no app or backend code, no `docs/` folder before this pass.
- Git: **not a git repository** (no `.git`). Git binary is installed.
- Tooling (checked):
  - Node v22.17.0, npm 10.9.2, npx — available
  - Git 2.50.1 — available
  - Docker 28.4.0 — available (needed only for Phase 6 PostgreSQL)
  - Java OpenJDK 17.0.16 — available (usable for local Android/Gradle builds)
  - Android SDK / `adb` / `ANDROID_HOME` — **not found**
  - `eas` / `expo` global CLIs — not installed globally (use `npx expo`, `npx eas-cli`)
  - pnpm / yarn / bun — not installed; **npm is the package manager**
- Nothing to preserve yet: no existing implementation to overwrite.

## 2. Architecture decision (concise)

**Single Expo app, TypeScript, mobile-first, with a repository/service data layer that
defaults to a labelled local Demo Mode.** The API client sits behind the same repository
interface, so the app is fully demonstrable with zero backend, and upgrades to the
Express/Prisma API without touching screens.

- **Monorepo layout** (per spec §9), npm workspaces:
  - `apps/mobile` — Expo Router + Zustand + React Hook Form/Zod + AsyncStorage
  - `apps/api` — Express + Zod + Prisma/PostgreSQL (Phase 6, behind Docker)
  - `packages/shared` — domain types, lifecycle state machine, demo math, zod schemas
    shared by both apps (prevents model drift between local and server mode)
- **State**: Zustand stores persisted to AsyncStorage (drafts, contributions, follows,
  activity, feedback). Demo Mode = local repository; API mode = remote repository.
  One `Repository` interface, two implementations, selected by config/env.
- **Navigation**: Expo Router with `(tabs)` group for the five persistent tabs
  (Home, Explore, Create, Activity, Profile) and stack routes for detail, wizard,
  checkout, dashboard, reports, info pages — secondary routes render **without** the
  tab bar where the spec forbids a competing second bar (detail/creation subroutes
  keep contextual back navigation).
- **Demo math centralized** in `packages/shared/src/demoConfig.ts`:
  fee 3%, net = amount − fee, estimated impressions = 100 × net (INR).
  Impressions and unique reach are distinct types/labels everywhere.
- **Lifecycle**: one typed state machine (`canTransition(from, to)`) in shared code,
  validated in UI and API; every transition appends a `ReviewEvent` audit record.
- **Honesty guards**: a shared `DemoBanner`/label component for simulated payment,
  simulated review, estimated reach; no button ships without a real handler.

## 3. Proposed folder tree

```
campaignApp/
  apps/
    mobile/
      app/                      # Expo Router routes
        (tabs)/                 # home, explore, create, activity, profile
        campaign/[id].tsx
        campaign/[id]/contribute/…  # amount, review, checkout, result
        create/                 # wizard stack: 1..5 + preview + confirm
        dashboard/…             # creator dashboard, status, report
        activity/…  profile/…  info/…  demo-reviewer.tsx (secondary route)
      src/
        components/             # Button, Input, Chip, Card, ProgressBar,
                                # StatusPill, EmptyState, Skeleton, ErrorBanner,
                                # Accordion, StepIndicator, DemoBadge, ImageWithFallback
        features/
          campaigns/  creation/  contributions/  activity/  profile/  reports/
        services/               # repository interface + local + api implementations
        store/                  # zustand slices (persisted)
        theme/                  # tokens: color, spacing, radius, type
        types/  utils/
      assets/                   # bundled local images
      app.json  eas.json  package.json  tsconfig.json
    api/
      src/ routes/ services/ domain/ middleware/ validators/
      prisma/  tests/
  packages/
    shared/                     # types, lifecycle, demoConfig, schemas
  docs/
    implementation-plan.md      # this file
    acceptance-checklist.md
    design-system.md  demo-script.md   (later phases)
  docker-compose.yml
  .env.example
  README.md
```

## 4. Prioritized phases (7)

Mirrors `OPENCODE_PHASE_PROMPTS.md`; each phase is a separate prompt and is verified
before the next begins.

1. **Foundation & navigation** — Expo+TS scaffold, theme tokens, reusable primitives,
   5-tab router, safe areas/back/keyboard handling, shared domain types, Demo Mode
   repository with seed skeleton. *Exit: app boots on Expo, all 5 tabs navigate.*
2. **Home, Explore, detail** — editorial UI, ≥8 coherent seed campaigns, working
   search/category/sort/clear, loading/empty/no-results/error states, detail with story,
   sources, use-of-funds, feedback, amplification disclaimer. *Exit: filters actually filter.*
3. **Five-step wizard & drafts** — Basics → Story → Campaign & Ad Visuals → Reach →
   Submit exactly, step indicator, debounced autosave + visible status, restart
   survival, validation (title ≤60), sections add/remove/reorder, submit →
   `SUBMITTED_FOR_REVIEW` + timeline. *Exit: restart preserves draft.*
4. **Contribution & receipt** — amount → review → simulated checkout (all 5 outcomes) →
   receipt; idempotent success-only funding updates; centralized fee/impression math;
   private backer/payment history. *Exit: duplicate completion applies once.*
5. **Activity, Profile, dashboard, reports** — events/read state/prefs, demo identity,
   creator dashboard filters, distribution report with honest "Not available" metrics,
   centralized lifecycle enforcement, optional secondary demo-reviewer route.
6. **Backend & persistence** — Express+Prisma+Zod REST per spec §8, seed, migrations,
   Docker Compose, API tests, `.env.example`; mobile switches via repository layer;
   Demo Mode remains functional offline. *(Cut first if time-constrained.)*
7. **Polish, audit, APK** — strict QA pass against acceptance checklist, lint/typecheck/
   tests, EAS APK profile + exact build command, `docs/demo-script.md`, honest
   PASS/FAIL report.

## 5. Domain models & lifecycle

Models (shared types; Prisma mirrors them in Phase 6):
`User`, `Campaign`, `Contribution`, `Follow`, `SavedCampaign`, `ActivityEvent`,
`CampaignUpdate`, `Feedback`, `ReviewEvent`, `DistributionReport`.

Campaign lifecycle (validated centrally; audit event on every transition):

```
DRAFT → SUBMITTED_FOR_REVIEW
SUBMITTED_FOR_REVIEW → CHANGES_REQUESTED | APPROVED | REJECTED   (simulated reviewer)
CHANGES_REQUESTED → DRAFT (edit) → SUBMITTED_FOR_REVIEW
APPROVED → AVAILABLE_FOR_FUNDING → FUNDING
FUNDING → FUNDING_GOAL_REACHED | FUNDING_PERIOD_ENDED
FUNDING_GOAL_REACHED → DISTRIBUTION_PREPARATION      ← never straight to PROMOTING
FUNDING_PERIOD_ENDED → DISTRIBUTION_PREPARATION | COMPLETED (explicit)
DISTRIBUTION_PREPARATION → PROMOTING  (requires approved + budget + distribution ready)
PROMOTING → COMPLETED (explicit completion/report event)
exceptional: REJECTED, CANCELLED, REFUND_PENDING, FAILED
```

Rules encoded as tests: no auto-approval, no auto-promotion after goal reached,
material post-approval edits require re-review, invalid transitions raise a typed error.

Contribution rules: `total = amount + fee` with `fee = round(amount × 0.03)`;
`estimatedImpressions = 100 × (amount − fee)`; raised funds increase **only** on
`SUCCESS` and **only once** keyed by idempotency/reference ID; pending/failed/
cancelled/rejected never mutate `fundingRaised`.

## 6. Critical user journeys

1. **Guest browse**: launch → Home → Explore → search/filter/sort → campaign detail
   (story, sources, use of funds, estimates labelled) — no login anywhere.
2. **Create**: Create tab → 5 steps in order → autosave visible at each step →
   back preserves fields → Submit preview + goal + policy checkbox →
   `SUBMITTED_FOR_REVIEW` timeline.
3. **Contribute**: detail → Back this campaign → amount (live fee/impressions) →
   review with disclaimer → demo checkout (outcome selectable in labelled demo control)
   → receipt + updated progress (once) → follow/share.
4. **Track**: Activity events → Profile (private payment history, saved/followed) →
   Creator dashboard filters → status detail → distribution report.
5. **Demo review**: secondary `demo-reviewer` route approves/requests changes —
   clearly labelled simulated.

## 7. Test plan

- **Unit (shared)**: fee/impression math edge cases (0, 1, tiny, large INR, rounding),
  lifecycle transition matrix (legal + illegal), zod schemas, idempotency logic.
- **Unit (mobile)**: draft autosave/resume reducers, search/filter/sort functions,
  wizard validation per step.
- **API integration (Phase 6)**: list/detail, draft create/patch/submit, contribution
  outcomes + duplicate completion, transition enforcement, error envelope shape.
- **Tooling**: `tsc --noEmit` (strict), ESLint, Vitest (shared + mobile + api).
  Run per phase; record actual output in the phase report — never claim unrun tests.
- **Manual QA gate**: `docs/acceptance-checklist.md` (18 spec acceptance items +
  repo checklist) executed before recording the demo video.

## 8. Android APK build plan

1. Dev loop: `npx expo start` (Expo Go) — primary verification, no credentials needed.
2. Release APK via EAS (works without local Android SDK, which is **absent here**):
   - `eas.json` profile `preview` with `"android": { "buildType": "apk" }`
   - `npx eas-cli build -p android --profile preview`
   - Requires an Expo account + network on first build; exact failure reported
     honestly if unavailable.
3. Fallback if EAS is blocked: local Gradle build using installed JDK 17 after
   installing Android SDK (requires your approval before installing anything).
4. Never claim an APK exists unless the build succeeded.

## 9. Risks & fallbacks for a working Android demo

| Risk | Impact | Fallback |
|---|---|---|
| No Android SDK/adb installed | Local device build impossible | Expo Go for dev; EAS cloud APK; SDK install only with your approval |
| EAS build needs Expo account/network | No APK | Document exact command + blocker; keep app demo-ready in Expo Go |
| Remote image URLs fail offline | Broken layout | Bundle local assets in `assets/`; `ImageWithFallback` with neutral placeholder |
| Backend unavailable in demo room | Data loss | Demo Mode default; API optional; local repository persists on-device |
| AI/voice/payment/ad credentials absent | Missing features | Manual/demo fallbacks labelled explicitly (spec §2, rule 12) |
| npm registry/network flakiness | Install failures | npm cache retry; lockfile committed |
| Windows path/encoding issues | Tooling quirks | Use npm workspaces, forward-slash imports, verify on every phase |

## 10. Exact commands to run

```bash
# from C:\Projects\campaignApp
git init                      # repo is not yet under version control (recommended first)
npm create expo@latest apps/mobile -- --template blank-typescript   # done by me in Phase 1
npx expo start                # dev server / Expo Go (Phase 1+)
npx tsc --noEmit              # typecheck
npx expo lint                 # lint (configured in Phase 1)
npx vitest run                # unit tests (from Phase 1 onward)
docker compose up -d db       # Phase 6 only: PostgreSQL
npx eas-cli build -p android --profile preview   # Phase 7: APK
```

## 11. Next implementation prompt

Paste this as the second prompt:

> Phase 1 — Foundation and navigation.
> Read `README_IMPLEMENTATION.md` and `docs/implementation-plan.md`, then implement only
> the foundation exactly as Phase 1 of `OPENCODE_PHASE_PROMPTS.md` describes: Expo +
> React Native + TypeScript structure, theme tokens, reusable layout/state primitives,
> the five persistent bottom destinations (Home, Explore, Create, Activity, Profile),
> safe areas / Android back / keyboard-safe forms, seeded demo domain types plus the
> repository/service abstraction with a clearly labelled offline Demo Mode.
> Do not build detailed screen UIs yet. Verify Expo starts and all five tabs navigate,
> run typecheck/lint/tests, and report changed files with exact command output.
