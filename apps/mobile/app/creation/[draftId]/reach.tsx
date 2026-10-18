import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DEMO_ASSUMPTION_NOTES,
  calculateUseOfFunds,
  formatImpressions,
  formatINR,
  type DistributionChannel,
} from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  Chip,
  DemoBadge,
  Input,
  LoadingState,
  ScreenContainer,
  SectionHeader,
} from '../../../src/components';
import { WizardScaffold } from '../../../src/features/creation/WizardScaffold';
import {
  CHANNEL_OPTIONS,
  INTEREST_OPTIONS,
  LOCATION_OPTIONS,
} from '../../../src/features/creation/options';
import { toggleValue } from '../../../src/features/creation/draftOps';
import { MissingDraft } from '../../../src/features/creation/MissingDraft';
import { useStepController } from '../../../src/features/creation/useStepController';
import {
  MAX_DURATION_DAYS,
  MIN_DURATION_DAYS,
} from '../../../src/features/creation/validation';
import { colors, spacing } from '../../../src/theme';

const ALLOCATION_OPTIONS = [70, 75, 80, 85, 90];

export default function ReachStep() {
  const controller = useStepController('reach');
  const { draft, issues, showErrors, patch } = controller;

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

  const errorFor = (field: string) =>
    showErrors ? issues.find((issue) => issue.field === field)?.message ?? null : null;

  const useOfFunds = calculateUseOfFunds(
    draft.distributionBudget > 0 ? draft.distributionBudget : 0.01,
    draft.budgetAllocation,
  );

  function toggleChannel(channel: DistributionChannel) {
    patch((current) => ({ ...current, channels: toggleValue(current.channels, channel) as DistributionChannel[] }));
  }

  return (
    <WizardScaffold
      draft={draft}
      step={4}
      onBack={controller.goBack}
      onStepPress={controller.goToStep}
      footer={
        <>
          <Button
            label="Save as draft"
            variant="secondary"
            size="medium"
            icon="save-outline"
            onPress={() => void controller.save()}
          />
          <Button
            label="Continue to Submit"
            icon="arrow-forward"
            onPress={() => void controller.continueTo('submit')}
          />
        </>
      }
    >
      <Card>
        <SectionHeader title="Locations" subtitle="Where the message should be amplified" />
        <View style={styles.chipWrap}>
          {LOCATION_OPTIONS.map((location) => (
            <Chip
              key={location}
              label={location}
              selected={draft.targetLocations.includes(location)}
              onPress={() =>
                patch((current) => ({
                  ...current,
                  targetLocations: toggleValue(current.targetLocations, location),
                }))
              }
            />
          ))}
        </View>
        {errorFor('targetLocations') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('targetLocations')}
          </AppText>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title="Audience interests" subtitle="Topics the audience cares about" />
        <View style={styles.chipWrap}>
          {INTEREST_OPTIONS.map((interest) => (
            <Chip
              key={interest}
              label={interest}
              selected={draft.audienceInterests.includes(interest)}
              onPress={() =>
                patch((current) => ({
                  ...current,
                  audienceInterests: toggleValue(current.audienceInterests, interest),
                }))
              }
            />
          ))}
        </View>
        {errorFor('audienceInterests') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('audienceInterests')}
          </AppText>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title="Distribution channels" subtitle="Where the ad can appear" />
        <View style={styles.chipWrap}>
          {CHANNEL_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={draft.channels.includes(option.value)}
              accessibilityLabel={`${option.label} channel. ${option.description}`}
              onPress={() => toggleChannel(option.value)}
            />
          ))}
        </View>
        <View style={styles.channelNotes}>
          {CHANNEL_OPTIONS.map((option) => (
            <AppText key={option.value} variant="caption" color={colors.textSecondary}>
              {option.label}: {option.description}
            </AppText>
          ))}
        </View>
        {errorFor('channels') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('channels')}
          </AppText>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title="Duration & budget" subtitle="How long the message runs, and what you propose to spend" />
        <NumberField
          label="Duration (days)"
          value={draft.durationDays}
          placeholder="14"
          hint={`Between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS} days.`}
          error={errorFor('durationDays')}
          onChange={(durationDays) => patch((current) => ({ ...current, durationDays }))}
        />
        <NumberField
          label="Proposed distribution budget"
          value={draft.distributionBudget}
          placeholder="5000"
          hint="The amount you plan to spend on amplifying the message."
          error={errorFor('distributionBudget')}
          onChange={(distributionBudget) => patch((current) => ({ ...current, distributionBudget }))}
        />

        <AppText variant="label">Allocation</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Share of the net budget spent on advertising; the rest is a contingency reserve.
        </AppText>
        <View style={styles.chipWrap}>
          {ALLOCATION_OPTIONS.map((share) => (
            <Chip
              key={share}
              label={`${share}% ads`}
              selected={draft.budgetAllocation.advertisingSharePercent === share}
              onPress={() =>
                patch((current) => ({
                  ...current,
                  budgetAllocation: {
                    advertisingSharePercent: share,
                    contingencySharePercent: 100 - share,
                  },
                }))
              }
            />
          ))}
        </View>
      </Card>

      <Card>
        <SectionHeader title="Estimated reach" subtitle="Demo estimate, not a guarantee" />
        {draft.distributionBudget > 0 ? (
          <View style={styles.fundsList}>
            <FundsRow
              label={`Platform / processing fee (${formatINR(useOfFunds.platformFee)})`}
              value={formatINR(useOfFunds.platformFee)}
            />
            <FundsRow
              label={`Advertising budget (${useOfFunds.advertisingSharePercent}% of net)`}
              value={formatINR(useOfFunds.advertisingBudget)}
            />
            <FundsRow
              label={`Contingency reserve (${useOfFunds.contingencySharePercent}% of net)`}
              value={formatINR(useOfFunds.contingencyBudget)}
            />
            <FundsRow label="Total proposed budget" value={formatINR(useOfFunds.grossAmount)} emphasis />
            <AppText variant="bodySmall" color={colors.textSecondary}>
              About {formatImpressions(useOfFunds.estimatedImpressions)} estimated impressions at this
              budget.
            </AppText>
          </View>
        ) : (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Enter a proposed budget to see the estimated reach.
          </AppText>
        )}
        <DemoBadge tone="estimate" />
        <AppText variant="caption" color={colors.textSecondary}>
          {DEMO_ASSUMPTION_NOTES.impressions}
        </AppText>
        <AppText variant="caption" color={colors.textMuted}>
          {DEMO_ASSUMPTION_NOTES.reach}
        </AppText>
      </Card>
    </WizardScaffold>
  );
}

/**
 * Numeric input that owns its display text. It is only mounted once the draft
 * is loaded and this field is the only writer of its value, so a plain initial
 * state is correct and avoids cursor-jump bugs from reformatting while typing.
 */
function NumberField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder: string;
  hint?: string;
  error?: string | null;
}) {
  const [text, setText] = useState(value > 0 ? String(value) : '');

  function handleChange(next: string) {
    const cleaned = next.replace(/[^0-9.]/g, '');
    setText(cleaned);
    const parsed = cleaned.trim() === '' ? 0 : Number(cleaned);
    onChange(Number.isFinite(parsed) ? parsed : 0);
  }

  function handleBlur() {
    if (text.trim() === '') {
      return;
    }
    const parsed = Number(text);
    setText(String(Number.isFinite(parsed) ? parsed : 0));
  }

  return (
    <Input
      label={label}
      placeholder={placeholder}
      value={text}
      onChangeText={handleChange}
      onBlur={handleBlur}
      keyboardType="numeric"
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
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  channelNotes: {
    gap: spacing.xxs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  fundsList: {
    gap: spacing.sm,
  },
  fundsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
