import React from 'react';
import { router } from 'expo-router';
import { Button, ErrorState, ScreenContainer } from '../../components';

/**
 * Shown when a wizard route points at a draft that no longer exists (deleted
 * from another screen). Offers a truthful way back instead of a dead end.
 */
export function MissingDraft() {
  return (
    <ScreenContainer>
      <ErrorState
        title="Draft not found"
        message="This draft was deleted or never saved. Start a new campaign to continue."
        onRetry={() => router.replace('/create')}
        retryLabel="Go to Create"
      />
      <Button label="Back" onPress={() => router.back()} variant="ghost" size="medium" />
    </ScreenContainer>
  );
}
