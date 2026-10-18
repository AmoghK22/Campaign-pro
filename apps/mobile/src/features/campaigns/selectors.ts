import { filterAndSortCampaigns, type Campaign } from '@campaign/shared';

/**
 * Presentation-level selections built on the shared filter/sort so Home never
 * re-implements business rules. All functions are pure and order-preserving.
 */
export function selectFeatured(campaigns: Campaign[]): Campaign | null {
  if (campaigns.length === 0) {
    return null;
  }
  const flagged = campaigns.find((campaign) => campaign.featured);
  if (flagged) {
    return flagged;
  }
  return filterAndSortCampaigns(campaigns, { sort: 'most_funded' })[0] ?? null;
}

export function selectRecommended(
  campaigns: Campaign[],
  options: { excludeId?: string; limit?: number } = {},
): Campaign[] {
  const { excludeId, limit = 3 } = options;
  const ordered = filterAndSortCampaigns(campaigns, { sort: 'recommended' });
  return ordered
    .filter((campaign) => campaign.id !== excludeId)
    .slice(0, limit);
}

export function selectRecentlyAdded(
  campaigns: Campaign[],
  options: { excludeId?: string; limit?: number } = {},
): Campaign[] {
  const { excludeId, limit = 3 } = options;
  const ordered = filterAndSortCampaigns(campaigns, { sort: 'recent' });
  return ordered
    .filter((campaign) => campaign.id !== excludeId)
    .slice(0, limit);
}
