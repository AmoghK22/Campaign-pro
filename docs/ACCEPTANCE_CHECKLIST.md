# Hackathon acceptance checklist

Use this as a strict QA gate before recording the demo.

## Product understanding
- [ ] Home explains the platform in one glance.
- [ ] User can explain that money funds message distribution, not the cause itself.
- [ ] Reach is labelled an estimate and does not promise unique people.
- [ ] Fees, ad allocation, unspent funds/refund policy are visible before contribution.

## Navigation and discovery
- [ ] Home / Explore / Create / Activity / Profile are stable bottom tabs.
- [ ] Campaigns can be browsed without account creation.
- [ ] Search changes results.
- [ ] Category filters change results.
- [ ] Sorting changes order.
- [ ] Empty and no-results states have a useful recovery action.
- [ ] Campaign detail shows story and visible supporting sources.
- [ ] Share/follow/save/feedback actions work or are clearly disabled with an explanation.

## Creation
- [ ] Exactly five steps in specified order; persistent progress indicator.
- [ ] Basics required fields and 60-character title limit validate.
- [ ] Story sections can be added/removed/reordered.
- [ ] Sources have title and valid URL.
- [ ] Story content and ad creative are separate.
- [ ] Reach settings and audience preview work.
- [ ] Creator enters funding goal at Submit step.
- [ ] Policy confirmation required.
- [ ] Back preserves all data.
- [ ] Autosaved draft survives app restart.
- [ ] Preview matches the draft.
- [ ] Submission creates a review status/timeline; no silent approval.

## Contributions
- [ ] Preset and custom amount controls work.
- [ ] Fee, total, net ad budget, and estimated impressions update dynamically.
- [ ] Simulated payment is clearly labelled; no real money claimed.
- [ ] Success updates funding exactly once.
- [ ] Pending/failed/cancelled/rejected do not increase funds.
- [ ] Receipt and private payment history are accessible.
- [ ] Backer name is private by default.

## Lifecycle, activity, reports
- [ ] Funding goal reached does not start advertising automatically.
- [ ] Legal lifecycle transitions are enforced.
- [ ] Activity events reflect actual demo actions.
- [ ] Creator dashboard filters show correct campaign states.
- [ ] Reports distinguish raised funds, ad spend, impressions, estimated/measured reach, clicks.
- [ ] Unknown delivery metrics are not fabricated.
- [ ] Material edits after approval are subject to re-review.

## Technical quality
- [ ] Demo Mode works without external credentials.
- [ ] No dead primary buttons.
- [ ] Loading/error/empty/success states exist for major flows.
- [ ] Typecheck, lint, and tests pass (record actual output).
- [ ] App launches on Android/Expo.
- [ ] APK build path documented and tested if environment permits.
- [ ] No secrets committed.
- [ ] Demo video script is ready.
