# Campaign Amplification — Implementation Specification

## 0. Mission

Build a polished, functional, mobile-first Android prototype for a community-funded message-amplification platform. This is a working product journey, not a static UI mockup.

**Winning principle:** prioritize a coherent, demonstrable end-to-end journey over shallow implementation of every optional feature.

## 1. Product rules that must never be violated

1. A contribution funds **distribution/amplification of a message**, not the cause, person, or organization mentioned in it. Show this clearly before payment and on campaign detail.
2. Campaigns must not be promoted before review approval and distribution setup are complete.
3. Reaching a funding goal does not automatically start advertising.
4. Reach is an estimate, never a guarantee. Label estimates and document the demo assumption.
5. Public backer identity is private by default. Keep transaction records accurate; do not expose payment details.
6. User-provided story and advertising assets are distinct.
7. Sources are visible on the public campaign detail page.
8. The campaign funding goal is set by the creator in Step 5. Never invent it with AI or silently overwrite it.
9. AI and voice input are optional helpers. The user must always be able to edit everything and continue manually.
10. Keep the exact five creation steps in this order: **Basics → Story → Campaign & Ad Visuals → Reach → Submit**. Do not insert setup screens between them.
11. Campaign data and states must remain consistent across Home, Explore, Detail, Activity, Profile, Creator Dashboard, and checkout.
12. Never imply real payment, real advertising delivery, or independently verified claims in a demo. Label simulated behavior.

## 2. Recommended stack

### Mobile
- React Native + Expo, TypeScript
- Expo Router for navigation
- Zustand for app state
- AsyncStorage for durable local demo state and draft recovery
- React Hook Form + Zod for forms and validation
- Expo Image Picker for image selection
- Expo Speech / platform speech APIs only if reliable; otherwise show an honest manual/demo fallback
- Expo Haptics only where supported and subtle
- Use accessible native controls and large touch targets

### Backend
- Node.js + TypeScript + Express
- PostgreSQL + Prisma
- Zod request validation
- REST API with consistent errors
- Seed data for demo campaigns
- Environment variables; never commit secrets

### Demo reliability
- The app must remain demonstrable when no backend credentials or network are available. Provide a clearly labelled **Demo Mode** that uses seeded data and persists local drafts/contributions on-device.
- When the API is configured, use it for durable shared state. Keep the API client behind a service/repository layer so screens do not care which data source is active.
- Do not block core demo journeys on AI, payment gateway, or advertising credentials.

## 3. Information architecture

Persistent bottom navigation, visible on primary destinations:
1. Home
2. Explore
3. Create
4. Activity
5. Profile

Secondary routes use contextual back navigation. Detail and creation subroutes should not create a second competing bottom bar.

Required secondary screens:
- Campaign detail
- Backing / contribution amount
- Contribution review
- Simulated checkout
- Payment result / receipt
- Creator dashboard and campaign status details
- Draft list / resume draft
- Notifications and notification preferences
- Distribution report
- How It Works, About, Partners, FAQs, Help, Contact, Terms, Privacy, Community Guidelines (can be concise in-app information pages)

## 4. Design system

Create reusable tokens, not one-off styles:
- Background: warm off-white
- Surface: white / subtle warm neutral
- Primary: deep forest green
- Text: near-black / deep charcoal
- Secondary text: muted slate
- Accent: restrained amber for caution / pending
- Error: accessible red
- Success: accessible green
- Radius: consistent 12–20 dp for cards; pill only for compact status/category chips
- Spacing scale: 4, 8, 12, 16, 20, 24, 32
- Touch targets: aim for at least 44–48 dp
- Avoid excessive shadows, gradients, badges, and charts.
- Use readable editorial typography, generous line spacing, and comfortable story line lengths.
- Respect safe areas, keyboard behavior, Android back behavior, and small screens.
- Do not use emoji as a substitute for a coherent icon set.
- Campaign cards should use credible image assets where available, with graceful fallbacks. Do not rely on remote images for core layout correctness.

## 5. Core screens and acceptance requirements

### Home
- Explain the promise: help important messages reach beyond a creator's existing network.
- CTA: Explore campaigns and Start a campaign.
- Show a configurable illustrative reach estimate per dollar with an explicit "demo estimate, not guaranteed" label.
- Featured and recent campaign cards include image, category, title, creator, summary, amount raised, goal, progress, estimated reach at goal, and Back this campaign.
- Plain-language Create → Review → Amplify explanation.

### Explore
- Search actually filters title, summary, creator, category, and relevant text.
- Category chips: Environment, Health, Science, Education, Public Policy, Economic Policy, Community, Arts & Culture, Business, Other.
- Sorting: Recommended, Recently added, Most funded, Ending soon.
- Filters should change displayed results; provide Clear filters.
- Implement loading, error, empty, and no-results states. For seeded offline data, loading can be brief and deterministic.

### Campaign detail
- Readable editorial story with headings/sections, images/captions/credits, stats, and visible source links.
- Creator identity, category, status, date, share action.
- Funding amount, goal, percentage, deadline/time remaining, estimated reach.
- Persistent/accessible Back this campaign action without covering story text.
- Expandable use of funds: fees, advertising allocation, unspent funds/refunds.
- Intended audience and placements.
- Review process, sources, and verification disclosures. Never claim verification that has not happened.
- Feedback prompt: "Did the creative encourage you to continue?" and "Did the message change your mind?" with No / Somewhat / Yes. Persist feedback in demo mode.

### Campaign creation
Five steps exactly:
1. **Basics**: title required, max 60 characters and counter; category required; creator/org name required; summary; what it's about; who it should reach; why it matters; evidence/support; optional cover image. Explain title/headline behavior. Save draft and Continue.
2. **Story**: headline, introduction, ordered editable sections, add/remove/reorder sections, simplified formatting, image selection/preview, caption/credit, stats, source title + valid URL, suggested audience actions, live preview. Sources must be public later.
3. **Campaign & Ad Visuals**: cover image; separate ad images/video placeholder if video unsupported; ad headline, description, CTA; placement previews; upload existing assets; validate file type/size; missing-asset warnings. Do not claim image generation exists if it does not; offer a clear placeholder/manual upload.
4. **Reach**: locations, audience interests/characteristics, supported channels, budget allocation, duration, audience preview. Explain that settings can be finalized during review. Reach is estimated, not guaranteed.
5. **Submit**: complete preview of title, summary, creator, story/sources, visuals, audience, channels, funding goal, reach estimate, duration, fees and funding policy. Creator enters funding goal here. Require policy confirmation. Actions: Back, Save as Draft, Preview Campaign, Submit for Review. Validate before submission.
- Persistent five-step progress indicator.
- Draft auto-save with a visible saved/saving/error indicator and safe debouncing.
- Back navigation preserves every field.
- Drafts resume after app restart.
- Submission confirmation shows status timeline and what happens next.
- Once submitted, state changes to `SUBMITTED_FOR_REVIEW`; do not automatically approve it.

### Contribution journey
1. Campaign detail inspection.
2. Preset and custom contribution amounts.
3. Dynamic estimated reach using a configurable demo assumption.
4. Review amount, fees, total, estimated reach, funding progress, refund terms, and explicit message-amplification disclaimer.
5. Simulated checkout clearly labelled "Demo payment — no real money will be charged". Include success, pending, rejected, cancelled, and failed outcomes, accessible for demonstration.
6. Only a simulated successful transaction increases the campaign's raised amount. Prevent accidental double application with a unique transaction/idempotency ID.
7. Success screen shows receipt/reference, amount, campaign, updated funding progress, share action, and Follow campaign.
8. Contribution history is private in Profile; backer names are not public by default.

Suggested configurable demo math (document and centralize; don't scatter constants):
- Platform/processing fee: 3% of contribution (demo assumption; not a real fee quote).
- Net amplification budget: contribution minus demo fee.
- Illustrative reach: 100 estimated impressions per ₹1 of net amplification budget (demo assumption only; no guaranteed unique people). Use the term "estimated impressions" when the calculation is impressions, not unique reach.
- Never present impressions and reach as interchangeable.
- For campaign goal-level estimate, use the same model and label it.
- Round displayed money to INR, show calculation transparently, and test edge cases.

### Creator dashboard
- Tabs/filters: Drafts, Under Review, Published / Funding, Promoting, Completed, Requires Action.
- Campaign card: title/thumbnail, status, raised/goal, deadline, estimated reach.
- Draft edit/resume, preview, share, moderation feedback, milestone updates, report.
- Submitted content is read-only unless returned for changes. Material edits after approval should require re-review before promotion.
- Reports distinguish funds raised, fees, advertising budget allocated/spent, impressions, estimated/measured reach, clicks, duration, and source of each metric.

### Activity
- Seed and generate meaningful events: submission received; approved/changes requested; funding milestone; deadline approaching; contribution success/failure; promotion begins; progress; completed; report available; campaign updates.
- Filter/read state and notification preferences.
- Avoid duplicate low-value notifications.

### Profile
- Demo account identity, created campaigns, backed campaigns, followed/saved campaigns, payment history, settings/help.
- Guest browsing works. If an action requires sign-in, use a minimal demo identity flow rather than blocking discovery. Don't ask for unnecessary personal or payment data.

## 6. Lifecycle state machine

Use centralized typed states and legal transition validation:
- `DRAFT`
- `SUBMITTED_FOR_REVIEW`
- `CHANGES_REQUESTED`
- `APPROVED`
- `AVAILABLE_FOR_FUNDING`
- `FUNDING`
- `FUNDING_GOAL_REACHED`
- `FUNDING_PERIOD_ENDED`
- `DISTRIBUTION_PREPARATION`
- `PROMOTING`
- `COMPLETED`
- Exceptional: `REJECTED`, `CANCELLED`, `REFUND_PENDING`, `FAILED`

Key rules:
- Draft → submitted only after validation and policy acceptance.
- Submitted → changes requested / approved / rejected only through demo reviewer/admin action or seeded review result. Since admin review is not required, implement a role-restricted demo reviewer view or a simple review simulation that is clearly marked as simulated.
- Approved → available for funding.
- Funding goal reached → distribution preparation, never straight to promoting.
- Promoting requires approved content + funding/budget available + distribution setup marked ready.
- Completed requires an explicit completion/report event.
- Every transition records timestamp, actor, and reason in an audit/event list.
- Prevent invalid transitions and show a useful error.
- Do not add a reviewer tab to the primary five-tab navigation; use a secondary demo-only route if included.

## 7. Data model

At minimum:
- `User`: id, displayName, email (demo-safe), role flags, createdAt
- `Campaign`: id, creatorId, title, category, summary, creatorName, coverImageUri, storyIntro, storySections, sources, statistics, audienceActions, adAssets, adHeadline, adDescription, callToAction, targetLocations, audienceInterests, channels, budgetAllocation, durationDays, fundingGoal, fundingRaised, status, createdAt, submittedAt, deadline, updatedAt
- `Contribution`: id/reference, campaignId, optional userId, amount, fee, total, estimatedImpressions, paymentStatus, isPublicBacker (default false), createdAt
- `Follow`: userId/guestKey, campaignId, createdAt
- `SavedCampaign`: userId/guestKey, campaignId, createdAt
- `ActivityEvent`: id, userId/guestKey, campaignId, type, title, message, readAt, createdAt
- `CampaignUpdate`: id, campaignId, title, body, createdAt
- `Feedback`: id, campaignId, optional userId/guestKey, creativeEncouraged, messageChanged, createdAt
- `ReviewEvent`: id, campaignId, actor, previousStatus, newStatus, reason, createdAt
- `DistributionReport`: campaignId, budgetAllocated, spend, impressions, estimatedReach, measuredReach nullable, clicks nullable, start/end timestamps, metricNotes

For PostgreSQL use Prisma migrations and a seed script. For offline demo mode, use a typed local repository with equivalent domain objects. Do not create a second inconsistent model just for local mode.

## 8. API outline

- `GET /health`
- `GET /api/campaigns` with search/category/sort/status query parameters
- `GET /api/campaigns/:id`
- `POST /api/campaigns` create draft
- `PATCH /api/campaigns/:id` update draft / changes-requested draft
- `POST /api/campaigns/:id/submit`
- `GET /api/me/campaigns`
- `GET /api/me/contributions`
- `POST /api/campaigns/:id/contributions` create simulated contribution intent
- `POST /api/contributions/:id/complete` simulate outcome; idempotent
- `POST /api/campaigns/:id/follow`
- `POST /api/campaigns/:id/save`
- `GET /api/activity`
- `PATCH /api/activity/:id/read`
- `GET /api/campaigns/:id/report`
- Demo reviewer routes must be explicitly protected/marked as demo only.
- Validate every payload server-side; enforce allowed state transitions; return consistent `{ error: { code, message, details? } }` responses.

## 9. Architecture and repository shape

Use a monorepo unless an existing repo suggests otherwise:
```
campaign-amplification/
  apps/
    mobile/
      app/
      src/
        components/
        features/
          campaigns/
          creation/
          contributions/
          activity/
          profile/
          reports/
        services/
        store/
        theme/
        types/
        utils/
      assets/
      app.json
      eas.json
    api/
      src/
        routes/
        services/
        domain/
        middleware/
        validators/
        prisma/
      prisma/
      tests/
  docs/
    implementation.md
    design-system.md
    demo-script.md
  docker-compose.yml
  .env.example
  README.md
```
If the current repository already has a sound structure, inspect it and adapt rather than blindly replacing it.

## 10. Engineering quality

- Strict TypeScript where practical; avoid `any` except documented boundary cases.
- Separate UI, domain logic, persistence, and API concerns.
- Use reusable buttons, inputs, chips, progress bars, campaign cards, empty states, skeletons, accordions, status pills, and error banners.
- No giant single component or screen with all logic.
- No dead buttons, placeholder `onPress` handlers, or fake success without state mutation.
- Validate on both client and server.
- Handle network failure, retry, loading, empty, error, success, and form validation states.
- Avoid logging secrets or private payment information.
- Include unit tests for fee/reach calculations, lifecycle transitions, form validation, and contribution idempotency. Add API integration tests for key endpoints.
- Seed at least 8 coherent campaigns across categories and creator types, with consistent figures and story/source content. Label all campaign metrics as demo data.
- Use local bundled image assets where possible; if remote images are used, implement a fallback and never let image loading break layout.
- Add accessible labels, keyboard-safe forms, screen-reader-friendly controls, and sensible Android back behavior.

## 11. Build and submission

- Expo development run instructions.
- Android EAS build configuration for APK (`android.buildType: "apk"` in a suitable EAS profile).
- `.env.example` with no secrets.
- Docker Compose for API + PostgreSQL if backend is implemented.
- README with exact commands, ports, setup, demo mode behavior, seed instructions, tests, and APK build command.
- Demo video script showing the whole journey in 3–5 minutes.
- Don't claim an APK was built unless the build actually succeeded. If local Android SDK or credentials are unavailable, provide exact EAS steps and report the blocker honestly.

## 12. Acceptance checklist (must be tested)

1. App launches on Android/Expo without runtime errors.
2. Five-tab navigation is consistent.
3. Browse without login.
4. Search, category filters, and sorting change the results.
5. Open a campaign and read story + sources + use of funds.
6. Start campaign and complete all five creation steps in order.
7. Invalid required fields show actionable errors.
8. Draft auto-saves and survives navigation/app restart.
9. Preview matches the data that would be submitted.
10. Submission changes state to submitted-for-review and displays a timeline.
11. No campaign promotes automatically after funding completion.
12. Contribution amount changes fee and estimated impressions.
13. Demo checkout outcomes are accurately represented.
14. Successful contribution updates progress exactly once; failed/cancelled/pending outcomes do not falsely increase raised funds.
15. Profile shows private payment history and followed/saved campaigns.
16. Activity shows meaningful events.
17. Creator dashboard shows statuses and a report.
18. Demo mode works without external credentials.
19. No dead primary buttons or silent failures.
20. README, tests, and APK build instructions are present.

## 13. Scope prioritization

### Must-have
Home, Explore, detail/story/sources, five-step create wizard, drafts, submit/review status, contribution/review/simulated checkout/receipt, progress tracking, Activity, Profile, creator dashboard/report, local demo persistence, consistent visual system, tests, APK path.

### Nice-to-have only after must-have works
Voice input, AI drafting, comments/replies, real push notifications, real payment, real ad networks, video creative playback, advanced rich text, real analytics integrations.

If a nice-to-have feature risks the main journey or build stability, defer it and provide a clear manual/demo fallback.
