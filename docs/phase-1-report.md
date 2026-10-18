# Phase 1 report — Foundation and navigation

Date: 2026-10-18
Scope: Phase 1 only. No campaign screens, wizard, checkout, or backend were built.

## Environment

| Tool | Result |
|---|---|
| Node | v22.17.0 |
| npm | 10.9.2 (workspaces root; `legacy-peer-deps=true` in `.npmrc`) |
| Expo SDK | 58 (expo ~58.0.14, react 19.3.0, react-native 0.88.0) |
| Git | repo initialized at `C:\Projects\campaignApp` (was not a repo) |
| Android SDK / adb / emulator | **not installed** |
| Java | OpenJDK 17.0.16 |

## Architecture delivered

- npm workspaces monorepo: `apps/mobile` (Expo Router), `packages/shared` (domain), `apps/api` deferred to Phase 6.
- `@campaign/shared` holds domain types, the centralized lifecycle state machine, demo fee/reach math,
  and the pure campaign filter/sort. Consumed by the mobile app via a tsconfig path + Metro `watchFolders`.
- Mobile data access goes through a `CampaignRepository` interface; the only implementation is the
  on-device `LocalCampaignRepository` (seeded campaigns + AsyncStorage drafts). Demo Mode is automatic
  when `EXPO_PUBLIC_API_BASE_URL` is empty.
- Expo Router with a persistent `(tabs)` group; secondary `campaign/[id]` route uses contextual back
  navigation without a competing tab bar.
- Zustand stores: `useAppStore` (persisted guest key, notification pref) and `useCampaignsStore` (load
  campaigns + drafts, with loading/ready/error status).

## Files created

Root
- `package.json`, `.gitignore`, `.npmrc`

`packages/shared/`
- `package.json`, `tsconfig.json`
- `src/types.ts`, `src/lifecycle.ts`, `src/demoConfig.ts`, `src/campaignFilters.ts`, `src/id.ts`,
  `src/format.ts`, `src/index.ts`
- `src/__tests__/lifecycle.test.ts`, `src/__tests__/demoConfig.test.ts`, `src/__tests__/campaignFilters.test.ts`

`apps/mobile/`
- `package.json`, `app.json`, `tsconfig.json`, `eslint.config.js`, `metro.config.js`
- `app/_layout.tsx`, `app/+not-found.tsx`
- `app/(tabs)/_layout.tsx`, `app/(tabs)/index.tsx` (Home), `explore.tsx`, `create.tsx`, `activity.tsx`, `profile.tsx`
- `app/campaign/[id].tsx`
- `src/theme/tokens.ts`, `src/theme/index.ts`
- `src/components/`: `AppText`, `Button`, `Card`, `Chip`, `DemoBadge`, `EmptyState`, `ErrorState`,
  `ImageWithFallback`, `Input`, `LoadingState`, `ProgressBar`, `ScreenContainer`, `StatusPill`, `index`
- `src/features/campaigns/CampaignCard.tsx`
- `src/services/`: `demoMode.ts`, `seed.ts` (3 coherent demo campaigns), `repository.ts`,
  `localRepository.ts`, `index.ts`
- `src/store/`: `useAppStore.ts`, `useCampaignsStore.ts`, `index.ts`
- Removed template files `App.tsx` and `index.ts` (replaced by `expo-router/entry`).

Docs
- `docs/implementation-plan.md`, `docs/acceptance-checklist.md` (updated for Phase 1), `docs/phase-1-report.md`

## Commands executed (actual results)

Install
```
npx create-expo-app@latest apps/mobile --template blank-typescript   # Expo SDK 58 scaffold
npx expo install expo-router react-native-safe-area-context react-native-screens \
  expo-linking expo-constants @react-native-async-storage/async-storage expo-image @expo/vector-icons
npm install react-dom@19.3.0 zustand zod
npm install -D eslint eslint-config-expo vitest
npm install                        # root workspaces (clean, ~775 packages)
```

Typecheck / lint / tests (final tree)
```
> mobile@1.0.0 typecheck
> tsc --noEmit                     # PASS (0 errors)
> @campaign/shared@1.0.0 typecheck
> tsc --noEmit                     # PASS (0 errors)

> mobile@1.0.0 lint
> eslint .                         # PASS (0 problems)

> @campaign/shared@1.0.0 test
> vitest run
  ✓ src/__tests__/campaignFilters.test.ts (10 tests)
  ✓ src/__tests__/lifecycle.test.ts (9 tests)
  ✓ src/__tests__/demoConfig.test.ts (8 tests)
  Test Files 3 passed (3) · Tests 27 passed (27)

> mobile@1.0.0 test
> vitest run --passWithNoTests     # no RN-free tests yet; exits 0
```

Android bundle verification (no device available)
```
npx expo install --check
  Dependencies are up to date

npx expo export --platform android --output-dir dist
  android bundles (1): _expo/static/js/android/entry-*.hbc (3 MB)   # PASS

npx expo start --port 8090
  Metro Bundler started
  Android Bundled 33050ms node_modules/expo-router/entry.js (1440 modules)
  GET / with expo-platform: android -> 200, manifest contains launchAsset  # PASS
  stderr: (empty)
```
Port 8081 on this machine is occupied by an unrelated `java.exe`, so verification used port 8090.

## What was verified vs. not verified

Verified:
- TypeScript, ESLint, and 27 unit tests pass.
- The complete Android app bundles without errors (production export + dev-server Android bundle).
- The dev server serves a valid Android manifest (HTTP 200).
- Demo Mode activates with no backend credentials and seeds 3 campaigns; drafts persist via AsyncStorage.
- Lifecycle math: illegal transitions throw; `FUNDING_GOAL_REACHED -> PROMOTING` is blocked;
  `SUBMITTED_FOR_REVIEW` cannot auto-approve.
- Demo math: 3% fee, 100 est. impressions per ₹1 net, edge cases covered.

NOT verified (environment limit, stated honestly):
- No tap-through of the five tabs on a real device/emulator (no Android SDK/device here).
- No physical safe-area/keyboard/back-button behavior check on hardware.
- No APK built yet (Phase 7; EAS requires an Expo account and network).

## Remaining issues / notes

1. **npm workspaces reify bug (npm 10.9.2):** adding a package when `node_modules` already exists can
   throw `Invalid Version:` / `Cannot read properties of null (reading 'edgesOut')`. Workaround already
   in repo: delete `node_modules` + `package-lock.json` and run `npm install` (`.npmrc` has
   `legacy-peer-deps=true`). This is an npm/arborist defect, not an app defect.
2. Template extras `.claude/` and `AGENTS.md` remain inside `apps/mobile` (from `create-expo-app`); left
   untouched.
3. Mobile has no RN-free unit tests yet, so its `test` script uses `--passWithNoTests`. Component tests
   are deferred (RN render tests are low-value for the hackathon timeline).

## How to launch the app yourself

```
# from C:\Projects\campaignApp
npm install                     # if node_modules is missing
npm run mobile                  # = npx expo start (interactive, default port 8081)

# open the project in Expo Go on an Android phone (same Wi-Fi), or:
npm run android -w mobile       # requires an emulator/device; not present on this machine
```
Demo Mode needs no env vars. To point at a future API: `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:4000`.

## Phase 1 acceptance status

| Criterion | Status |
|---|---|
| Expo + RN + TS app structure, planned layout | PASS |
| Five persistent tabs defined and bundling | PASS (code); device tap-through NOT verified |
| Reusable design system + loading/empty/error states | PASS |
| Shared domain types + lifecycle + repository abstraction | PASS (tested) |
| Local persistence for drafts/future state | PASS (AsyncStorage + persisted store) |
| Demo Mode clearly labelled, no credentials needed | PASS |
| Safe areas / Android back / keyboard handling | Implemented; device check pending |
| Git initialized, no useful files overwritten | PASS |
| Typecheck / lint / tests | PASS |

Overall: **Phase 1 complete pending on-device visual check.** Stop here for review before Phase 2.

## Dependency fixes (post-Phase-1)

Two dependency problems were reported after the first launch and fixed.

### Issue 1 — `npm install` crashed with `TypeError: Invalid Version:`

**Root cause (evidence, not a guess):**
- npm debug log showed the throw inside arborist:
  `Node.canDedupe -> semver.gte(other.version, this.version) -> new SemVer('')`.
- `package-lock.json` contained a **version-less non-link entry**:
  `"apps/mobile/node_modules/expo-image": {}`. A scan of the v3 lockfile found exactly this one bad
  entry out of 840.
- That stub existed because a stale folder `apps/mobile/node_modules/expo-image/` (containing only
  `prebuilds/`, **no `package.json`**) was left on disk. `Remove-Item` had silently failed to delete
  it in an earlier clean, so npm recorded the untracked folder as an empty `{}` stub.
- On the next `npm install`, dedupe compared the empty version and crashed. This matches the known
  npm/arborist class of bugs where a version-less lockfile node breaks dedupe.

**Fix:** force-removed the stray `apps/mobile/node_modules` (`cmd /c rmdir /s /q`), deleted
`package-lock.json`, and regenerated it with a clean `npm install`. Verified with
`npm run check:lockfile` (0 version-less entries) and by running `npm install` twice more (exit 0).

**Prevention:** added `scripts/check-lockfile.cjs` + `npm run check:lockfile`, which fails fast if any
non-link lockfile entry lacks a `version`.

### Issue 2 — web bundling failed: `Unable to resolve "react-native-web/dist/index"`

**Root cause:** `expo-router`'s web renderer requires `react-native-web`, which was never installed
(the project was only exercised on Android in Phase 1). `app.json` already declared web support, so
the web target was configured but its peer dependency was missing.

**Fix:** `npx expo install react-native-web` -> `react-native-web@^0.21.4` (Expo SDK 58 compatible;
`react-dom` was already aligned at `19.3.0` with `react 19.3.0`).

### Files changed
- `package-lock.json` — regenerated clean (797 entries, 0 version-less stubs)
- `apps/mobile/package.json` — added `react-native-web@^0.21.4`
- `package.json` — added `check:lockfile` script
- `scripts/check-lockfile.cjs` — new guard
- `.gitignore` — added `dist-web/`
- Removed stale folder `apps/mobile/node_modules/expo-image/`

### Commands run and results (all executed)
```
npm install                        # clean regenerate            -> exit 0
npm run check:lockfile             # 797 entries, 0 bad stubs    -> exit 0
npm install                        # re-run #2 (was failing)     -> exit 0
npx expo install --check           # "Dependencies are up to date"
npx expo install react-native-web  # added 18 packages           -> exit 0
npm run typecheck                  # both workspaces             -> 0 errors
npm run lint                       #                             -> 0 problems
npm run test                       # shared 27/27 pass; mobile passWithNoTests
npx expo export --platform android  # 3 MB Hermes bundle         -> exit 0
npx expo export --platform web     # entry 1.1 MB + routes        -> exit 0
npx expo start (CI) + fetch        # web bundle HTTP 200 (1011 modules), android HTTP 200 (1440 modules)
```

Versions confirmed compatible: expo ~58.0.14 · react 19.3.0 · react-dom 19.3.0 ·
react-native 0.88.0 · react-native-web ^0.21.4 · expo-router ~58.0.23.

Backups of the pre-fix lockfile/configs are in
`%TEMP%\opencode\campaignApp-deps-backup\` (root-package.json, mobile-package.json,
mobile-app.json, shared-package.json, package-lock.json, npmrc).
