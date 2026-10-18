import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { colors, spacing } from '../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: StyleProp<ViewStyle>;
}

export function ScreenContainer({
  children,
  title,
  subtitle,
  headerRight,
  scroll = true,
  padded = true,
  edges = ['top'],
  contentStyle,
}: ScreenContainerProps) {
  const header =
    title || subtitle || headerRight ? (
      <View style={styles.header}>
        <View style={styles.headerText}>
          {title ? (
            <AppText variant="title" accessibilityRole="header">
              {title}
            </AppText>
          ) : null}
          {subtitle ? (
            <AppText variant="bodySmall" color={colors.textSecondary}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {headerRight}
      </View>
    ) : null;

  const body = (
    <>
      {header}
      {children}
    </>
  );

  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              styles.content,
              padded && styles.padded,
              contentStyle,
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            {body}
          </ScrollView>
        ) : (
          <View style={[styles.flex, styles.content, padded && styles.padded, contentStyle]}>
            {body}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    gap: spacing.lg,
  },
  padded: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
});
