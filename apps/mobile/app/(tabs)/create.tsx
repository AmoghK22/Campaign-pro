import React, { useEffect } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { formatDateTime, type CampaignDraft } from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  DemoBadge,
  EmptyState,
  ErrorState,
  LoadingState,
  ScreenContainer,
  SectionHeader,
} from '../../src/components';
import { useAppStore, useDraftsStore } from '../../src/store';
import { WIZARD_STEPS, stepMeta } from '../../src/features/creation/steps';
import { isStepValid } from '../../src/features/creation/validation';
import { colors, spacing } from '../../src/theme';

export default function CreateScreen() {
  const { status, drafts, error, load, createDraft, deleteDraft, openDraft } = useDraftsStore();
  const ensureGuestKey = useAppStore((state) => state.ensureGuestKey);

  useEffect(() => {
    ensureGuestKey();
    void load();
  }, [ensureGuestKey, load]);

  async function startManual() {
    const draft = await createDraft();
    router.push(`/creation/${draft.id}/basics`);
  }

  return (
    <ScreenContainer
      title="Create a campaign"
      subtitle="Five steps, in order: Basics → Story → Visuals → Reach → Submit. Drafts save automatically."
    >
      <Card style={styles.heroCard}>
        <DemoBadge tone="simulated" label="Manual flow" />
        <AppText variant="subheading">Start a new campaign</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Write it yourself step by step, or use the guided voice-style helper to draft the basics. Both
          open the same five-step wizard and you can edit everything.
        </AppText>
        <View style={styles.actions}>
          <Button label="Create manually" onPress={() => void startManual()} icon="create-outline" />
          <Button
            label="Create with your voice"
            onPress={() => router.push('/creation/voice')}
            variant="secondary"
            icon="mic-outline"
          />
        </View>
      </Card>

      <SectionHeader title="Your drafts" subtitle="Saved on this device. Resume any time." />

      {status === 'loading' || status === 'idle' ? <LoadingState message="Loading drafts…" /> : null}

      {status === 'error' ? (
        <ErrorState message={error ?? 'Could not load drafts.'} onRetry={() => void load({ force: true })} />
      ) : null}

      {status === 'ready' && drafts.length === 0 ? (
        <EmptyState
          icon="document-text-outline"
          title="No drafts yet"
          message="Start a campaign above and your progress will be saved here automatically."
        />
      ) : null}

      {status === 'ready'
        ? drafts.map((draft) => (
            <DraftRow
              key={draft.id}
              draft={draft}
              onResume={async () => {
                await openDraft(draft.id);
                router.push(`/creation/${draft.id}/${stepMeta(draft.currentStep).key}`);
              }}
              onDelete={() => confirmDelete(draft, deleteDraft)}
            />
          ))
        : null}

      <AppText variant="caption" color={colors.textMuted}>
        Drafts persist across app restarts. Submitting moves a campaign to “In review” — it is never
        auto-approved or advertised.
      </AppText>
    </ScreenContainer>
  );
}

function DraftRow({
  draft,
  onResume,
  onDelete,
}: {
  draft: CampaignDraft;
  onResume: () => void;
  onDelete: () => void;
}) {
  const validSteps = WIZARD_STEPS.filter((step) => isStepValid(draft, step.key)).length;
  const step = stepMeta(draft.currentStep);

  return (
    <Card>
      <View style={styles.draftHeader}>
        <AppText variant="subheading" style={styles.flex} numberOfLines={1}>
          {draft.title.trim() || 'Untitled campaign'}
        </AppText>
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete draft"
          hitSlop={8}
        >
          <Ionicons name="trash-outline" size={20} color={colors.error} />
        </Pressable>
      </View>
      <AppText variant="caption" color={colors.textSecondary}>
        Last saved {formatDateTime(draft.updatedAt) || '—'}
      </AppText>
      <AppText variant="caption" color={colors.textSecondary}>
        Continue at step {step.index} of {WIZARD_STEPS.length}: {step.title} · {validSteps}/
        {WIZARD_STEPS.length} steps ready
      </AppText>
      <Button
        label="Resume editing"
        onPress={onResume}
        variant="secondary"
        size="medium"
        icon="play-outline"
      />
    </Card>
  );
}

function confirmDelete(draft: CampaignDraft, deleteDraft: (id: string) => Promise<void>) {
  Alert.alert(
    'Delete this draft?',
    `“${draft.title.trim() || 'Untitled campaign'}” will be removed from this device. This cannot be undone.`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteDraft(draft.id);
        },
      },
    ],
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  draftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
