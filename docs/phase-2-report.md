# Phase 2 report — Discovery (Home, Explore, campaign detail)

Date: 2026-10-18
Scope: **Phase 2 only.** No creation wizard, checkout, lifecycle transitions, backend, or review
simulation were built. Phases 3–7 remain untouched.

## Environment

| Tool | Result |
|---|---|
| Node | v22.17.0 |
| npm | 10.9.2 (workspaces root; `legacy-peer-deps=true` in `.npmrc`) |
| Expo SDK | 58 (expo ~58.0.14, react 19.3.0, react-native 0.88.0, expo-router ~58.0.23) |
| Vite / Vitest | vite 8.3.4 / vitest 4.1.12 (mobile test runner) |
| Android SDK / adb / emulator | **not installed** |
| Port 8081 | occupied by an unrelated `java.exe`; use 8090+ for the dev server |

## What Phase 2 delivered

### Screens
- **Home** (`app/(tabs)/index.tsx`): demo banner, hero, "how it works", featured campaign, recommended
  list, recently added list, and loading/empty/error states. CTAs route to Explore and Create.
- **Explore** (`app/(tabs)/explore.tsx`): working search box (title, summary, creator, category), category
  chips, sort selector (Recommended / Recently added / Most funded / Ending soon), Clear filters, and a
  no-results state with a recovery action.
- **Campaign detail** (`app/campaign/[id]/index.tsx`): cover image, funding progress, story sections with
  captions/credits, bundled+remote image fallback, ad creative (headline/description/CTA/audience),
  expandable "use of funds" (fees, ad allocation, contingency, refund policy), reach assumptions,
  impressions-vs-unique-reach explanation, source links (validated with `isValidHttpUrl`), persisted
  feedback prompt, Share, and a status-aware CTA.
- **Contribute placeholder** (`app/campaign/[id]/contribute.tsx`): honest, clearly-labelled Phase-4
  placeholder. It performs **no payment** and mutates no funds. The primary CTA only appears when
  funding is open (`isFundingOpen`); otherwise an honest "funding closed" card plus a working Share is
  shown. The old `app/campaign/[id].tsx` was replaced by the folder route.

### Data, domain, and assets
- Seed data (`src/services/seed.ts`) now has **9 varied demo campaigns** with realistic statuses
  (FUNDING ×6, FUNDING_GOAL_REACHED, PROMOTING, COMPLETED). `seed-river-wardens` is featured. Every
  campaign has 2 story sections with captions/credits, sources with `https://example.org/...` URLs,
  channels, allocation, and Jul–Oct 2026 dates.
- Shared (`packages/shared/src`): added `StoryImage.imageKey`, `AdAssets.adImageKey`,
  `Campaign.coverImageKey`, `Campaign.featured`; `DEMO_REFUND_POLICY`; `DEMO_ASSUMPTION_NOTES.reach` /
  `.allocation`; `calculateUseOfFunds(amount, allocation)` (fees/allocation/contingency/impressions
  reconcile exactly to the gross amount); `isFundingOpen(status)`; `formatDate`.
- Bundled artwork: `scripts/generate-campaign-assets.cjs` deterministically generates **27 PNGs
  (2,549 KB)** — 9 covers (900×560), 9 ad creatives (1280×720), 9 story images (900×560) — into
  `apps/mobile/assets/campaigns/`. Campaigns reference images by **string key** (e.g.
  `cover-river-wardens`) resolved through `src/assets/campaignImages.ts`; no external image URLs are
  required to render.
- Repository/store: `repository.ts` + `localRepository.ts` gained `saveFeedback`/`listFeedback`
  (AsyncStorage key `campaignamp.feedback.v1`). `useCampaignsStore` loads **all** campaigns once;
  screens filter locally, so search does not refetch per keystroke.

## Files created / changed (Phase 2)

`packages/shared/src/`
- `types.ts`, `demoConfig.ts`, `lifecycle.ts`, `format.ts`, `index.ts`
- `__tests__/demoConfig.test.ts`, `__tests__/lifecycle.test.ts` (extended)

`apps/mobile/`
- `vitest.config.mts` (new mobile test config)
- `src/__tests__/discovery.test.ts` (new, 11 tests)
- `src/assets/campaignImages.ts`, `src/types/assets.d.ts`
- `src/features/campaigns/`: `CampaignImage.tsx`, `FeaturedCampaign.tsx`, `selectors.ts`,
  `CampaignCard.tsx`
- `src/components/`: `ImageWithFallback.tsx`, `SectionHeader.tsx`, `index.ts`
- `src/services/`: `seed.ts`, `repository.ts`, `localRepository.ts`, `index.ts`, `demoMode.ts`
- `src/store/useCampaignsStore.ts`
- `app/(tabs)/index.tsx`, `app/(tabs)/explore.tsx`, `app/campaign/[id]/index.tsx`,
  `app/campaign/[id]/contribute.tsx` (deleted `app/campaign/[id].tsx`)
- `tsconfig.json` (extends `expo/tsconfig.base.json`; added `@app/*` path), `eslint.config.js`
  (ignore `dist/**`, `dist-web/**`)

Root
- `scripts/generate-campaign-assets.cjs`
- `apps/mobile/assets/campaigns/` — 27 generated PNGs

## Commands executed (actual results)

```
npm run typecheck        # @campaign/shared tsc --noEmit + mobile tsc --noEmit  -> 0 errors
npm run lint             # mobile eslint .                                      -> 0 problems
npm run test             # @campaign/shared vitest: 3 files, 33 tests passed
                         # mobile vitest:           1 file,  11 tests passed
npx expo export --platform android --output-dir dist   # Hermes bundle 3 MB (exit 0)
npx expo export --platform web     --output-dir dist-web  # entry 1.1 MB + route chunks (exit 0)
node scripts/generate-campaign-assets.cjs              # 27 PNGs (2,549 KB)
```

Mobile test suite (from `apps/mobile`):
```
> mobile@1.0.0 test
> vitest run --passWithNoTests
  ✓ src/__tests__/discovery.test.ts (11 tests)
  Test Files 1 passed (1) · Tests 11 passed (11)
```

## What was verified vs. not verified

Verified (automated evidence):
- TypeScript, ESLint, and all unit tests pass: **33 shared + 11 mobile = 44**.
- The 9 seeded campaigns are internally consistent: unique IDs, valid statuses, resolvable image keys,
  and non-empty story/creative/allocation data (discovery test).
- Discovery logic actually changes results: search matches title/summary/creator/category, category
  filtering, and all four sort orders return the expected sets/ordering; an impossible query returns an
  empty list (discovery test + shared `campaignFilters` tests).
- Home selection logic (`selectFeatured` / `selectRecommended` / `selectRecentlyAdded`) returns the
  expected campaigns from the seed (discovery test).
- Fund math reconciles exactly to the gross amount (shared `demoConfig` tests).
- The full Android app bundles (3 MB Hermes) and the web export succeeds, including the new
  `explore` and `contribute` route chunks.

NOT verified (environment limit, stated honestly):
- No tap-through of Home/Explore/detail on a real device or emulator (no Android SDK/device here).
- No on-hardware check of safe areas, keyboard handling, hardware back, or `Share` sheet behavior.
- Reach figures are demo estimates; they are labelled as estimates in the UI but were not compared
  against any real delivery data.

## Remaining issues / notes

1. **Mobile Vitest + Vite/oxc tsconfig resolution.** The mobile test runner initially failed with
   `[TSCONFIG_ERROR] Failed to load tsconfig 'expo/tsconfig.base'` from plugin `vite:oxc`. `tsc` resolves
   `expo/tsconfig.base` fine, but the Vite 8 transform did not. Fixed by extending the concrete file
   (`"extends": "expo/tsconfig.base.json"`) rather than the extensionless package specifier.
2. **Relative imports under Vitest.** Vitest/Vite 8 would not resolve extensionless **relative** imports
   from the test file (`Cannot find module '../../services/seed'`), while configured **aliases**
   resolved correctly. Fixed by adding an `@app/*` alias to `vitest.config.mts` + `tsconfig.json` paths
   and importing via `@app/...` in the test. App code is unaffected (it is bundled by Metro, not Vite).
3. **Lint scanned export output.** After an export, `eslint .` linted `dist/` / `dist-web/`. Fixed by
   ignoring `dist/**` and `dist-web/**` in `apps/mobile/eslint.config.js` (both are also gitignored).
4. Contribute route is an intentional, clearly-labelled Phase-4 placeholder — not a dead button.
5. Device verification remains the open gate for Phases 1 and 2; APK build is Phase 7.

## How to launch the app yourself

```
# from C:\Projects\campaignApp
npm install                     # if node_modules is missing
npm run mobile                  # = npx expo start (interactive; 8081 is busy here, use --port 8090)

# regenerate bundled artwork if needed
node scripts/generate-campaign-assets.cjs
```
Demo Mode needs no env vars. To point at a future API: `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:4000`.

## Phase 2 acceptance status

| Criterion | Status |
|---|---|
| Home explains the platform; CTA to Explore / Start a campaign | PASS (code + bundles); device visual NOT verified |
| Home shows reach-per-dollar with demo/estimate label | PASS (labelled); device visual NOT verified |
| Browse works without account creation | PASS (Demo Mode, no credentials) |
| Search changes results (title/summary/creator/category) | PASS (tested) |
| Category + sorting change results; Clear filters works | PASS (logic tested); button tap NOT device-verified |
| Loading / error / empty / no-results states + recovery | PASS (code); device states NOT verified |
| Detail shows story, captions/credits, source links | PASS (code); device visual NOT verified |
| Use of funds expandable before contribution | PASS (code); device visual NOT verified |
| Contribution framed as amplification, not the cause | PASS (copy + placeholder); NOT device-verified |
| Impressions vs unique reach never interchangeable | PASS (copy); device visual NOT verified |
| Feedback prompt persists | PASS (AsyncStorage repo); NOT device-verified |
| No unsupported verification claims; no dead buttons | PASS (code audit); NOT device-verified |

Overall: **Phase 2 complete pending on-device visual check.** Stop here for review before Phase 3.
