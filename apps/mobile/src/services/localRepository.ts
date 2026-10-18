import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Campaign,
  CampaignDraft,
  CampaignQuery,
  Feedback,
  ReviewEvent,
} from '@campaign/shared';
import { filterAndSortCampaigns, upsertById } from '@campaign/shared';
import { SEED_CAMPAIGNS } from './seed';
import type { CampaignRepository } from './repository';
import { DraftPersistence } from '../features/creation/draftPersistence';

const USER_CAMPAIGN_STORAGE_KEY = 'campaignamp.campaigns.v1';
const FEEDBACK_STORAGE_KEY = 'campaignamp.feedback.v1';
const REVIEW_EVENT_STORAGE_KEY = 'campaignamp.reviewevents.v1';

async function readArray<T>(key: string): Promise<T[]> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

/**
 * Offline, on-device repository used when Demo Mode is active (no API
 * configured). Seeded campaigns are read-only; user-submitted campaigns,
 * drafts, feedback, and review events persist in AsyncStorage.
 */
export class LocalCampaignRepository implements CampaignRepository {
  private readonly seed: Campaign[] = [...SEED_CAMPAIGNS];
  private readonly drafts = new DraftPersistence(AsyncStorage);
  private userCampaigns: Campaign[] | null = null;

  private async loadUserCampaigns(): Promise<Campaign[]> {
    if (this.userCampaigns) {
      return this.userCampaigns;
    }
    this.userCampaigns = await readArray<Campaign>(USER_CAMPAIGN_STORAGE_KEY);
    return this.userCampaigns;
  }

  async listCampaigns(query: CampaignQuery = {}): Promise<Campaign[]> {
    const user = await this.loadUserCampaigns();
    return filterAndSortCampaigns([...user, ...this.seed], query);
  }

  async getCampaign(id: string): Promise<Campaign | null> {
    const user = await this.loadUserCampaigns();
    return user.find((c) => c.id === id) ?? this.seed.find((c) => c.id === id) ?? null;
  }

  async saveCampaign(campaign: Campaign): Promise<Campaign> {
    const user = await this.loadUserCampaigns();
    const next = upsertById(user, campaign);
    this.userCampaigns = next;
    await AsyncStorage.setItem(USER_CAMPAIGN_STORAGE_KEY, JSON.stringify(next));
    return campaign;
  }

  async listDrafts(): Promise<CampaignDraft[]> {
    return this.drafts.list();
  }

  async getDraft(id: string): Promise<CampaignDraft | null> {
    return this.drafts.get(id);
  }

  async saveDraft(draft: CampaignDraft): Promise<CampaignDraft> {
    return this.drafts.save(draft);
  }

  async deleteDraft(id: string): Promise<void> {
    return this.drafts.delete(id);
  }

  async saveFeedback(feedback: Feedback): Promise<Feedback> {
    const all = await readArray<Feedback>(FEEDBACK_STORAGE_KEY);
    await AsyncStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(upsertById(all, feedback)));
    return feedback;
  }

  async listFeedback(campaignId?: string): Promise<Feedback[]> {
    const all = await readArray<Feedback>(FEEDBACK_STORAGE_KEY);
    const filtered = campaignId ? all.filter((entry) => entry.campaignId === campaignId) : all;
    return filtered.slice().sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }

  async saveReviewEvent(event: ReviewEvent): Promise<ReviewEvent> {
    const all = await readArray<ReviewEvent>(REVIEW_EVENT_STORAGE_KEY);
    await AsyncStorage.setItem(REVIEW_EVENT_STORAGE_KEY, JSON.stringify(upsertById(all, event)));
    return event;
  }

  async listReviewEvents(campaignId?: string): Promise<ReviewEvent[]> {
    const all = await readArray<ReviewEvent>(REVIEW_EVENT_STORAGE_KEY);
    const filtered = campaignId ? all.filter((event) => event.campaignId === campaignId) : all;
    return filtered.slice().sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  }
}

export const localRepository = new LocalCampaignRepository();
