import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  DEMO_ASSUMPTION_NOTES,
  DEMO_REFUND_POLICY,
  calculateUseOfFunds,
  formatINR,
  formatImpressions,
} from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  DemoBadge,
  ErrorState,
  Input,
  LoadingState,
  ScreenContainer,
  SectionHeader,
} from '../../../src/components';
import { WizardScaffold } from '../../../src/features/creation/WizardScaffold';
import { CampaignPreview } from '../../../src/features/creation/CampaignPreview';
import { MissingDraft } from '../../../src/features/creation/MissingDraft';
import { useStepController } from '../../../src/features/creation/useStepController';
import { STEP_VALIDATORS, validateDraft } from '../../../src/features/creation/validation';
import { WIZARD_STEPS } from '../../../src/features/creation/steps';
import { useDraftsStore } from '../../../src/store';
import { colors, radius, spacing } from '../../../src/theme';

export default function SubmitStep() {
  const controller = useStepController('submit');
  const { draft, issues, showErrors, patch } = controller;
  const submitActive = useDraftsStore((state) => state.submitActive);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [goalText, setGoalText] = useState('');

  if (controller.missing) {
    return <MissingDraft />;
  }
  if (!draft) {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Loading draft…" />
      </ScreenContainer>
    );
  }

  const validations = validateDraft(draft);
  const canSubmit = validations.length === 0;
  const useOfFunds = draft.fundingGoal > 0 ? calculateUseOfFunds(draft.fundingGoal, draft.budgetAllocation) : null;
  const policyError = showErrors ? issues.find((issue) => issue.field === 'policyConfirmed')?.message ?? null : null;
  const goalError = showErrors ? issues.find((issue) => issue.field === 'fundingGoal')?.message ?? null : null;

  async function handleSubmit() {
    setSubmitError(null);
    const fresh = useDraftsStore.getState().activeDraft;
    if (!fresh) {
      return;
    }
    if (validateDraft(fresh).length > 0) {
      controller.setShowErrors(true);
      return;
    }
    setSubmitting(true);
    try {
      const { campaign } = await submitActive();
      router.replace(`/creation/submitted?campaignId=${campaign.id}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit the campaign.');
      setSubmitting(false);
    }
  }

  return (
    <WizardScaffold
      draft={draft}
      step={5}
      onBack={controller.goBack}
      onStepPress={controller.goToStep}
      footer={
        <>
          <Button
            label="Preview full campaign"
            variant="secondary"
            size="medium"
            icon="eye-outline"
            onPress={() => {
              void controller.save().then(() => router.push(`/creation/${controller.draftId}/preview`));
            }}
          />
          <Button
            label="Submit for review"
            icon="paper-plane-outline"
            loading={submitting}
            onPress={() => void handleSubmit()}
          />
        </>
      }
    >
      {submitError ? <ErrorState title="Submission failed" message={submitError} /> : null}

      {!canSubmit ? (
        <Card style={styles.warningCard}>
          <DemoBadge tone="simulated" label="Incomplete" />
          <AppText variant="subheading">Some steps still need attention</AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Fix the items below, or you can still save this as a draft and come back later.
          </AppText>
          {WIZARD_STEPS.map((step) => {
            const stepIssues = STEP_VALIDATORS[step.key](draft);
            if (stepIssues.length === 0) {
              return null;
            }
            return (
              <View key={step.key} style={styles.issueRow}>
                <View style={styles.flex}>
                  <AppText variant="label">
                    Step {step.index}: {step.title}
                  </AppText>
                  {stepIssues.map((issue) => (
                    <AppText key={issue.field} variant="caption" color={colors.error}>
                      • {issue.message}
                    </AppText>
                  ))}
                </View>
                <Button
                  label="Fix"
                  variant="ghost"
                  size="medium"
                  onPress={() => controller.goToStep(step.index)}
                />
              </View>
            );
          })}
          <Button
            label="Save as draft"
            variant="secondary"
            size="medium"
            icon="save-outline"
            onPress={() => void controller.save()}
          />
        </Card>
      ) : null}

      <Card>
        <SectionHeader
          title="Funding goal"
          subtitle="Set here and here only — never auto-filled"
        />
        <NumberInput
          value={goalText === '' && draft.fundingGoal > 0 ? String(draft.fundingGoal) : goalText}
          onChange={setGoalText}
          onCommit={(goal) => patch((current) => ({ ...current, fundingGoal: goal }))}
          placeholder="25000"
          error={goalError}
          hint="The total you aim to raise. Net of fees, this becomes the amplification budget."
        />
      </Card>

      {useOfFunds ? (
        <Card>
          <SectionHeader title="How the goal is used" subtitle="Illustrative demo split" />
          <FundsRow label="Platform / processing fee" value={formatINR(useOfFunds.platformFee)} />
          <FundsRow
            label={`Advertising budget (${useOfFunds.advertisingSharePercent}% of net)`}
            value={formatINR(useOfFunds.advertisingBudget)}
          />
          <FundsRow
            label={`Contingency reserve (${useOfFunds.contingencySharePercent}% of net)`}
            value={formatINR(useOfFunds.contingencyBudget)}
          />
          <FundsRow label="Total funding goal" value={formatINR(useOfFunds.grossAmount)} emphasis />
          <AppText variant="bodySmall" color={colors.textSecondary}>
            At this goal: about {formatImpressions(useOfFunds.estimatedImpressions)} estimated impressions.
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {DEMO_ASSUMPTION_NOTES.fee}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {DEMO_ASSUMPTION_NOTES.allocation}
          </AppText>
          <AppText variant="caption" color={colors.textMuted}>
            {DEMO_REFUND_POLICY}
          </AppText>
        </Card>
      ) : null}

      <Card style={styles.disclaimerCard}>
        <AppText variant="subheading">What submitting does</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Submitting sends this campaign to review. It does <AppText variant="label">not</AppText> start
          advertising, and it is not auto-approved. Contributions fund distribution of the message, not the
          cause itself.
        </AppText>
      </Card>

      <Pressable
        style={styles.checkboxRow}
        onPress={() => patch((current) => ({ ...current, policyConfirmed: !current.policyConfirmed }))}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: draft.policyConfirmed }}
        accessibilityLabel="Confirm the policy"
      >
        <Ionicons
          name={draft.policyConfirmed ? 'checkbox' : 'square-outline'}
          size={24}
          color={draft.policyConfirmed ? colors.primary : colors.textSecondary}
        />
        <AppText variant="bodySmall" style={styles.flex}>
          I confirm this campaign is accurate to the best of my knowledge and follows the platform policies.
        </AppText>
      </Pressable>
      {policyError ? (
        <AppText variant="caption" color={colors.error}>
          {policyError}
        </AppText>
      ) : null}

      <Card>
        <SectionHeader title="Full review" subtitle="Exactly what will be submitted" />
        <CampaignPreview draft={draft} />
      </Card>
    </WizardScaffold>
  );
}

function NumberInput({
  value,
  onChange,
  onCommit,
  placeholder,
  hint,
  error,
}: {
  value: string;
  onChange: (text: string) => void;
  onCommit: (value: number) => void;
  placeholder: string;
  hint?: string;
  error?: string | null;
}) {
  function handle(next: string) {
    const cleaned = next.replace(/[^0-9.]/g, '');
    onChange(cleaned);
    const parsed = cleaned.trim() === '' ? 0 : Number(cleaned);
    onCommit(Number.isFinite(parsed) ? parsed : 0);
  }
  return (
    <Input
      label="Funding goal"
      value={value}
      onChangeText={handle}
      keyboardType="numeric"
      placeholder={placeholder}
      hint={hint}
      error={error}
    />
  );
}

function FundsRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <View style={styles.fundsRow}>
      <AppText variant={emphasis ? 'label' : 'bodySmall'} color={emphasis ? colors.text : colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant={emphasis ? 'label' : 'bodySmall'}>{value}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  warningCard: {
    borderColor: colors.accent,
    borderWidth: 1.5,
  },
  disclaimerCard: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primaryMuted,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  fundsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
