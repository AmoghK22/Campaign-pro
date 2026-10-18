import {
  applyTransition,
  createId,
  type Campaign,
  type CampaignDraft,
  type ReviewEvent,
} from '@campaign/shared';
import type { CampaignRepository } from '../../services/repository';

export interface SubmissionOptions {
  /** Stable id for the created campaign. */
  id: string;
  now: string;
  creatorId: string;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Turns a fully validated draft into a campaign and moves it through the
 * centralized lifecycle: it is created as DRAFT and only then transitioned to
 * SUBMITTED_FOR_REVIEW. It can never land in APPROVED or PROMOTING here, so a
 * submission is never silently approved or advertised.
 */
export function buildSubmission(
  draft: CampaignDraft,
  options: SubmissionOptions,
): { campaign: Campaign; reviewEvent: ReviewEvent } {
  const deadline = new Date(Date.parse(options.now) + draft.durationDays * DAY_MS).toISOString();

  const draftCampaign: Campaign = {
    id: options.id,
    creatorId: options.creatorId,
    title: draft.title.trim(),
    category: draft.category ?? 'Other',
    summary: draft.summary.trim(),
    creatorName: draft.creatorName.trim(),
    coverImageUri: draft.coverImageUri,
    coverImageKey: draft.coverImageKey,
    featured: false,
    storyHeadline: draft.storyHeadline.trim() || null,
    storyIntro: draft.storyIntro.trim(),
    storySections: draft.storySections,
    storyImages: draft.storyImages,
    sources: draft.sources,
    statistics: draft.statistics,
    audienceActions: draft.audienceActions,
    adAssets: {
      coverImageUri: draft.coverImageUri,
      adImageUri: draft.adImageUri,
      adImageKey: draft.adImageKey,
      hasVideoPlaceholder: draft.hasVideoPlaceholder,
    },
    adHeadline: draft.adHeadline.trim(),
    adDescription: draft.adDescription.trim(),
    callToAction: draft.callToAction.trim(),
    targetLocations: draft.targetLocations,
    audienceInterests: draft.audienceInterests,
    channels: draft.channels,
    budgetAllocation: draft.budgetAllocation,
    durationDays: draft.durationDays,
    fundingGoal: draft.fundingGoal,
    fundingRaised: 0,
    status: 'DRAFT',
    dataOrigin: 'user',
    createdAt: draft.createdAt,
    submittedAt: null,
    deadline,
    updatedAt: options.now,
  };

  const { campaign, event } = applyTransition(draftCampaign, 'SUBMITTED_FOR_REVIEW', {
    actor: 'creator',
    reason: 'Creator submitted the campaign for review.',
    now: options.now,
    eventId: createId('review'),
  });

  return { campaign, reviewEvent: event };
}

/**
 * Persists a submission: saves the campaign, records the audit review event,
 * and deletes the draft it came from (so editing never leaves duplicates).
 */
export async function submitDraft(
  repository: CampaignRepository,
  draft: CampaignDraft,
  options: SubmissionOptions,
): Promise<{ campaign: Campaign; reviewEvent: ReviewEvent }> {
  const result = buildSubmission(draft, options);
  await repository.saveCampaign(result.campaign);
  await repository.saveReviewEvent(result.reviewEvent);
  await repository.deleteDraft(draft.id);
  return result;
}
