# Campaign-pro — Campaign Amplification Platform

An Expo (React Native) + TypeScript monorepo for the **Campaign Amplification** product: people create a
campaign about a message they believe should reach more people, the message is reviewed, and backers fund
the **distribution** of that message (not the cause directly).

This repository is set up so it can be cloned and continued immediately with [opencode](https://opencode.ai).

## Status

Phases 1–3 of the implementation plan are complete and verified (typecheck, lint, unit tests, Android +
web production exports):

- **Phase 1 — Foundation**: Expo Router five-tab shell, shared domain types, centralized lifecycle state
  machine, Demo Mode, demo math.
- **Phase 2 — Discovery**: Home, Explore (search / category / sort), campaign detail, honest Phase-4
  contribution placeholder.
- **Phase 3 — Creation**: manual create, honest voice/text fallback, the five-step wizard
  (Basics → Story → Campaign & Ad Visuals → Reach → Submit), autosaving drafts, and submission to
  `SUBMITTED_FOR_REVIEW` (never auto-approved or advertised).

Phases 4–7 (contributions, lifecycle/activity/dashboard/reports, optional backend, final gate) are not
built yet.

> **Honesty note:** everything runs in **Demo Mode** on the device. There is no real payment, no real ad
> delivery, no speech recognition, no device gallery/AI image generation, and no backend. Figures are
> labelled as demo estimates.

## Requirements

- **Node.js 22+** and **npm 10+** (workspaces). `git`.
- To run on a phone: the **Expo Go** app, or a development build. No Android SDK is required just to run
  the JavaScript app with Expo Go.

## Getting started

```bash
npm install
npm run mobile        # = npx expo start  (then scan the QR with Expo Go)
```

If port `8081` is already in use:

```bash
npm run mobile -- --port 8090
```

Demo Mode needs **no environment variables**. To point the app at a future API, set
`EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:4000` before starting.

## Quality gates and builds

```bash
npm run typecheck     # tsc --noEmit for @campaign/shared and mobile
npm run lint          # eslint for the mobile app
npm run test          # vitest for @campaign/shared and mobile
npx expo export --platform android   # production Android (Hermes) bundle
npx expo export --platform web       # production web bundle
```

Regenerate the bundled demo artwork (only if needed):

```bash
node scripts/generate-campaign-assets.cjs
```

## Monorepo layout

```
apps/mobile/            Expo Router app (routes in app/, shared code in src/)
packages/shared/        @campaign/shared: domain types, lifecycle, filters, demo math (vitest)
scripts/                tooling (lockfile check, asset generation)
docs/                   all product/spec/phase documentation (see below)
```

## Documentation

All markdown documentation lives in [`docs/`](./docs):

- `README_IMPLEMENTATION.md` — the product contract / specification.
- `implementation-plan.md` — the build plan and phase breakdown.
- `OPENCODE_FIRST_PROMPT.md`, `OPENCODE_PHASE_PROMPTS.md` — opencode kickoff and per-phase prompts.
- `acceptance-checklist.md`, `ACCEPTANCE_CHECKLIST.md` — QA gates and acceptance criteria.
- `DEMO_VIDEO_SCRIPT.md` — 3–5 minute demo walkthrough script.
- `phase-1-report.md`, `phase-2-report.md`, `phase-3-report.md` — what each completed phase delivered,
  with the exact commands run and what was/was not verified.
- `ENV_EXAMPLE.txt` (repo root) — environment variable example (no secrets).

## Working with opencode

This repo includes `AGENTS.md` files that opencode reads automatically for project conventions
(the mobile app has its own at `apps/mobile/AGENTS.md`). Just open the repo and start opencode; the
per-phase prompts in `docs/OPENCODE_PHASE_PROMPTS.md` describe how each phase was scoped.
