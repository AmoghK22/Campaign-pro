import React from 'react';
import { StyleSheet, View } from 'react-native';
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
import { CampaignImage } from '../../../src/features/campaigns/CampaignImage';
import { ImagePickerGrid } from '../../../src/features/creation/ImagePickerGrid';
import { AD_IMAGE_OPTIONS, COVER_IMAGE_OPTIONS } from '../../../src/features/creation/assets';
import { CALL_TO_ACTION_OPTIONS } from '../../../src/features/creation/options';
import { MissingDraft } from '../../../src/features/creation/MissingDraft';
import { useStepController } from '../../../src/features/creation/useStepController';
import { MAX_AD_HEADLINE_LENGTH } from '../../../src/features/creation/validation';
import { colors, radius, spacing } from '../../../src/theme';

export default function VisualsStep() {
  const controller = useStepController('visuals');
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

  return (
    <WizardScaffold
      draft={draft}
      step={3}
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
            label="Continue to Reach"
            icon="arrow-forward"
            onPress={() => void controller.continueTo('reach')}
          />
        </>
      }
    >
      <Card>
        <SectionHeader title="Cover artwork" subtitle="Optional — appears on the campaign page" />
        <View style={styles.chipWrap}>
          <Chip
            label="No cover"
            selected={!draft.coverImageKey}
            onPress={() => patch((current) => ({ ...current, coverImageKey: null }))}
          />
        </View>
        <ImagePickerGrid
          options={COVER_IMAGE_OPTIONS}
          selectedKey={draft.coverImageKey}
          onSelect={(coverImageKey) => patch((current) => ({ ...current, coverImageKey }))}
          accessibilityLabel="Choose cover artwork"
        />
      </Card>

      <Card>
        <SectionHeader title="Advertising creative" subtitle="Required — this is what the audience sees" />
        <ImagePickerGrid
          options={AD_IMAGE_OPTIONS}
          selectedKey={draft.adImageKey}
          onSelect={(adImageKey) =>
            patch((current) => ({ ...current, adImageKey, adImageUri: null }))
          }
          accessibilityLabel="Choose advertising image"
        />
        {errorFor('adImageKey') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('adImageKey')}
          </AppText>
        ) : null}
        <Input
          label="Ad headline"
          placeholder="Short, direct headline for the ad"
          value={draft.adHeadline}
          onChangeText={(adHeadline) => patch((current) => ({ ...current, adHeadline }))}
          maxLength={MAX_AD_HEADLINE_LENGTH}
          error={errorFor('adHeadline')}
          rightAdornment={
            <AppText variant="caption" color={colors.textMuted}>
              {draft.adHeadline.length}/{MAX_AD_HEADLINE_LENGTH}
            </AppText>
          }
        />
        <Input
          label="Ad description"
          placeholder="A sentence or two of supporting copy"
          value={draft.adDescription}
          onChangeText={(adDescription) => patch((current) => ({ ...current, adDescription }))}
          multiline
          error={errorFor('adDescription')}
        />
        <AppText variant="label">Call to action</AppText>
        <View style={styles.chipWrap}>
          {CALL_TO_ACTION_OPTIONS.map((option) => (
            <Chip
              key={option}
              label={option}
              selected={draft.callToAction === option}
              onPress={() => patch((current) => ({ ...current, callToAction: option }))}
            />
          ))}
        </View>
        {errorFor('callToAction') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('callToAction')}
          </AppText>
        ) : null}
        {draft.adHeadline.trim().length === 0 && draft.title.trim().length > 0 ? (
          <AppText variant="caption" color={colors.textSecondary}>
            Tip: your campaign title “{draft.title}” can work as the ad headline.
          </AppText>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title="Placement preview" subtitle="How the ad could look in a feed" />
        <DemoBadge tone="simulated" label="Placement preview" />
        <CampaignImage
          imageKey={draft.adImageKey}
          uri={draft.adImageUri}
          style={styles.adImage}
          accessibilityLabel="Advertising creative preview"
        />
        <AppText variant="subheading">{draft.adHeadline || 'Ad headline'}</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {draft.adDescription || 'Ad description'}
        </AppText>
        <View style={styles.ctaButton}>
          <AppText variant="label" color={colors.textOnPrimary}>
            {draft.callToAction || 'Learn more'}
          </AppText>
        </View>
      </Card>

      <AppText variant="caption" color={colors.textMuted}>
        Local demo artwork only. This build has no device gallery upload, no AI image generation, and no
        video upload — the “video placeholder” asset is illustrative only.
      </AppText>
    </WizardScaffold>
  );
}

const styles = StyleSheet.create({
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  adImage: {
    height: 200,
    borderRadius: radius.md,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
});
