import { describe, expect, it } from 'vitest';
import type { Campaign } from '../types';
import { filterAndSortCampaigns } from '../campaignFilters';

function makeCampaign(overrides: Partial<Campaign>): Campaign {
  return {
    id: 'c',
    creatorId: 'u',
    title: 'Title',
    category: 'Environment',
    summary: 'summary',
    creatorName: 'Creator',
    coverImageUri: null,
    storyIntro: 'intro',
    storySections: [],
    storyImages: [],
    sources: [],
    statistics: [],
    audienceActions: [],
    adAssets: { coverImageUri: null, adImageUri: null, hasVideoPlaceholder: false },
    adHeadline: '',
    adDescription: '',
    callToAction: '',
    targetLocations: [],
    audienceInterests: [],
    channels: [],
    budgetAllocation: { advertisingSharePercent: 85, contingencySharePercent: 15 },
    durationDays: 14,
    fundingGoal: 100000,
    fundingRaised: 10000,
    status: 'FUNDING',
    dataOrigin: 'seed_demo',
    createdAt: '2026-01-01T00:00:00.000Z',
    submittedAt: null,
    deadline: '2026-12-31T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const river = makeCampaign({
  id: 'river',
  title: 'River clean-up',
  creatorName: 'Periyar Volunteers',
  category: 'Environment',
  fundingRaised: 50000,
  createdAt: '2026-02-01T00:00:00.000Z',
  deadline: '2026-11-01T00:00:00.000Z',
});
const lab = makeCampaign({
  id: 'lab',
  title: 'STEM lab',
  creatorName: 'Dharwad Teachers',
  category: 'Education',
  fundingRaised: 90000,
  createdAt: '2026-03-01T00:00:00.000Z',
  deadline: '2026-10-01T00:00:00.000Z',
});
const data = [river, lab];

describe('filterAndSortCampaigns', () => {
  it('returns everything with no query', () => {
    expect(filterAndSortCampaigns(data)).toHaveLength(2);
  });

  it('filters by category', () => {
    expect(filterAndSortCampaigns(data, { category: 'Education' }).map((c) => c.id)).toEqual(['lab']);
  });

  it('searches title, summary, creator, and category case-insensitively', () => {
    expect(filterAndSortCampaigns(data, { search: 'river' }).map((c) => c.id)).toEqual(['river']);
    expect(filterAndSortCampaigns(data, { search: 'DHARWAD' }).map((c) => c.id)).toEqual(['lab']);
    expect(filterAndSortCampaigns(data, { search: 'education' }).map((c) => c.id)).toEqual(['lab']);
  });

  it('returns no results for a non-matching term', () => {
    expect(filterAndSortCampaigns(data, { search: 'zzz' })).toHaveLength(0);
  });

  it('sorts by most funded', () => {
    expect(filterAndSortCampaigns(data, { sort: 'most_funded' }).map((c) => c.id)).toEqual(['lab', 'river']);
  });

  it('sorts by most recent', () => {
    expect(filterAndSortCampaigns(data, { sort: 'recent' }).map((c) => c.id)).toEqual(['lab', 'river']);
  });

  it('sorts by ending soon, ignoring missing deadlines', () => {
    const noDeadline = makeCampaign({ id: 'none', deadline: null });
    const sorted = filterAndSortCampaigns([...data, noDeadline], { sort: 'ending_soon' });
    expect(sorted[sorted.length - 1]?.id).toBe('none');
  });

  it('preserves curated order for recommended', () => {
    expect(filterAndSortCampaigns(data, { sort: 'recommended' }).map((c) => c.id)).toEqual(['river', 'lab']);
  });

  it('filters by status', () => {
    const approved = makeCampaign({ id: 'appr', status: 'APPROVED' });
    expect(filterAndSortCampaigns([...data, approved], { status: 'APPROVED' }).map((c) => c.id)).toEqual([
      'appr',
    ]);
  });

  it('does not mutate the input array', () => {
    const input = [...data];
    filterAndSortCampaigns(input, { sort: 'most_funded' });
    expect(input.map((c) => c.id)).toEqual(['river', 'lab']);
  });
});
