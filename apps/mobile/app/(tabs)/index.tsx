import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  AppText,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenContainer,
  SectionHeader,
} from '../../src/components';
import { CampaignCard } from '../../src/features/campaigns/CampaignCard';
import { FeaturedCampaign } from '../../src/features/campaigns/FeaturedCampaign';
import {
  selectFeatured,
  selectRecentlyAdded,
  selectRecommended,
} from '../../src/features/campaigns/selectors';
import { DEMO_MODE, DEMO_MODE_MESSAGE } from '../../src/services';
import { useCampaignsStore } from '../../src/store';
import { colors, spacing } from '../../src/theme';

const STEPS = [
  { title: 'Create', body: 'A creator writes the message and sets its audience.' },
  { title: 'Review', body: 'Every campaign is reviewed before it can be funded.' },
  { title: 'Amplify', body: 'Pooled contributions pay to distribute the message widely.' },
];

export default function HomeScreen() {
  const { status, campaigns, error, load } = useCampaignsStore();

  useEffect(() => {
    void load();
  }, [load]);

  const isLoading = status === 'loading' || status === 'idle';
  const featured = selectFeatured(campaigns);
  const recommended = selectRecommended(campaigns, { excludeId: featured?.id, limit: 3 });
  const recent = selectRecentlyAdded(campaigns, { excludeId: featured?.id, limit: 3 });

  return (
    <ScreenContainer
      title="Amplify what matters"
      subtitle="Pool money to send an important message far beyond the creator's own network."
      headerRight={DEMO_MODE ? <DemoBadge /> : undefined}
    >
      {isLoading ? <LoadingState message="Loading demo campaigns…" /> : null}

      {status === 'error' ? (
        <ErrorState message={error ?? 'Unknown error'} onRetry={() => void load({ force: true })} />
      ) : null}

      {status === 'ready' && campaigns.length === 0 ? (
        <EmptyState
          icon="albums-outline"
          title="No campaigns yet"
          message="The demo repository has no campaigns. Reload to try again."
          actionLabel="Reload"
          onAction={() => void load({ force: true })}
        />
      ) : null}

      {status === 'ready' && featured ? (
        <FeaturedCampaign
          campaign={featured}
          onPress={() => router.push(`/campaign/${featured.id}`)}
        />
      ) : null}

      {status === 'ready' ? (
        <Card>
          <AppText variant="subheading">How it works</AppText>
          {STEPS.map((step, index) => (
            <View key={step.title} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <AppText variant="caption" color={colors.textOnPrimary}>
                  {index + 1}
                </AppText>
              </View>
              <View style={styles.stepText}>
                <AppText variant="label">{step.title}</AppText>
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  {step.body}
                </AppText>
              </View>
            </View>
          ))}
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Contributions pay for message distribution and amplification — never a direct donation to the
            cause, person, or organisation named in the message.
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            Demo estimate: about 100 estimated impressions per ₹1 of amplification budget. Impressions are
            not unique people, and nothing here is guaranteed.
          </AppText>
          <View style={styles.actions}>
            <Button
              label="Explore campaigns"
              onPress={() => router.push('/explore')}
              icon="search-outline"
            />
            <Button
              label="Start a campaign"
              onPress={() => router.push('/create')}
              variant="secondary"
              icon="add-circle-outline"
            />
          </View>
        </Card>
      ) : null}

      {status === 'ready' && recommended.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Recommended for you"
            subtitle="Suggested mix: categories and creators you have not seen yet"
            actionLabel="See all"
            onAction={() => router.push('/explore')}
          />
          {recommended.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPress={() => router.push(`/campaign/${campaign.id}`)}
            />
          ))}
        </View>
      ) : null}

      {status === 'ready' && recent.length > 0 ? (
        <View style={styles.section}>
          <SectionHeader
            title="Recently added"
            subtitle="Newest campaigns in the demo repository"
            actionLabel="See all"
            onAction={() => router.push('/explore')}
          />
          {recent.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPress={() => router.push(`/campaign/${campaign.id}`)}
            />
          ))}
        </View>
      ) : null}

      <AppText variant="caption" color={colors.textMuted}>
        {DEMO_MODE ? DEMO_MODE_MESSAGE : ''}
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  stepText: {
    flex: 1,
    gap: spacing.xxs,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  section: {
    gap: spacing.md,
  },
});
