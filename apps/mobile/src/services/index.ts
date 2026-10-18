import { localRepository } from './localRepository';
import type { CampaignRepository } from './repository';

export type { CampaignRepository } from './repository';
export type { CampaignQuery, CampaignSort } from '@campaign/shared';
export { CAMPAIGN_SORTS } from '@campaign/shared';
export { DEMO_MODE, DEMO_MODE_MESSAGE, getApiBaseUrl, isDemoMode } from './demoMode';

/**
 * Resolves the active repository. Demo Mode (no API configured) uses the
 * on-device local repository. A future API repository slots in here without
 * any screen changes.
 */
export function getCampaignRepository(): CampaignRepository {
  return localRepository;
}
