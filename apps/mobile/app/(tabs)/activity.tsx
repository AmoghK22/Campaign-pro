import React from 'react';
import { AppText, Card, EmptyState, ScreenContainer } from '../../src/components';
import { colors } from '../../src/theme';

export default function ActivityScreen() {
  return (
    <ScreenContainer title="Activity" subtitle="Events, read state, and notification preferences arrive in Phase 5.">
      <EmptyState
        icon="pulse-outline"
        title="No activity yet"
        message="Submission, review, funding, and promotion events will appear here as you use the demo."
      />
      <Card>
        <AppText variant="subheading">What will show up</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Submission received · changes requested · funding milestones · deadline reminders · contribution
          outcomes · promotion progress · completed reports.
        </AppText>
      </Card>
    </ScreenContainer>
  );
}
