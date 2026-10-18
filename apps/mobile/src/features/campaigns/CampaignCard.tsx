import React from 'react';
import { StyleSheet, View } from 'react-native';
import { estimateImpressionsForGoal, formatImpressions, formatINR, type Campaign } from '@campaign/shared';
import { AppText, Card, ProgressBar, StatusPill } from '../../components';
import { CampaignImage } from './CampaignImage';
import { colors, radius, spacing } from '../../theme';

interface CampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
}

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const impressionsAtGoal = estimateImpressionsForGoal(campaign.fundingGoal);

  return (
    <Card onPress={onPress} accessibilityLabel={`${campaign.title} by ${campaign.creatorName}`}>
      <CampaignImage
        imageKey={campaign.coverImageKey}
        uri={campaign.coverImageUri}
        style={styles.image}
        accessibilityLabel={`Cover image for ${campaign.title}`}
      />
      <View style={styles.row}>
        <AppText variant="caption" color={colors.primary}>
          {campaign.category.toUpperCase()}
        </AppText>
        <StatusPill status={campaign.status} size="small" />
      </View>
      <AppText variant="heading">{campaign.title}</AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        by {campaign.creatorName}
      </AppText>
      <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={3}>
        {campaign.summary}
      </AppText>
      <View style={styles.spacer} />
      <ProgressBar
        value={campaign.fundingRaised}
        max={campaign.fundingGoal}
        accessibilityLabel={`${formatINR(campaign.fundingRaised)} raised of ${formatINR(campaign.fundingGoal)}`}
        label={`${formatINR(campaign.fundingRaised)} of ${formatINR(campaign.fundingGoal)}`}
      />
      <AppText variant="caption" color={colors.textSecondary}>
        ~{formatImpressions(impressionsAtGoal)} estimated impressions at goal (demo estimate, not
        guaranteed)
      </AppText>
      <AppText variant="caption" color={colors.textMuted}>
        Estimated impressions are not unique people reached.
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 168,
    borderRadius: radius.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  spacer: {
    height: spacing.xs,
  },
});

