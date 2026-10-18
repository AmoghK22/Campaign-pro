import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../theme';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  accessibilityLabel?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  accessibilityLabel,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const ratio = Math.min(Math.max(value / safeMax, 0), 1);
  const percent = Math.round(ratio * 100);

  return (
    <View style={styles.container} accessibilityLabel={accessibilityLabel ?? label}>
      {label || showPercent ? (
        <View style={styles.header}>
          {label ? (
            <AppText variant="caption" color={colors.textSecondary}>
              {label}
            </AppText>
          ) : (
            <View />
          )}
          {showPercent ? (
            <AppText variant="caption" color={colors.textSecondary}>
              {percent}%
            </AppText>
          ) : null}
        </View>
      ) : null}
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  track: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
});
