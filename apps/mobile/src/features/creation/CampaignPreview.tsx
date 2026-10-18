import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DEMO_ASSUMPTION_NOTES,
  calculateUseOfFunds,
  estimateImpressionsForGoal,
  formatImpressions,
  formatINR,
  isValidHttpUrl,
  type CampaignDraft,
} from '@campaign/shared';
import { AppText, Card, DemoBadge, SectionHeader } from '../../components';
import { CampaignImage } from '../campaigns/CampaignImage';
import { channelLabel } from './options';
import { colors, radius, spacing } from '../../theme';

/**
 * Read-only rendering of exactly what would be submitted. Used by the Submit
 * step review and the standalone Preview screen so both always match.
 */
export function CampaignPreview({ draft }: { draft: CampaignDraft }) {
  const useOfFunds = calculateUseOfFunds(
    draft.distributionBudget > 0 ? draft.distributionBudget : 1,
    draft.budgetAllocation,
  );
  const goalImpressions = draft.fundingGoal > 0 ? estimateImpressionsForGoal(draft.fundingGoal) : 0;

  return (
    <>
      <Card>
        <SectionHeader title="Basics" />
        <PreviewRow label="Title" value={draft.title || 'Untitled campaign'} />
        <PreviewRow label="Category" value={draft.category ?? 'Not set'} />
        <PreviewRow label="Creator" value={draft.creatorName || 'Not set'} />
        <PreviewRow label="Summary" value={draft.summary || 'Not set'} />
        {draft.whatItsAbout ? <PreviewRow label="What it is about" value={draft.whatItsAbout} /> : null}
        {draft.whoItShouldReach ? (
          <PreviewRow label="Who it should reach" value={draft.whoItShouldReach} />
        ) : null}
        {draft.whyItMatters ? <PreviewRow label="Why it matters" value={draft.whyItMatters} /> : null}
        {draft.evidence ? <PreviewRow label="Supporting evidence" value={draft.evidence} /> : null}
        <AppText variant="caption" color={colors.textMuted}>
          The title is used as the advertising headline unless a separate ad headline is provided in step
          3.
        </AppText>
      </Card>

      <Card>
        <SectionHeader title="Story" subtitle="Editorial content, separate from the ad creative" />
        <AppText variant="subheading">{draft.storyHeadline || 'Story headline'}</AppText>
        <AppText variant="body">{draft.storyIntro || 'Introduction'}</AppText>
        {draft.storySections.map((section, index) => (
          <View key={section.id} style={styles.section}>
            <AppText variant="label">
              {index + 1}. {section.heading || 'Untitled section'}
            </AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              {section.body || '—'}
            </AppText>
          </View>
        ))}
        {draft.storyImages.map((image) => (
          <View key={image.id} style={styles.storyImage}>
            <CampaignImage imageKey={image.imageKey} uri={image.uri} style={styles.image} />
            <AppText variant="caption" color={colors.textSecondary}>
              {image.caption || 'No caption'}
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {image.credit || 'No credit'}
            </AppText>
          </View>
        ))}
        {draft.statistics.length > 0 ? (
          <View style={styles.stats}>
            {draft.statistics.map((stat) => (
              <View key={stat.id} style={styles.stat}>
                <AppText variant="label">{stat.value || '—'}</AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {stat.label || 'Statistic'}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}
        {draft.audienceActions.length > 0 ? (
          <View>
            <AppText variant="label">Suggested actions</AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              {draft.audienceActions.join(' · ')}
            </AppText>
          </View>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title="Sources" subtitle="Shown publicly on the campaign page" />
        {draft.sources.length === 0 ? (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            No sources added.
          </AppText>
        ) : (
          draft.sources.map((source) => (
            <View key={source.id} style={styles.sourceRow}>
              <AppText variant="bodySmall" style={styles.flex}>
                {source.title || 'Untitled source'}
              </AppText>
              <AppText
                variant="caption"
                color={isValidHttpUrl(source.url) ? colors.info : colors.error}
              >
                {isValidHttpUrl(source.url) ? source.url : 'Invalid link'}
              </AppText>
            </View>
          ))
        )}
      </Card>

      <Card>
        <SectionHeader title="Campaign & ad visuals" />
        <AppText variant="label">Cover artwork</AppText>
        <CampaignImage imageKey={draft.coverImageKey} uri={draft.coverImageUri} style={styles.image} />
        <AppText variant="label">Ad creative</AppText>
        <CampaignImage imageKey={draft.adImageKey} uri={draft.adImageUri} style={styles.image} />
        <View style={styles.adMock}>
          <DemoBadge tone="simulated" label="Placement preview" />
          <AppText variant="subheading">{draft.adHeadline || 'Ad headline'}</AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            {draft.adDescription || 'Ad description'}
          </AppText>
          <View style={styles.ctaButton}>
            <AppText variant="label" color={colors.textOnPrimary}>
              {draft.callToAction || 'Learn more'}
            </AppText>
          </View>
        </View>
      </Card>

      <Card>
        <SectionHeader title="Audience & distribution" />
        <PreviewRow label="Locations" value={draft.targetLocations.join(', ') || 'Not set'} />
        <PreviewRow
          label="Interests"
          value={draft.audienceInterests.map((interest) => `#${interest}`).join('  ') || 'Not set'}
        />
        <PreviewRow
          label="Channels"
          value={draft.channels.map((channel) => channelLabel(channel)).join(', ') || 'Not set'}
        />
        <PreviewRow label="Duration" value={`${draft.durationDays} days`} />
        <PreviewRow label="Proposed budget" value={formatINR(draft.distributionBudget)} />
      </Card>

      <Card>
        <SectionHeader title="Reach estimate" subtitle="Demo estimate, not a guarantee" />
        <AppText variant="bodySmall" color={colors.textSecondary}>
          At the proposed budget of {formatINR(draft.distributionBudget)}: about{' '}
          {formatImpressions(useOfFunds.estimatedImpressions)} estimated impressions.
        </AppText>
        {goalImpressions > 0 ? (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            At the funding goal of {formatINR(draft.fundingGoal)}: about{' '}
            {formatImpressions(goalImpressions)} estimated impressions.
          </AppText>
        ) : null}
        <DemoBadge tone="estimate" />
        <AppText variant="caption" color={colors.textSecondary}>
          {DEMO_ASSUMPTION_NOTES.impressions}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {DEMO_ASSUMPTION_NOTES.reach}
        </AppText>
      </Card>
    </>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText variant="caption" color={colors.textSecondary} style={styles.rowLabel}>
        {label}
      </AppText>
      <AppText variant="bodySmall" style={styles.flex}>
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  section: {
    gap: spacing.xxs,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    paddingLeft: spacing.md,
  },
  storyImage: {
    gap: spacing.xs,
  },
  image: {
    height: 170,
    borderRadius: radius.md,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  stat: {
    gap: spacing.xxs,
  },
  sourceRow: {
    gap: spacing.xxs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  adMock: {
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    backgroundColor: colors.surfaceMuted,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rowLabel: {
    width: 118,
  },
});
