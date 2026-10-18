import type { CampaignStatus, ReviewEvent } from './types';

export class InvalidTransitionError extends Error {
  readonly code = 'INVALID_TRANSITION';

  constructor(
    readonly from: CampaignStatus,
    readonly to: CampaignStatus,
  ) {
    super(`Illegal campaign transition: ${from} -> ${to}`);
    this.name = 'InvalidTransitionError';
  }
}

const ALLOWED_TRANSITIONS: Record<CampaignStatus, readonly CampaignStatus[]> = {
  DRAFT: ['SUBMITTED_FOR_REVIEW'],
  SUBMITTED_FOR_REVIEW: ['CHANGES_REQUESTED', 'APPROVED', 'REJECTED'],
  CHANGES_REQUESTED: ['DRAFT'],
  APPROVED: ['AVAILABLE_FOR_FUNDING'],
  AVAILABLE_FOR_FUNDING: ['FUNDING'],
  FUNDING: ['FUNDING_GOAL_REACHED', 'FUNDING_PERIOD_ENDED', 'CANCELLED'],
  FUNDING_GOAL_REACHED: ['DISTRIBUTION_PREPARATION'],
  FUNDING_PERIOD_ENDED: ['DISTRIBUTION_PREPARATION', 'COMPLETED'],
  DISTRIBUTION_PREPARATION: ['PROMOTING', 'CANCELLED'],
  PROMOTING: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  REJECTED: [],
  CANCELLED: [],
  REFUND_PENDING: ['FAILED', 'CANCELLED'],
  FAILED: [],
};

export function allowedTransitions(from: CampaignStatus): readonly CampaignStatus[] {
  return ALLOWED_TRANSITIONS[from];
}

export function canTransition(from: CampaignStatus, to: CampaignStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

const FUNDING_OPEN_STATUSES: readonly CampaignStatus[] = [
  'APPROVED',
  'AVAILABLE_FOR_FUNDING',
  'FUNDING',
];

/** True while a campaign may still accept new contributions. */
export function isFundingOpen(status: CampaignStatus): boolean {
  return FUNDING_OPEN_STATUSES.includes(status);
}

export function assertTransition(from: CampaignStatus, to: CampaignStatus): void {
  if (!canTransition(from, to)) {
    throw new InvalidTransitionError(from, to);
  }
}

export function createReviewEvent(input: {
  id: string;
  campaignId: string;
  actor: string;
  previousStatus: CampaignStatus | null;
  newStatus: CampaignStatus;
  reason: string | null;
  now: string;
}): ReviewEvent {
  return {
    id: input.id,
    campaignId: input.campaignId,
    actor: input.actor,
    previousStatus: input.previousStatus,
    newStatus: input.newStatus,
    reason: input.reason,
    createdAt: input.now,
  };
}

/**
 * Validates and applies a lifecycle transition. Returns the updated campaign
 * status plus an audit ReviewEvent. Never allows direct FUNDING_GOAL_REACHED
 * -> PROMOTING: promotion always passes through DISTRIBUTION_PREPARATION.
 */
export function applyTransition<
  T extends { status: CampaignStatus; updatedAt: string },
>(campaign: T, to: CampaignStatus, meta: { actor: string; reason: string | null; now: string; eventId: string }): {
  campaign: T;
  event: ReviewEvent;
} {
  assertTransition(campaign.status, to);
  const event = createReviewEvent({
    id: meta.eventId,
    campaignId: (campaign as { id?: string }).id ?? 'unknown',
    actor: meta.actor,
    previousStatus: campaign.status,
    newStatus: to,
    reason: meta.reason,
    now: meta.now,
  });
  return {
    campaign: { ...campaign, status: to, updatedAt: meta.now },
    event,
  };
}
