import { create } from 'zustand';
import {
  createEmptyDraft,
  createId,
  removeById,
  upsertById,
  type Campaign,
  type CampaignDraft,
  type ReviewEvent,
} from '@campaign/shared';
import { getCampaignRepository } from '../services';
import { submitDraft } from '../features/creation/submission';
import { useAppStore } from './useAppStore';

export const AUTOSAVE_DELAY_MS = 700;

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
type LoadStatus = 'idle' | 'loading' | 'ready' | 'error';

interface DraftsState {
  status: LoadStatus;
  error: string | null;
  drafts: CampaignDraft[];
  activeDraft: CampaignDraft | null;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  load: (options?: { force?: boolean }) => Promise<void>;
  createDraft: (seed?: Partial<CampaignDraft>) => Promise<CampaignDraft>;
  openDraft: (id: string) => Promise<CampaignDraft | null>;
  closeDraft: () => void;
  patchActive: (updater: (draft: CampaignDraft) => CampaignDraft) => void;
  flushActive: () => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;
  submitActive: () => Promise<{ campaign: Campaign; reviewEvent: ReviewEvent }>;
}

/**
 * Single owner of creation drafts. Drafts live in the repository (AsyncStorage
 * in Demo Mode) and are mirrored here for instant UI. Every edit is autosaved
 * with a short debounce and a visible saving/saved status.
 */
export const useDraftsStore = create<DraftsState>((set, get) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  async function persist(draft: CampaignDraft): Promise<void> {
    try {
      await getCampaignRepository().saveDraft(draft);
      set({ saveStatus: 'saved', lastSavedAt: new Date().toISOString() });
    } catch {
      set({ saveStatus: 'error' });
    }
  }

  function schedule(draft: CampaignDraft): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      const current = get().activeDraft;
      void persist(current && current.id === draft.id ? current : draft);
    }, AUTOSAVE_DELAY_MS);
  }

  return {
    status: 'idle',
    error: null,
    drafts: [],
    activeDraft: null,
    saveStatus: 'idle',
    lastSavedAt: null,

    load: async (options) => {
      if (get().status === 'loading') {
        return;
      }
      if (get().status === 'ready' && !options?.force) {
        return;
      }
      set({ status: 'loading', error: null });
      try {
        const drafts = await getCampaignRepository().listDrafts();
        set({ status: 'ready', drafts });
      } catch (error) {
        set({
          status: 'error',
          error: error instanceof Error ? error.message : 'Could not load drafts.',
        });
      }
    },

    createDraft: async (seed) => {
      const now = new Date().toISOString();
      const base = createEmptyDraft(createId('draft'), now);
      const draft: CampaignDraft = { ...base, ...seed, id: base.id, createdAt: base.createdAt };
      await getCampaignRepository().saveDraft(draft);
      set((state) => ({
        drafts: upsertById(state.drafts, draft),
        activeDraft: draft,
        saveStatus: 'saved',
        lastSavedAt: now,
      }));
      return draft;
    },

    openDraft: async (id) => {
      const existing = get().drafts.find((draft) => draft.id === id);
      if (existing) {
        set({ activeDraft: existing });
        return existing;
      }
      const draft = await getCampaignRepository().getDraft(id);
      if (draft) {
        set((state) => ({ activeDraft: draft, drafts: upsertById(state.drafts, draft) }));
      }
      return draft;
    },

    closeDraft: () => set({ activeDraft: null }),

    patchActive: (updater) => {
      const current = get().activeDraft;
      if (!current) {
        return;
      }
      const updated: CampaignDraft = { ...updater(current), updatedAt: new Date().toISOString() };
      set((state) => ({
        activeDraft: updated,
        drafts: upsertById(state.drafts, updated),
        saveStatus: 'saving',
      }));
      schedule(updated);
    },

    flushActive: async () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      const current = get().activeDraft;
      if (current) {
        await persist(current);
      }
    },

    deleteDraft: async (id) => {
      await getCampaignRepository().deleteDraft(id);
      set((state) => ({
        drafts: removeById(state.drafts, id),
        activeDraft: state.activeDraft?.id === id ? null : state.activeDraft,
      }));
    },

    submitActive: async () => {
      const draft = get().activeDraft;
      if (!draft) {
        throw new Error('There is no active draft to submit.');
      }
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      set({ saveStatus: 'saving' });
      const guestKey = useAppStore.getState().guestKey;
      const result = await submitDraft(getCampaignRepository(), draft, {
        id: createId('campaign'),
        now: new Date().toISOString(),
        creatorId: guestKey.length > 0 ? guestKey : 'demo-creator',
      });
      set((state) => ({
        drafts: removeById(state.drafts, draft.id),
        activeDraft: null,
        saveStatus: 'saved',
        lastSavedAt: result.campaign.submittedAt,
      }));
      return result;
    },
  };
});
