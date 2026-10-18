import React, { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string | null;
  rightAdornment?: React.ReactNode;
  containerStyle?: StyleProp<TextStyle>;
}

type TextInputRef = React.ComponentRef<typeof TextInput>;

export const Input = forwardRef<TextInputRef, InputProps>(function Input(
  { label, hint, error, rightAdornment, containerStyle, multiline, ...rest },
  ref,
) {
  return (
    <View style={[styles.container, containerStyle]}>
      {label ? (
        <AppText variant="label" style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View
        style={[
          styles.inputShell,
          multiline && styles.multilineShell,
          !!error && styles.inputShellError,
        ]}
      >
        <TextInput
          ref={ref}
          style={[styles.input, multiline && styles.multilineInput]}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          accessibilityLabel={label ?? rest.accessibilityLabel}
          {...rest}
        />
        {rightAdornment ? <View style={styles.adornment}>{rightAdornment}</View> : null}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.message}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.message}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    marginBottom: spacing.xxs,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  multilineShell: {
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
  },
  inputShellError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
  multilineInput: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  adornment: {
    marginLeft: spacing.sm,
  },
  message: {
    marginTop: spacing.xxs,
  },
});
