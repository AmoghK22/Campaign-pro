import { describe, expect, it } from 'vitest';
import { filterAndSortCampaigns } from '@campaign/shared';
import { SEED_CAMPAIGNS } from '@app/services/seed';
import { getCampaignImageSource } from '@app/assets/campaignImages';
import { selectFeatured, selectRecentlyAdded, selectRecommended } from '@app/features/campaigns/selectors';

describe('seed data', () => {
  it('ships at least eight coherent campaigns with unique ids', () => {
    expect(SEED_CAMPAIGNS.length).toBeGreaterThanOrEqual(8);
    const ids = new Set(SEED_CAMPAIGNS.map((campaign) => campaign.id));
    expect(ids.size).toBe(SEED_CAMPAIGNS.length);
  });

  it('references only bundled image assets that actually exist', () => {
    for (const campaign of SEED_CAMPAIGNS) {
      expect(getCampaignImageSource(campaign.coverImageKey), `cover for ${campaign.id}`).not.toBeNull();
      expect(getCampaignImageSource(campaign.adAssets.adImageKey), `ad for ${campaign.id}`).not.toBeNull();
      for (const image of campaign.storyImages) {
        expect(getCampaignImageSource(image.imageKey), `story image for ${campaign.id}`).not.toBeNull();
        expect(image.caption.length).toBeGreaterThan(0);
        expect(image.credit.length).toBeGreaterThan(0);
      }
    }
  });

  it('keeps funding figures self-consistent', () => {
    for (const campaign of SEED_CAMPAIGNS) {
      expect(campaign.fundingGoal).toBeGreaterThan(0);
      expect(campaign.fundingRaised).toBeGreaterThanOrEqual(0);
      expect(campaign.fundingRaised).toBeLessThanOrEqual(campaign.fundingGoal);
      expect(campaign.sources.every((source) => source.title.length > 0)).toBe(true);
    }
  });
});

describe('explore filtering, search, and sort actually change results', () => {
  it('returns everything when no query is applied (clear filters)', () => {
    expect(filterAndSortCampaigns(SEED_CAMPAIGNS, {})).toHaveLength(SEED_CAMPAIGNS.length);
    expect(filterAndSortCampaigns(SEED_CAMPAIGNS, { search: '', category: null })).toHaveLength(
      SEED_CAMPAIGNS.length,
    );
  });

  it('search matches title, summary, and creator text', () => {
    const byTitle = filterAndSortCampaigns(SEED_CAMPAIGNS, { search: 'mangrove' });
    expect(byTitle.map((c) => c.id)).toEqual(['seed-mangrove-guards']);

    const byCreator = filterAndSortCampaigns(SEED_CAMPAIGNS, { search: 'Periyar Volunteers' });
    expect(byCreator.map((c) => c.id)).toEqual(['seed-river-wardens']);

    const bySummary = filterAndSortCampaigns(SEED_CAMPAIGNS, { search: 'hearing' });
    expect(bySummary.map((c) => c.id)).toEqual(['seed-hearing-screening']);
  });

  it('filters by category', () => {
    const health = filterAndSortCampaigns(SEED_CAMPAIGNS, { category: 'Health' });
    expect(health.map((c) => c.id)).toEqual(['seed-hearing-screening']);

    const environment = filterAndSortCampaigns(SEED_CAMPAIGNS, { category: 'Environment' });
    expect(environment.map((c) => c.id).sort()).toEqual(
      ['seed-river-wardens', 'seed-mangrove-guards'].sort(),
    );
  });

  it('sorts by recently added and most funded', () => {
    const recent = filterAndSortCampaigns(SEED_CAMPAIGNS, { sort: 'recent' });
    expect(recent[0].id).toBe('seed-oral-history');

    const funded = filterAndSortCampaigns(SEED_CAMPAIGNS, { sort: 'most_funded' });
    expect(funded[0].id).toBe('seed-women-in-trades');
  });

  it('combines search and category, and can produce an empty result', () => {
    const mismatch = filterAndSortCampaigns(SEED_CAMPAIGNS, {
      search: 'mangrove',
      category: 'Health',
    });
    expect(mismatch).toHaveLength(0);

    const match = filterAndSortCampaigns(SEED_CAMPAIGNS, {
      search: 'bus',
      category: 'Community',
    });
    expect(match.map((c) => c.id)).toEqual(['seed-night-bus-safety']);
  });

  it('preserves the curated order for the default recommended sort', () => {
    const recommended = filterAndSortCampaigns(SEED_CAMPAIGNS, { sort: 'recommended' });
    expect(recommended[0].id).toBe(SEED_CAMPAIGNS[0].id);
    expect(recommended.map((c) => c.id)).toEqual(SEED_CAMPAIGNS.map((c) => c.id));
  });
});

describe('home selections', () => {
  it('picks the curated featured campaign', () => {
    expect(selectFeatured(SEED_CAMPAIGNS)?.id).toBe('seed-river-wardens');
    expect(selectFeatured([])).toBeNull();
  });

  it('excludes the featured campaign from recommended and recent, and respects the limit', () => {
    const featured = selectFeatured(SEED_CAMPAIGNS);
    const recommended = selectRecommended(SEED_CAMPAIGNS, { excludeId: featured?.id, limit: 3 });
    expect(recommended).toHaveLength(3);
    expect(recommended.some((c) => c.id === featured?.id)).toBe(false);

    const recent = selectRecentlyAdded(SEED_CAMPAIGNS, { excludeId: featured?.id, limit: 3 });
    expect(recent).toHaveLength(3);
    expect(recent[0].id).toBe('seed-oral-history');
    expect(recent.some((c) => c.id === featured?.id)).toBe(false);
  });
});
