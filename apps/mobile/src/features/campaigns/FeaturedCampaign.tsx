import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  estimateImpressionsForGoal,
  formatImpressions,
  formatINR,
  type Campaign,
} from '@campaign/shared';
import { AppText, Button, Card, DemoBadge, ProgressBar, StatusPill } from '../../components';
import { CampaignImage } from './CampaignImage';
import { colors, radius, spacing } from '../../theme';

interface FeaturedCampaignProps {
  campaign: Campaign;
  onPress: () => void;
}

/** The editorial hero on Home: one campaign, presented large and clearly. */
export function FeaturedCampaign({ campaign, onPress }: FeaturedCampaignProps) {
  return (
    <Card style={styles.card}>
      <CampaignImage
        imageKey={campaign.coverImageKey}
        uri={campaign.coverImageUri}
        style={styles.image}
        accessibilityLabel={`Cover image for ${campaign.title}`}
      />
      <View style={styles.metaRow}>
        <AppText variant="overline" color={colors.primary}>
          Featured · {campaign.category.toUpperCase()}
        </AppText>
        <StatusPill status={campaign.status} size="small" />
      </View>
      <AppText variant="title">{campaign.title}</AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        by {campaign.creatorName}
      </AppText>
      <AppText variant="bodySmall" color={colors.textSecondary}>
        {campaign.summary}
      </AppText>
      <ProgressBar
        value={campaign.fundingRaised}
        max={campaign.fundingGoal}
        label={`${formatINR(campaign.fundingRaised)} of ${formatINR(campaign.fundingGoal)}`}
        accessibilityLabel={`${formatINR(campaign.fundingRaised)} raised of ${formatINR(campaign.fundingGoal)}`}
      />
      <AppText variant="caption" color={colors.textSecondary}>
        ~{formatImpressions(estimateImpressionsForGoal(campaign.fundingGoal))} estimated impressions at
        goal (demo estimate, not guaranteed — not unique people reached).
      </AppText>
      <DemoBadge tone="estimate" />
      <Button label="View campaign" onPress={onPress} icon="arrow-forward" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  image: {
    height: 208,
    borderRadius: radius.lg,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
