import React from 'react';
import { AppText, Card, DemoBadge, ScreenContainer } from '../../src/components';
import { colors } from '../../src/theme';
import { useAppStore } from '../../src/store';

export default function ProfileScreen() {
  const guestKey = useAppStore((state) => state.guestKey);

  return (
    <ScreenContainer
      title="Profile"
      subtitle="Demo identity without sign-up. Browsing never requires an account."
      headerRight={<DemoBadge />}
    >
      <Card>
        <AppText variant="subheading">Guest identity</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          You are browsing as a local demo guest. No email or payment details are collected.
        </AppText>
        {guestKey ? (
          <AppText variant="caption" color={colors.textMuted}>
            Guest key: {guestKey}
          </AppText>
        ) : null}
      </Card>

      <Card>
        <AppText variant="subheading">Coming in Phase 5</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Created, backed, saved, and followed campaigns, plus private payment history and settings.
        </AppText>
      </Card>
    </ScreenContainer>
  );
}
