import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors, radius, spacing, touchTarget } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'medium' | 'large';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  icon,
  accessibilityLabel,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = getPalette(variant, isDisabled);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        size === 'large' ? styles.large : styles.medium,
        { backgroundColor: palette.background, borderColor: palette.border },
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={palette.text} /> : null}
          <AppText variant="label" color={palette.text} style={styles.label}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

function getPalette(variant: ButtonVariant, disabled: boolean) {
  if (disabled) {
    return {
      background: colors.disabledSurface,
      border: colors.disabledSurface,
      text: colors.disabled,
    };
  }
  switch (variant) {
    case 'primary':
      return { background: colors.primary, border: colors.primary, text: colors.textOnPrimary };
    case 'secondary':
      return { background: colors.surface, border: colors.primary, text: colors.primary };
    case 'danger':
      return { background: colors.errorMuted, border: colors.error, text: colors.error };
    case 'ghost':
    default:
      return { background: 'transparent', border: 'transparent', text: colors.primary };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
  },
  large: {
    minHeight: touchTarget + 4,
  },
  medium: {
    minHeight: touchTarget - 4,
    paddingHorizontal: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  label: {
    textAlign: 'center',
  },
});
