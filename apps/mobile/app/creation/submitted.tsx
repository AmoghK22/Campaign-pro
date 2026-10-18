import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime, type Campaign, type ReviewEvent } from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  ErrorState,
  LoadingState,
  ScreenContainer,
  StatusPill,
  statusLabel,
} from '../../src/components';
import { getCampaignRepository } from '../../src/services';
import { useCampaignsStore } from '../../src/store';
import { colors, spacing } from '../../src/theme';

export default function SubmittedScreen() {
  const params = useLocalSearchParams<{ campaignId: string }>();
  const campaignId = String(params.campaignId);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [events, setEvents] = useState<ReviewEvent[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const loadCampaigns = useCampaignsStore((state) => state.load);

  useEffect(() => {
    let active = true;
    async function run() {
      setStatus('loading');
      try {
        const repository = getCampaignRepository();
        const [campaignResult, eventResult] = await Promise.all([
          repository.getCampaign(campaignId),
          repository.listReviewEvents(campaignId),
        ]);
        if (!active) {
          return;
        }
        setCampaign(campaignResult);
        setEvents([...eventResult].sort((a, b) => a.createdAt.localeCompare(b.createdAt)));
        setStatus(campaignResult ? 'ready' : 'error');
        void loadCampaigns({ force: true });
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
  }, [campaignId, loadCampaigns]);

  if (status === 'loading') {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Confirming submission…" />
      </ScreenContainer>
    );
  }

  if (status === 'error' || !campaign) {
    return (
      <ScreenContainer>
        <ErrorState
          title="Submission not found"
          message="We could not load the submitted campaign from this device."
          onRetry={() => router.replace('/')}
          retryLabel="Back to Home"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer subtitle="Your campaign is now waiting for review.">
      <Card style={styles.successCard}>
        <Ionicons name="checkmark-circle" size={32} color={colors.success} />
        <AppText variant="title">Submitted for review</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {campaign.title}
        </AppText>
        <View style={styles.pillRow}>
          <StatusPill status={campaign.status} />
          <AppText variant="caption" color={colors.textMuted}>
            {formatDateTime(campaign.submittedAt) || 'Just now'}
          </AppText>
        </View>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          This does not start advertising and is not auto-approved. A reviewer decides what happens next.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subheading">Review history</AppText>
        {events.length === 0 ? (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            No review events recorded yet.
          </AppText>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.timelineRow}>
              <View style={styles.timelineDot} />
              <View style={styles.flex}>
                <AppText variant="label">{statusLabel(event.newStatus)}</AppText>
                {event.reason ? (
                  <AppText variant="caption" color={colors.textSecondary}>
                    {event.reason}
                  </AppText>
                ) : null}
                <AppText variant="caption" color={colors.textMuted}>
                  {formatDateTime(event.createdAt)} · by {event.actor}
                </AppText>
              </View>
            </View>
          ))
        )}
      </Card>

      <Card>
        <AppText variant="subheading">What happens next</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          1. A reviewer checks the message, sources, and creative.
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          2. If changes are needed, the status becomes “Changes requested”.
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          3. Once approved, the campaign opens for funding — separate from review.
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          Later phases add the review console and the funding flow. Nothing is funded or advertised yet.
        </AppText>
      </Card>

      <Button label="View campaign" onPress={() => router.push(`/campaign/${campaign.id}`)} icon="open-outline" />
      <Button
        label="Back to Home"
        variant="secondary"
        onPress={() => router.replace('/')}
        icon="home-outline"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  successCard: {
    backgroundColor: colors.successMuted,
    borderColor: colors.successMuted,
    alignItems: 'flex-start',
  },
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  timelineRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: colors.primary,
  },
});
