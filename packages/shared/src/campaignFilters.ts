import type { Campaign } from './types';

export type CampaignSort = 'recommended' | 'recent' | 'most_funded' | 'ending_soon';

export interface CampaignQuery {
  search?: string;
  category?: string | null;
  sort?: CampaignSort;
  status?: string | null;
}

export const CAMPAIGN_SORTS: { value: CampaignSort; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'recent', label: 'Recently added' },
  { value: 'most_funded', label: 'Most funded' },
  { value: 'ending_soon', label: 'Ending soon' },
];

function matchesSearch(campaign: Campaign, term: string): boolean {
  const haystack = [
    campaign.title,
    campaign.summary,
    campaign.creatorName,
    campaign.category,
    campaign.storyIntro,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(term.toLowerCase());
}

/**
 * Pure, testable filter + sort. Sorting is stable so the curated
 * "recommended" order is preserved for ties.
 */
export function filterAndSortCampaigns(
  campaigns: Campaign[],
  query: CampaignQuery = {},
): Campaign[] {
  const term = query.search?.trim() ?? '';
  let result = campaigns.slice();

  if (query.category) {
    result = result.filter((c) => c.category === query.category);
  }
  if (query.status) {
    result = result.filter((c) => c.status === query.status);
  }
  if (term.length > 0) {
    result = result.filter((c) => matchesSearch(c, term));
  }

  switch (query.sort) {
    case 'recent':
      result.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      break;
    case 'most_funded':
      result.sort((a, b) => b.fundingRaised - a.fundingRaised);
      break;
    case 'ending_soon':
      result.sort((a, b) => {
        const aTime = a.deadline ? Date.parse(a.deadline) : Number.POSITIVE_INFINITY;
        const bTime = b.deadline ? Date.parse(b.deadline) : Number.POSITIVE_INFINITY;
        return aTime - bTime;
      });
      break;
    case 'recommended':
    default:
      break;
  }

  return result;
}
