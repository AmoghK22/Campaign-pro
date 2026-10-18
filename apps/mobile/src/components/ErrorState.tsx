import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { Button } from './Button';
import { colors, radius, spacing } from '../theme';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <Ionicons name="alert-circle-outline" size={26} color={colors.error} />
      <View style={styles.text}>
        <AppText variant="subheading" color={colors.error}>
          {title}
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {message}
        </AppText>
      </View>
      {onRetry ? (
        <Button label={retryLabel} onPress={onRetry} variant="secondary" size="medium" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
    backgroundColor: colors.errorMuted,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  text: {
    gap: spacing.xxs,
  },
});
