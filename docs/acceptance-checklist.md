# Acceptance checklist

QA gate derived from `README_IMPLEMENTATION.md` §12 and
`ACCEPTANCE_CHECKLIST.md`. Check items only after running them; record actual output.
Tick per phase — do not wait until the end.

## Phase 1 — Foundation
- [x] `npx tsc --noEmit` passes for both workspaces; ESLint passes; 27 shared unit tests pass.
      Actual output recorded in `docs/phase-1-report.md`.
- [x] Android **and web** production exports succeed, and the dev server bundles both platforms
      (`react-native-web` was added post-Phase-1 to fix web bundling).
- [x] Demo Mode is clearly labelled (DemoBadge + message) and requires no credentials
      (`EXPO_PUBLIC_API_BASE_URL` unset → on-device repository).
- [x] Campaign/status domain types, centralized lifecycle state machine, and demo math live in
      `@campaign/shared` with tests.
- [~] App bundles for Android: production export succeeds (3 MB Hermes bundle, 1440 modules) and
      the Expo dev server serves the Android manifest (HTTP 200).
      NOT device-verified — no Android SDK/emulator or physical device on this machine.
- [~] Five-tab navigation (Home, Explore, Create, Activity, Profile) is defined and bundles, but
      tapping through tabs was NOT verified on a device/emulator.
- [~] Safe areas, Android back behavior, and keyboard-safe forms are implemented
      (SafeAreaProvider/edge insets, KeyboardAvoidingView, expo-router back handling), but device
      behavior was NOT verified on hardware.

## Phase 2 — Discovery
Evidence: `docs/phase-2-report.md`. `[x]` = backed by a command/unit test; `[~]` = implemented and
bundled, but device/visual behavior NOT verified (no Android SDK/device on this machine).
- [~] Home explains the platform in one glance; CTA to Explore and Start a campaign. (code + bundles; device visual pending)
- [~] Reach estimate per dollar is shown with an explicit demo/estimate label. (math tested in shared; label not device-verified)
- [x] Browse works without account creation. (Demo Mode, no credentials; guest key; bundles)
- [x] Search changes results (title, summary, creator, category). (`discovery.test.ts`)
- [x] Category chips and sorting (Recommended / Recently added / Most funded / Ending soon) change results; Clear filters works. (logic tested via shared `campaignFilters` + `discovery.test.ts`; Clear tap not device-verified)
- [~] Loading, error, empty, and no-results states have a useful recovery action. (code; device states pending)
- [~] Campaign detail shows story sections, captions/credits, and visible source links. (code; device visual pending)
- [~] Use of funds (fees, ad allocation, unspent/refund) is expandable before contribution. (code; device visual pending)
- [~] Contribution is clearly described as funding message amplification, not the cause. (copy + labelled Phase-4 placeholder; device pending)
- [~] Impressions vs unique reach are never used interchangeably. (copy; device visual pending)
- [~] Feedback prompt ("creative encourage you?" / "change your mind?") persists. (AsyncStorage repo; not device-verified)
- [~] No unsupported verification claims. No dead buttons. (code audit; device pending)

## Phase 3 — Creation
Evidence: `docs/phase-3-report.md`. `[x]` = backed by a command/unit test; `[~]` = implemented and
bundled, but device/visual behavior NOT verified (no Android SDK/device on this machine).
- [x] Exactly five steps in order: Basics → Story → Campaign & Ad Visuals → Reach → Submit; persistent progress indicator. (`creation.test.ts`, `WIZARD_STEPS`)
- [x] Title required, max 60 chars, live counter; other required fields validate with actionable errors. (`creation.test.ts` validation cases)
- [x] Story sections add / remove / reorder; sources need title + valid URL. (`creation.test.ts` draftOps + validation)
- [x] Story content and ad creative (headline/description/CTA/visuals) are separate. (code; separate draft fields + preview; bundles)
- [~] Reach step: locations, interests, channels, budget, duration, audience preview; labelled as estimate. (logic tested; device visual pending)
- [x] Funding goal is entered at Submit only; never auto-filled by AI. (submit validator test; only `submit.tsx` writes `fundingGoal`)
- [x] Policy confirmation required before submission. (`creation.test.ts` validateSubmit)
- [~] Back navigation preserves every field. (single draft in `useDraftsStore`; bundles; device pending)
- [~] Draft autosaves (visible saving/saved indicator) and survives app restart. (700 ms debounce + `DraftPersistence`; on-device restart NOT verified)
- [~] Draft list / resume works. (code + bundles; device tap-through pending)
- [x] Preview matches the data that would be submitted. (Submit step and preview screen share `CampaignPreview`)
- [x] Submit → `SUBMITTED_FOR_REVIEW` with status timeline; no silent approval. (`creation.test.ts` buildSubmission + submitted screen)

## Phase 4 — Contributions
- [ ] Preset and custom amounts work; fee, total, net ad budget, estimated impressions update dynamically (3% / 100 imp per ₹1, centralized and labelled demo assumptions).
- [ ] Review shows amount, fees, total, estimated impressions, progress, refund terms, amplification disclaimer.
- [ ] Checkout is clearly labelled "Demo payment — no real money will be charged."
- [ ] Success, pending, rejected, cancelled, failed outcomes are all demonstrable and accurately represented.
- [ ] Only successful payment increases raised funds, exactly once (idempotency/reference ID tested).
- [ ] Pending/failed/cancelled/rejected do not increase funds.
- [ ] Receipt shows reference, amount, campaign, updated progress, share, follow.
- [ ] Payment history is private in Profile; backer name is private by default.

## Phase 5 — Lifecycle, activity, dashboard, reports
- [ ] Funding goal reached does **not** start advertising automatically (goes to distribution preparation).
- [ ] Illegal lifecycle transitions are blocked with a useful error; every transition has an audit record.
- [ ] Activity shows meaningful events from real demo actions; read state and preferences work; no duplicate low-value notifications.
- [ ] Creator dashboard filters: Drafts, Under Review, Published/Funding, Promoting, Completed, Requires Action — correct contents.
- [ ] Material edits after approval require re-review.
- [ ] Report distinguishes funds raised, fees, ad budget allocated/spent, impressions, estimated vs measured reach, clicks, duration, metric source.
- [ ] Unknown measured metrics show "Not available" — never fabricated.
- [ ] Reviewer simulation (if present) is a secondary, clearly labelled demo route — not in the five tabs.

## Phase 6 — Backend (if implemented)
- [ ] Docker Compose API + PostgreSQL starts; migrations and seed run.
- [ ] Spec endpoints implemented with Zod validation and `{ error: { code, message, details? } }` envelope.
- [ ] API tests for list/detail, draft submit, contribution idempotency, transitions pass (record output).
- [ ] Demo Mode still works with the API offline/unconfigured.
- [ ] No secrets in the mobile bundle; `.env.example` has no real credentials.

## Phase 7 — Final gate
- [ ] No dead primary buttons, silent failures, or fake success without state mutation.
- [ ] Loading / empty / no-results / error / pending / failed / success states exist for major flows.
- [ ] Contrast, ≥44–48 dp touch targets, typography, scrolling, small-screen layout checked on Android.
- [ ] Funding totals consistent across Home, Explore, Detail, Activity, Profile, Dashboard, checkout.
- [ ] No estimates presented as guarantees; simulation labelled honestly everywhere.
- [ ] `tsc --noEmit`, lint, unit + API tests pass (paste actual output).
- [ ] README with exact commands, ports, demo-mode behavior, tests, APK build command.
- [ ] APK: `npx eas-cli build -p android --profile preview` documented; claim success only if it actually built — otherwise state the blocker.
- [ ] `docs/demo-script.md` ready for the 3–5 minute walkthrough.
- [ ] No secrets committed.
