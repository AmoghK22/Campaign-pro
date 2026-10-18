import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors, spacing } from '../theme';

export interface StepIndicatorItem {
  index: number;
  short: string;
}

interface StepIndicatorProps {
  steps: StepIndicatorItem[];
  current: number;
  onPressStep?: (index: number) => void;
}

/**
 * Persistent five-step progress indicator. Completed steps show a check,
 * the current step is filled, and upcoming steps stay muted.
 */
export function StepIndicator({ steps, current, onPressStep }: StepIndicatorProps) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: current }}>
      {steps.map((step, position) => {
        const isDone = step.index < current;
        const isCurrent = step.index === current;
        return (
          <React.Fragment key={step.index}>
            {position > 0 ? (
              <View style={[styles.connector, isDone && styles.connectorDone]} />
            ) : null}
            <View style={styles.step}>
              <View
                style={[styles.dot, isDone && styles.dotDone, isCurrent && styles.dotCurrent]}
                accessibilityLabel={`Step ${step.index} of ${steps.length}: ${step.short}${
                  isCurrent ? ' (current)' : isDone ? ' (complete)' : ''
                }`}
              >
                {isDone ? (
                  <Ionicons name="checkmark" size={14} color={colors.textOnPrimary} />
                ) : (
                  <AppText
                    variant="caption"
                    color={isCurrent ? colors.textOnPrimary : colors.textSecondary}
                  >
                    {step.index}
                  </AppText>
                )}
              </View>
              <AppText
                variant="caption"
                color={isCurrent ? colors.primary : colors.textMuted}
                numberOfLines={1}
                style={styles.label}
                onPress={onPressStep ? () => onPressStep(step.index) : undefined}
              >
                {step.short}
              </AppText>
            </View>
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  step: {
    alignItems: 'center',
    gap: spacing.xxs,
    width: 60,
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dotDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    textAlign: 'center',
  },
  connector: {
    flex: 1,
    height: 2,
    marginTop: 12,
    backgroundColor: colors.border,
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
});
