# Phase 3 report — Creation (five-step wizard, drafts, submission)

Date: 2026-10-18
Scope: **Phase 3 only.** No contributions/checkout (Phase 4), no lifecycle console, activity, dashboard,
reports (Phase 5), no backend (Phase 6), no APK/reviewer simulation (Phase 7). Submission stops at
`SUBMITTED_FOR_REVIEW` — nothing is auto-approved or advertised.

## Environment

| Tool | Result |
|---|---|
| Node | v22.17.0 |
| npm | 10.9.2 (workspaces root; `legacy-peer-deps=true` in `.npmrc`) |
| Expo SDK | 58 (expo ~58.0.14, react 19.3.0, react-native 0.88.0, expo-router ~58.0.23) |
| Vite / Vitest | vite 8.3.4 / vitest 4.1.12 |
| Android SDK / adb / emulator | **not installed** |
| Port 8081 | occupied by an unrelated `java.exe`; use 8090+ |

## What Phase 3 delivered

### Create entry — `app/(tabs)/create.tsx`
- **Create manually**: makes a draft and opens step 1.
- **Create with your voice** → `app/creation/voice.tsx`: an honest **text-based guided fallback**.
  Speech recognition is *not* enabled in this build, and the screen says so; it only prepares an
  editable draft and never submits. A "Use an example" button prefills a demo pitch.
- **Drafts list**: title (or "Untitled"), last-saved date/time, the step to resume at and how many of
  the five steps are already valid, **Resume** (reopens at that step) and **Delete** (with a
  confirmation dialog). Empty and load-error states are handled.

### The five-step wizard — `app/creation/[draftId]/`
Routes: `basics` → `story` → `visuals` → `reach` → `submit`, plus `preview`.
Every step uses the same `WizardScaffold`: a persistent `StepIndicator` (1–5, done/current/muted),
an autosave status ("Saving… / Saved hh:mm"), a scrollable body, and a fixed Back/Continue footer.
- **Basics**: title (required, **max 60**, live counter), category chips, creator, summary, and the
  optional context fields (what it's about, who it should reach, why it matters, evidence).
- **Story**: story headline + intro; add/remove/**reorder** sections; add/remove **sources**
  (title + validated http(s) URL); optional bundled story images with caption/credit; statistics;
  suggested audience actions. Plain text only (the UI states there is no rich-text toolbar).
- **Campaign & Ad Visuals**: choose cover artwork (optional, "No cover") and the ad creative
  (required), ad headline (≤60, live counter), ad description, call-to-action chips, and a labelled
  in-feed **placement preview**. Story content and ad creative are kept strictly separate.
- **Reach**: locations, audience interests, distribution channels (with descriptions), duration
  (1–60 days), proposed distribution budget, and an ads/contingency allocation. Shows an
  estimate-labelled reach preview (fee, ad budget, contingency, estimated impressions).
- **Submit**: full read-only review; the **funding goal is entered here only** (never auto-filled);
  transparent use-of-funds for the goal; refund policy and amplification disclaimer; a required
  **policy confirmation** checkbox; a grouped "incomplete steps" panel with **Fix** jumps; and
  **Preview full campaign** / **Submit for review** actions.
- **Preview** (`preview.tsx`): renders the exact `CampaignPreview` the Submit step shows.

### Submission & lifecycle
- `submitDraft` builds a campaign in `DRAFT` and then applies the shared `applyTransition` to
  `SUBMITTED_FOR_REVIEW` with an audit `ReviewEvent` (actor `creator`). The code path cannot reach
  `APPROVED`/`PROMOTING`/`FUNDING`.
- `app/creation/submitted.tsx`: success + status pill, the **review timeline** from the repository,
  and an honest "what happens next". It force-refreshes the campaigns store so lists include it.

### Data, store, and persistence
- `useDraftsStore` (new): single owner of drafts with a **700 ms debounced autosave**, a visible
  `saveStatus` (idle/saving/saved/error), `flushActive` on navigation, and `submitActive`.
- Shared additions: `CampaignDraft.coverImageKey`, `.adImageKey`, `.distributionBudget`;
  `Campaign.storyHeadline?`; `collections.ts` (`upsertById`, `removeById`); `formatDateTime`.
- `DraftPersistence` (`campaignamp.drafts.v1`) and repository additions `saveCampaign` /
  `saveReviewEvent` / `listReviewEvents`. Local repository now merges **user campaigns**
  (`campaignamp.campaigns.v1`) with the read-only seed, and stores review events
  (`campaignamp.reviewevents.v1`). Campaign detail renders `storyHeadline` when present.

### Honesty boundaries (deliberately NOT built)
- No `expo-image-picker`, no device gallery upload, no AI image generation, no video upload, no
  speech recognition. Image selection is limited to **bundled demo artwork** and is labelled as such.

## Files created / changed (Phase 3)

`packages/shared/src/`
- `types.ts` (draft `coverImageKey`/`adImageKey`/`distributionBudget`, `Campaign.storyHeadline?`,
  `createEmptyDraft`), `collections.ts` (new), `format.ts` (`formatDateTime`), `index.ts`,
  `__tests__/collections.test.ts` (new, 4 tests)

`apps/mobile/`
- `src/store/useDraftsStore.ts` (new), `src/store/index.ts`
- `src/features/creation/`: `steps.ts`, `assets.ts`, `options.ts`, `draftOps.ts`, `validation.ts`,
  `submission.ts`, `draftPersistence.ts`, `useActiveDraft.ts`, `useStepController.ts`,
  `WizardScaffold.tsx`, `ImagePickerGrid.tsx`, `CampaignPreview.tsx`, `MissingDraft.tsx`
- `src/components/StepIndicator.tsx` (new), `src/components/index.ts`
- `src/services/storage.ts` (new), `src/services/repository.ts`, `src/services/localRepository.ts`
- `src/__tests__/creation.test.ts` (new, 19 tests)
- `app/(tabs)/create.tsx` (rewritten), `app/creation/voice.tsx`, `app/creation/submitted.tsx`,
  `app/creation/[draftId]/{basics,story,visuals,reach,submit,preview}.tsx`
- `app/campaign/[id]/index.tsx` (render `storyHeadline`)

## Commands executed (actual results)

```
npm run typecheck   # @campaign/shared tsc --noEmit + mobile tsc --noEmit  -> 0 errors
npm run lint        # mobile eslint .                                       -> 0 problems
npm run test        # @campaign/shared vitest: 4 files, 37 tests passed
                    # mobile vitest:           2 files, 30 tests passed
npx expo export --platform android   # Hermes bundle 3.2 MB, 1329 modules (exit 0)
npx expo export --platform web       # entry 1.1 MB + route chunks incl. basics/story/visuals/
                                     #   reach/submit/submitted/preview/voice/create (exit 0)
```

Mobile test suite (from `apps/mobile`):
```
> mobile@1.0.0 test
> vitest run --passWithNoTests
  ✓ src/__tests__/discovery.test.ts (11 tests)
  ✓ src/__tests__/creation.test.ts  (19 tests)
  Test Files 2 passed (2) · Tests 30 passed (30)
```

## What was verified vs. not verified

Verified (automated evidence):
- TypeScript, ESLint, and unit tests pass: **37 shared + 30 mobile = 67**.
- The wizard is exactly five steps in the required order; index/next/previous helpers clamp correctly.
- Every offered cover/ad/story image key resolves to a real bundled asset.
- Draft ops (add/edit/reorder/remove sections, sources, images, statistics; `toggleValue`) are
  immutable and bounded by test.
- Each step's validator accepts a fully valid draft and rejects the missing fields (title ≤60,
  category, creator, summary; story headline/intro/sections and valid source URLs; ad image/headline
  ≤60/description/CTA; locations/interests/channels/duration/budget; goal + policy at submit).
- `buildSubmission` produces a `user` campaign at `SUBMITTED_FOR_REVIEW` with `fundingRaised: 0`, a
  review event (`DRAFT → SUBMITTED_FOR_REVIEW`, actor `creator`), and never yields
  `APPROVED`/`PROMOTING`/`FUNDING`.
- The full Android app bundles (3.2 MB Hermes) and the web export succeeds, including every new
  creation route chunk.

NOT verified (environment limit, stated honestly):
- No tap-through of the wizard on a device/emulator (no Android SDK/device here). Autosave-across-
  restart, hardware back, safe areas, keyboard behavior, and the Start-via-draft flow are **implemented
  and typed but not device-verified**.
- Draft persistence across a real app restart was not exercised on hardware (logic is unit-tested, but
  AsyncStorage round-trip on-device is unverified).

## Remaining issues / notes

1. Image selection intentionally uses bundled demo artwork only — no gallery, AI, or video. Labelled in
   the UI and in this report.
2. "Create with your voice" is honestly a text fallback; no speech recognition exists in this build.
3. Drafts can be navigated via the step indicator; `Continue` still blocks on validation. Jumping ahead
   is allowed but never bypasses the submit-time validation.
4. Reviewer/curator actions and the contribution flow are out of scope here; the submitted screen links
   to the existing campaign page whose contribute button remains the labelled Phase-4 placeholder.
5. Device verification remains the open gate for Phases 1–3; APK build is Phase 7.

## How to launch the app yourself

```
# from C:\Projects\campaignApp
npm install            # if node_modules is missing
npm run mobile         # = npx expo start (8081 is busy here; use -- --port 8090)
```

Demo Mode needs no env vars. Create → fill the five steps → Submit for review. Everything is stored
on-device; no network is required.

## Phase 3 acceptance status

| Criterion | Status |
|---|---|
| Exactly five steps in order with persistent progress indicator | PASS (bundles + test) |
| Title required, ≤60 chars, live counter; other fields validate with errors | PASS (tested) |
| Story sections add/remove/reorder; sources need title + valid URL | PASS (tested) |
| Story content and ad creative kept separate | PASS (tested + code) |
| Reach step: locations, interests, channels, budget, duration, estimate label | PASS (tested); device visual NOT verified |
| Funding goal entered at Submit only; never auto-filled | PASS (tested) |
| Policy confirmation required before submission | PASS (tested) |
| Back navigation preserves every field | PASS (store owns draft; bundles); NOT device-verified |
| Draft autosaves (visible indicator) and survives app restart | PASS (code + debounce); on-device restart NOT verified |
| Draft list / resume works | PASS (code + bundles); NOT device-verified |
| Preview matches the data that would be submitted | PASS (shared `CampaignPreview`) |
| Submit → `SUBMITTED_FOR_REVIEW` with status timeline; no silent approval | PASS (tested) |

Overall: **Phase 3 complete pending on-device visual check.** Stop here for review before Phase 4.
