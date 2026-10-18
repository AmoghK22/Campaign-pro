import { describe, expect, it } from 'vitest';
import {
  InvalidTransitionError,
  allowedTransitions,
  applyTransition,
  assertTransition,
  canTransition,
  isFundingOpen,
} from '../lifecycle';
import type { CampaignStatus } from '../types';

const ALL_STATUSES: CampaignStatus[] = [
  'DRAFT',
  'SUBMITTED_FOR_REVIEW',
  'CHANGES_REQUESTED',
  'APPROVED',
  'AVAILABLE_FOR_FUNDING',
  'FUNDING',
  'FUNDING_GOAL_REACHED',
  'FUNDING_PERIOD_ENDED',
  'DISTRIBUTION_PREPARATION',
  'PROMOTING',
  'COMPLETED',
  'REJECTED',
  'CANCELLED',
  'REFUND_PENDING',
  'FAILED',
];

describe('lifecycle state machine', () => {
  it('allows the happy path draft -> promoting -> completed', () => {
    const happy: CampaignStatus[] = [
      'DRAFT',
      'SUBMITTED_FOR_REVIEW',
      'APPROVED',
      'AVAILABLE_FOR_FUNDING',
      'FUNDING',
      'FUNDING_GOAL_REACHED',
      'DISTRIBUTION_PREPARATION',
      'PROMOTING',
      'COMPLETED',
    ];
    for (let i = 0; i < happy.length - 1; i += 1) {
      expect(canTransition(happy[i]!, happy[i + 1]!)).toBe(true);
    }
  });

  it('never allows funding goal reached to jump straight to promoting', () => {
    expect(canTransition('FUNDING_GOAL_REACHED', 'PROMOTING')).toBe(false);
  });

  it('never auto-approves a submission', () => {
    expect(canTransition('SUBMITTED_FOR_REVIEW', 'AVAILABLE_FOR_FUNDING')).toBe(false);
    expect(canTransition('SUBMITTED_FOR_REVIEW', 'FUNDING')).toBe(false);
    expect(allowedTransitions('SUBMITTED_FOR_REVIEW')).toEqual([
      'CHANGES_REQUESTED',
      'APPROVED',
      'REJECTED',
    ]);
  });

  it('requires re-review after changes are requested', () => {
    expect(canTransition('CHANGES_REQUESTED', 'DRAFT')).toBe(true);
    expect(canTransition('DRAFT', 'SUBMITTED_FOR_REVIEW')).toBe(true);
    expect(canTransition('CHANGES_REQUESTED', 'APPROVED')).toBe(false);
  });

  it('treats terminal states as terminal', () => {
    for (const terminal of ['COMPLETED', 'REJECTED', 'FAILED'] as CampaignStatus[]) {
      expect(allowedTransitions(terminal)).toHaveLength(0);
      for (const to of ALL_STATUSES) {
        expect(canTransition(terminal, to)).toBe(false);
      }
    }
  });

  it('assertTransition throws InvalidTransitionError for illegal moves', () => {
    expect(() => assertTransition('FUNDING', 'PROMOTING')).toThrow(InvalidTransitionError);
    expect(() => assertTransition('DRAFT', 'PROMOTING')).toThrow(InvalidTransitionError);
    expect(() => assertTransition('DRAFT', 'SUBMITTED_FOR_REVIEW')).not.toThrow();
  });

  it('applyTransition returns updated campaign and audit event', () => {
    const campaign = { id: 'c1', status: 'DRAFT' as CampaignStatus, updatedAt: 't0' };
    const { campaign: next, event } = applyTransition(campaign, 'SUBMITTED_FOR_REVIEW', {
      actor: 'creator:demo',
      reason: null,
      now: 't1',
      eventId: 'ev1',
    });
    expect(next.status).toBe('SUBMITTED_FOR_REVIEW');
    expect(next.updatedAt).toBe('t1');
    expect(event).toMatchObject({
      id: 'ev1',
      campaignId: 'c1',
      actor: 'creator:demo',
      previousStatus: 'DRAFT',
      newStatus: 'SUBMITTED_FOR_REVIEW',
      createdAt: 't1',
    });
  });

  it('applyTransition throws and leaves state untouched on illegal transition', () => {
    const campaign = { id: 'c2', status: 'FUNDING' as CampaignStatus, updatedAt: 't0' };
    expect(() =>
      applyTransition(campaign, 'PROMOTING', {
        actor: 'system',
        reason: null,
        now: 't1',
        eventId: 'ev2',
      }),
    ).toThrow(InvalidTransitionError);
    expect(campaign.status).toBe('FUNDING');
  });

  it('every status has a transition entry', () => {
    for (const status of ALL_STATUSES) {
      expect(allowedTransitions(status)).toBeDefined();
    }
  });

  it('isFundingOpen is true only before funding closes', () => {
    expect(isFundingOpen('APPROVED')).toBe(true);
    expect(isFundingOpen('AVAILABLE_FOR_FUNDING')).toBe(true);
    expect(isFundingOpen('FUNDING')).toBe(true);
    expect(isFundingOpen('FUNDING_GOAL_REACHED')).toBe(false);
    expect(isFundingOpen('DISTRIBUTION_PREPARATION')).toBe(false);
    expect(isFundingOpen('PROMOTING')).toBe(false);
    expect(isFundingOpen('COMPLETED')).toBe(false);
    expect(isFundingOpen('DRAFT')).toBe(false);
  });
});
