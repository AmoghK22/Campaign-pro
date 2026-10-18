import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../theme';

type BadgeTone = 'demo' | 'estimate' | 'simulated';

const BADGE_META: Record<BadgeTone, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  demo: { label: 'Demo mode', icon: 'flask-outline' },
  estimate: { label: 'Estimate, not a guarantee', icon: 'information-circle-outline' },
  simulated: { label: 'Simulated', icon: 'construct-outline' },
};

interface DemoBadgeProps {
  tone?: BadgeTone;
  label?: string;
}

/**
 * Consistent, honest label used wherever behavior is simulated, estimated,
 * or running on seeded demo data. Never use it to imply a real transaction.
 */
export function DemoBadge({ tone = 'demo', label }: DemoBadgeProps) {
  const meta = BADGE_META[tone];
  const text = label ?? meta.label;
  return (
    <View style={styles.badge} accessibilityLabel={text}>
      <Ionicons name={meta.icon} size={13} color={colors.accent} />
      <AppText variant="caption" color={colors.accent}>
        {text}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.accentMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});
