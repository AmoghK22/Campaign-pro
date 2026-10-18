# OpenCode implementation prompts — use one phase at a time

Paste one prompt, wait for completion, inspect the report, run the suggested checks, then continue. Do not paste all phases at once.

---

## Phase 1 — Foundation and navigation

Read `README_IMPLEMENTATION.md` and `implementation-plan.md`. Implement only the foundation:
- Expo + React Native + TypeScript app structure, navigation, theme tokens, reusable layout primitives.
- Five persistent bottom destinations: Home, Explore, Create, Activity, Profile.
- Safe areas, Android back behavior, keyboard-safe forms, reusable loading/empty/error states.
- Seeded demo campaign domain types and repository/service abstraction.
- Clearly labelled offline Demo Mode that works without credentials.
- Add a simple launch screen/onboarding explanation only if it does not interrupt the five-step creation flow or block browsing.
Do not build every screen's detailed UI yet. Verify Expo starts and all five tabs navigate. Run typecheck/lint/tests available. Report changed files and exact test results.

## Phase 2 — Home, Explore, and campaign detail

Implement polished Home, Explore, and campaign detail:
- Premium editorial visual system; warm neutral background, forest-green primary, readable typography, restrained cards, consistent spacing.
- Seed at least 8 believable demo campaigns across different categories and creator types. Keep figures consistent in every screen and mark demo metrics.
- Search, categories, sort, filters, clear filters, empty/no-results/error states must actually work.
- Campaign detail: story sections, source title/URL links, captions/credits, funding progress, estimate explanation, share action, expandable use-of-funds/refund policy, audience/distribution, review transparency, feedback choices.
- Include explicit language that contributions pay for message amplification, not direct cause support.
- No unsupported verification claims. No dead buttons.
Test filters/search and navigation. Report results before moving on.

## Phase 3 — Five-step creation wizard and draft persistence

Implement exactly five steps in order:
1. Basics
2. Story
3. Campaign & Ad Visuals
4. Reach
5. Submit

Requirements:
- Persistent visible five-step progress indicator.
- Autosave with debounce and visible saving/saved/error status.
- Draft survives tab navigation and app restart.
- Draft list/resume/edit.
- Preserve fields when going back.
- Validate required fields and character limit (title max 60).
- Story sections can be added, removed, reordered; source title and valid URL; image captions/credits.
- Keep editorial story separate from ad assets/headline/description/CTA.
- Step 4 location, audience, channels, budget allocation, duration, preview; estimates labelled as estimates.
- Step 5 complete preview and creator-entered funding goal. Require policy confirmation.
- Preview Campaign, Save as Draft, Submit for Review actions must work.
- Submission changes state to SUBMITTED_FOR_REVIEW and shows a status timeline; do not auto-approve.
- AI/voice may be omitted for now, but provide a useful manual fallback and do not pretend an unavailable service is working.
Test required-field validation, back/forward persistence, app restart persistence, and submission state.

## Phase 4 — Contribution and receipt

Implement the complete contribution journey:
- Campaign detail → preset/custom amount → review → simulated checkout → result/receipt → track campaign.
- Centralize demo assumptions in one config module: 3% illustrative fee and 100 estimated impressions per ₹1 of net amplification budget. Label both as demo assumptions, not real fees or guaranteed results.
- Show amount, fee, total, net ad budget, estimated impressions, current funding progress, refund/unspent-fund explanation.
- Clearly say "Demo payment — no real money will be charged."
- Implement success, pending, rejected, cancelled, failed outcomes. Make outcome selection available in a clearly labelled demo-only test control if needed.
- Only successful payment updates raised funds. Apply exactly once with an idempotency/reference ID. Pending/failed/cancelled/rejected must not increase raised funds.
- Success includes receipt/reference, campaign, amount, updated progress, share, follow.
- Backer names private by default; payment history private in Profile.
Test every outcome and duplicate completion.

## Phase 5 — Activity, Profile, creator dashboard, and reports

Implement:
- Activity center with meaningful seeded/generated events, read/unread state, notification preferences.
- Profile: demo identity, created/backed/saved/followed campaigns, payment history, help/settings.
- Creator dashboard filters: Drafts, Under Review, Published/Funding, Promoting, Completed, Requires Action.
- Campaign management: edit draft, preview, share, view moderation feedback, campaign updates, milestones, report.
- Report separates amount raised, fees, budget allocated/spent, impressions, estimated reach, measured reach/clicks when available, duration, and metric notes. Unknown measured metrics must show "Not available" rather than invented values.
- Lifecycle transitions must be centralized and validated. Funding goal reached never directly transitions to Promoting.
- If including a reviewer simulation, put it in a secondary demo-only route, not the bottom tabs. Clearly label simulated decisions.
Test lifecycle transitions, report metric labels, and activity consistency.

## Phase 6 — Backend and persistence integration

Inspect what exists and integrate a maintainable backend:
- Node + TypeScript + Express + PostgreSQL + Prisma unless the repository already has a sensible equivalent.
- Implement documented REST endpoints, Zod validation, consistent error responses, state transition validation, and idempotent simulated contribution completion.
- Add migrations, seed data, health endpoint, API tests, `.env.example`, and Docker Compose.
- Keep the mobile repository/service abstraction so Demo Mode still works if the API is offline or unconfigured.
- Never put server secrets in the mobile app. No real payment integration.
- Add API tests for campaign list/detail, draft create/update/submit, contribution outcomes/idempotency, and lifecycle constraints.
- If the time/environment makes full API integration risky, do not break the demo app: clearly report what is complete and keep the local demo repository functional.
Run migrations/seeds/tests and report actual output.

## Phase 7 — Polish, audit, and Android APK

Act as a strict hackathon judge and QA lead. Do not add large new features. Audit and fix:
- Broken navigation/back behavior, keyboard overlap, clipped content, inconsistent safe areas, missing image fallbacks.
- Buttons with no real action, silent failures, invalid forms with unclear errors.
- Any inconsistent funding totals, stale campaign state, duplicate contribution effects, or estimates shown as guarantees.
- Loading, empty, no-results, error, pending, failed, and success states.
- Contrast, tap target sizes, typography, scrolling, Android device sizing.
- Verify the exact five creation steps and all critical journeys in the acceptance checklist.
- Run formatting, lint, typecheck, unit tests, API tests, and production/build checks available.
- Set up EAS Android APK profile and write exact build commands. If credentials/network/tooling are unavailable, explain the blocker honestly and provide the next command to run.
- Create `docs/demo-script.md` for a 3–5 minute walkthrough.
Do not claim tests or builds passed unless you ran them. End with a clear PASS/FAIL checklist and known limitations.
