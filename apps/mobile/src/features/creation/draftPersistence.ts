import { removeById, upsertById, type CampaignDraft } from '@campaign/shared';
import type { KeyValueStorage } from '../../services/storage';

export const DRAFT_STORAGE_KEY = 'campaignamp.drafts.v1';

/**
 * Persists campaign drafts behind a tiny storage adapter. Saving the same
 * draft id again updates the existing record (never creates a duplicate), so
 * resuming and editing a draft keeps a single stable id.
 */
export class DraftPersistence {
  constructor(
    private readonly storage: KeyValueStorage,
    private readonly key: string = DRAFT_STORAGE_KEY,
  ) {}

  async list(): Promise<CampaignDraft[]> {
    const drafts = await this.read();
    return drafts.slice().sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  }

  async get(id: string): Promise<CampaignDraft | null> {
    const drafts = await this.read();
    return drafts.find((draft) => draft.id === id) ?? null;
  }

  async save(draft: CampaignDraft): Promise<CampaignDraft> {
    const drafts = await this.read();
    const next = upsertById(drafts, draft);
    await this.write(next);
    return draft;
  }

  async delete(id: string): Promise<void> {
    const drafts = await this.read();
    await this.write(removeById(drafts, id));
  }

  async count(): Promise<number> {
    return (await this.read()).length;
  }

  private async read(): Promise<CampaignDraft[]> {
    try {
      const raw = await this.storage.getItem(this.key);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as CampaignDraft[]) : [];
    } catch {
      return [];
    }
  }

  private async write(drafts: CampaignDraft[]): Promise<void> {
    await this.storage.setItem(this.key, JSON.stringify(drafts));
  }
}
