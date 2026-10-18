import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import type { CampaignStatus } from '@campaign/shared';
import { colors, radius, spacing } from '../theme';

type Tone = 'neutral' | 'pending' | 'active' | 'success' | 'error' | 'info';

const STATUS_META: Record<CampaignStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: 'Draft', tone: 'neutral' },
  SUBMITTED_FOR_REVIEW: { label: 'In review', tone: 'pending' },
  CHANGES_REQUESTED: { label: 'Changes requested', tone: 'pending' },
  APPROVED: { label: 'Approved', tone: 'info' },
  AVAILABLE_FOR_FUNDING: { label: 'Open for funding', tone: 'info' },
  FUNDING: { label: 'Funding', tone: 'active' },
  FUNDING_GOAL_REACHED: { label: 'Goal reached', tone: 'success' },
  FUNDING_PERIOD_ENDED: { label: 'Funding ended', tone: 'neutral' },
  DISTRIBUTION_PREPARATION: { label: 'Preparing distribution', tone: 'pending' },
  PROMOTING: { label: 'Promoting', tone: 'active' },
  COMPLETED: { label: 'Completed', tone: 'success' },
  REJECTED: { label: 'Not approved', tone: 'error' },
  CANCELLED: { label: 'Cancelled', tone: 'neutral' },
  REFUND_PENDING: { label: 'Refund pending', tone: 'pending' },
  FAILED: { label: 'Failed', tone: 'error' },
};

const TONE_COLORS: Record<Tone, { background: string; text: string }> = {
  neutral: { background: colors.surfaceMuted, text: colors.textSecondary },
  pending: { background: colors.accentMuted, text: colors.accent },
  active: { background: colors.primaryMuted, text: colors.primary },
  success: { background: colors.successMuted, text: colors.success },
  error: { background: colors.errorMuted, text: colors.error },
  info: { background: colors.infoMuted, text: colors.info },
};

export function statusLabel(status: CampaignStatus): string {
  return STATUS_META[status].label;
}

interface StatusPillProps {
  status: CampaignStatus;
  size?: 'small' | 'medium';
}

export function StatusPill({ status, size = 'medium' }: StatusPillProps) {
  const meta = STATUS_META[status];
  const palette = TONE_COLORS[meta.tone];
  return (
    <View style={[styles.pill, size === 'small' && styles.small, { backgroundColor: palette.background }]}>
      <AppText variant={size === 'small' ? 'caption' : 'label'} color={palette.text}>
        {meta.label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  small: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
  },
});
