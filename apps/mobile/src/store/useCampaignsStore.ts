import { create } from 'zustand';
import type { Campaign } from '@campaign/shared';
import { getCampaignRepository } from '../services';

type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface CampaignsState {
  status: LoadStatus;
  campaigns: Campaign[];
  error: string | null;
  load: (options?: { force?: boolean }) => Promise<void>;
}

/**
 * Loads the full campaign set once and keeps it in memory. Screens apply the
 * shared `filterAndSortCampaigns` locally so search/filter/sort are instant and
 * never re-fetch on every keystroke. The repository still owns the data.
 */
export const useCampaignsStore = create<CampaignsState>((set, get) => ({
  status: 'idle',
  campaigns: [],
  error: null,

  load: async (options) => {
    if (get().status === 'loading') {
      return;
    }
    if (get().status === 'ready' && !options?.force) {
      return;
    }
    set({ status: 'loading', error: null });
    try {
      const campaigns = await getCampaignRepository().listCampaigns();
      set({ status: 'ready', campaigns });
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Could not load campaigns.',
      });
    }
  },
}));
