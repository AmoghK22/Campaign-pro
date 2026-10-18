import { useEffect, useState } from 'react';
import { useDraftsStore } from '../../store';
import type { CampaignDraft } from '@campaign/shared';

interface ActiveDraftResult {
  draft: CampaignDraft | null;
  /** True when the requested draft id no longer exists (deleted elsewhere). */
  missing: boolean;
}

/**
 * Resolves the draft for a wizard route and keeps it in sync with the store.
 * The store (backed by the repository) is the single source of truth, so every
 * step reads the same fields and going back never loses input.
 */
export function useActiveDraft(draftId: string): ActiveDraftResult {
  const activeDraft = useDraftsStore((state) => state.activeDraft);
  const openDraft = useDraftsStore((state) => state.openDraft);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void openDraft(draftId).then((draft) => {
      if (!cancelled) {
        setMissing(draft === null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [draftId, openDraft]);

  const draft = activeDraft && activeDraft.id === draftId ? activeDraft : null;
  return { draft, missing };
}
