import React from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Button,
  DemoBadge,
  LoadingState,
  ScreenContainer,
} from '../../../src/components';
import { CampaignPreview } from '../../../src/features/creation/CampaignPreview';
import { MissingDraft } from '../../../src/features/creation/MissingDraft';
import { useActiveDraft } from '../../../src/features/creation/useActiveDraft';

export default function PreviewScreen() {
  const params = useLocalSearchParams<{ draftId: string }>();
  const draftId = String(params.draftId);
  const { draft, missing } = useActiveDraft(draftId);

  if (missing) {
    return <MissingDraft />;
  }
  if (!draft) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Loading preview…" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      title="Campaign preview"
      subtitle="Exactly what will be submitted — nothing is live yet."
    >
      <Button
        label="Back to Submit"
        onPress={() => router.back()}
        variant="ghost"
        size="medium"
        icon="arrow-back"
      />
      <DemoBadge tone="simulated" label="Draft preview — not submitted" />
      <CampaignPreview draft={draft} />
      <Button label="Back to Submit" onPress={() => router.back()} variant="secondary" size="medium" />
    </ScreenContainer>
  );
}
