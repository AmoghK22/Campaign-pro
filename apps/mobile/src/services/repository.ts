import type { Campaign, CampaignDraft, CampaignQuery, Feedback, ReviewEvent } from '@campaign/shared';

/**
 * Single data-access contract for the whole app. Screens never talk to
 * AsyncStorage or fetch() directly; they use a repository so the local Demo
 * Mode and a future API mode stay interchangeable.
 */
export interface CampaignRepository {
  listCampaigns(query?: CampaignQuery): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | null>;
  /** Upsert a campaign (used when a draft is submitted for review). */
  saveCampaign(campaign: Campaign): Promise<Campaign>;

  saveDraft(draft: CampaignDraft): Promise<CampaignDraft>;
  getDraft(id: string): Promise<CampaignDraft | null>;
  listDrafts(): Promise<CampaignDraft[]>;
  deleteDraft(id: string): Promise<void>;

  saveFeedback(feedback: Feedback): Promise<Feedback>;
  listFeedback(campaignId?: string): Promise<Feedback[]>;

  saveReviewEvent(event: ReviewEvent): Promise<ReviewEvent>;
  listReviewEvents(campaignId?: string): Promise<ReviewEvent[]>;
}
