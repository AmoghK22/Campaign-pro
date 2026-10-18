import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  AppText,
  Button,
  StepIndicator,
  type StepIndicatorItem,
} from '../../components';
import type { CampaignDraft } from '@campaign/shared';
import { colors, spacing } from '../../theme';
import { useDraftsStore } from '../../store';
import { WIZARD_STEPS, stepMeta } from './steps';

interface WizardScaffoldProps {
  draft: CampaignDraft;
  step: number;
  children: React.ReactNode;
  footer: React.ReactNode;
  onBack: () => void;
  onStepPress?: (index: number) => void;
}

function useSaveLabel(): { text: string; color: string } {
  const saveStatus = useDraftsStore((state) => state.saveStatus);
  const lastSavedAt = useDraftsStore((state) => state.lastSavedAt);
  if (saveStatus === 'saving') {
    return { text: 'Saving…', color: colors.textSecondary };
  }
  if (saveStatus === 'error') {
    return { text: "Couldn't save — retry", color: colors.error };
  }
  if (saveStatus === 'saved' && lastSavedAt) {
    const time = new Date(lastSavedAt);
    const hh = String(time.getHours()).padStart(2, '0');
    const mm = String(time.getMinutes()).padStart(2, '0');
    return { text: `Saved ${hh}:${mm}`, color: colors.success };
  }
  return { text: 'Not saved yet', color: colors.textMuted };
}

/**
 * Shared chrome for every wizard step: the persistent progress indicator, the
 * autosave status, a scrollable body, and a fixed action footer.
 */
export function WizardScaffold({
  draft,
  step,
  children,
  footer,
  onBack,
  onStepPress,
}: WizardScaffoldProps) {
  const meta = stepMeta(step);
  const save = useSaveLabel();
  const steps: StepIndicatorItem[] = WIZARD_STEPS.map((entry) => ({
    index: entry.index,
    short: entry.short,
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Button
            label="Back"
            onPress={onBack}
            variant="ghost"
            size="medium"
            icon="arrow-back"
            accessibilityLabel="Go back"
            style={styles.backButton}
          />
          <View style={styles.saveStatus}>
            <Ionicons name="cloud-done-outline" size={14} color={save.color} />
            <AppText variant="caption" color={save.color}>
              {save.text}
            </AppText>
          </View>
        </View>

        <View style={styles.stepHeader}>
          <AppText variant="overline" color={colors.primary}>
            STEP {step} OF {WIZARD_STEPS.length}
          </AppText>
          <AppText variant="title" accessibilityRole="header">
            {meta.title}
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            {meta.blurb}
          </AppText>
        </View>

        <StepIndicator steps={steps} current={step} onPressStep={onStepPress} />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          {children}
        </ScrollView>

        <View style={styles.footer}>{footer}</View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backButton: {
    paddingHorizontal: spacing.sm,
  },
  saveStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    gap: spacing.xxs,
  },
  content: {
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  footer: {
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
});
