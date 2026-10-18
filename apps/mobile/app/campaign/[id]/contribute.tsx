import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { formatINR, type Campaign } from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  DemoBadge,
  ErrorState,
  LoadingState,
  ScreenContainer,
} from '../../../src/components';
import { getCampaignRepository } from '../../../src/services';
import { colors, spacing } from '../../../src/theme';

/**
 * Honest placeholder for the contribution flow (implemented in Phase 4).
 * It deliberately performs NO payment and fabricates NO success state.
 */
export default function ContributePlaceholderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    async function run() {
      try {
        const result = await getCampaignRepository().getCampaign(String(id));
        if (active) {
          setCampaign(result);
          setStatus('ready');
        }
      } catch {
        if (active) {
          setStatus('error');
        }
      }
    }
    void run();
    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Loading campaign…" />
      </ScreenContainer>
    );
  }

  if (status === 'error' || !campaign) {
    return (
      <ScreenContainer>
        <ErrorState
          title="Campaign not found"
          message="This campaign id does not exist in the demo repository."
          onRetry={() => router.replace('/explore')}
          retryLabel="Go to Explore"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer title="Contribution" subtitle={campaign.title}>
      <Button
        label="Back to campaign"
        onPress={() => router.back()}
        variant="ghost"
        icon="arrow-back"
        size="medium"
        style={styles.backButton}
      />

      <Card style={styles.noticeCard}>
        <DemoBadge tone="simulated" label="Not yet available" />
        <AppText variant="subheading">The contribution flow opens in the next phase</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          In Phase 4 this screen becomes amount → review → simulated checkout → receipt. Nothing here
          charges money, and no success is faked. We keep it honest rather than showing a button that
          pretends to work.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subheading">What will happen here</AppText>
        <View style={styles.list}>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            1. Choose a preset or custom amount.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            2. See the illustrative fee and estimated impressions before confirming.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            3. Complete a clearly labelled demo checkout and get a receipt.
          </AppText>
        </View>
        <AppText variant="caption" color={colors.textMuted}>
          Funding goal for reference: {formatINR(campaign.fundingGoal)}. Contributions fund message
          distribution, not the cause directly.
        </AppText>
      </Card>

      <Button
        label="Back to campaign"
        onPress={() => router.back()}
        variant="secondary"
        icon="arrow-back"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
  },
  noticeCard: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentMuted,
  },
  list: {
    gap: spacing.xs,
  },
});
