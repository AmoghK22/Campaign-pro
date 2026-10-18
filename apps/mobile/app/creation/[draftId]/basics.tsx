import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CAMPAIGN_CATEGORIES } from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  Chip,
  Input,
  LoadingState,
  ScreenContainer,
  SectionHeader,
} from '../../../src/components';
import { WizardScaffold } from '../../../src/features/creation/WizardScaffold';
import { MissingDraft } from '../../../src/features/creation/MissingDraft';
import { useStepController } from '../../../src/features/creation/useStepController';
import { MAX_TITLE_LENGTH } from '../../../src/features/creation/validation';
import { colors, spacing } from '../../../src/theme';

export default function BasicsStep() {
  const controller = useStepController('basics');
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
      step={1}
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
            label="Continue to Story"
            icon="arrow-forward"
            onPress={() => void controller.continueTo('story')}
          />
        </>
      }
    >
      <Card>
        <SectionHeader title="The essentials" subtitle="Required to continue" />
        <Input
          label="Campaign title"
          placeholder="A clear, specific headline"
          value={draft.title}
          onChangeText={(title) => patch((current) => ({ ...current, title }))}
          maxLength={MAX_TITLE_LENGTH}
          error={errorFor('title')}
          rightAdornment={
            <AppText variant="caption" color={colors.textMuted}>
              {draft.title.length}/{MAX_TITLE_LENGTH}
            </AppText>
          }
        />
        <AppText variant="caption" color={colors.textMuted}>
          This title is also used as the advertising headline unless you set a separate ad headline in
          step 3.
        </AppText>

        <AppText variant="label">Category</AppText>
        <View style={styles.chipWrap}>
          {CAMPAIGN_CATEGORIES.map((category) => (
            <Chip
              key={category}
              label={category}
              selected={draft.category === category}
              onPress={() => patch((current) => ({ ...current, category }))}
            />
          ))}
        </View>
        {errorFor('category') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('category')}
          </AppText>
        ) : null}

        <Input
          label="Creator or organisation"
          placeholder="Who is behind this message?"
          value={draft.creatorName}
          onChangeText={(creatorName) => patch((current) => ({ ...current, creatorName }))}
          error={errorFor('creatorName')}
        />
        <Input
          label="One-line summary"
          placeholder="Summarise the message in a sentence"
          value={draft.summary}
          onChangeText={(summary) => patch((current) => ({ ...current, summary }))}
          multiline
          error={errorFor('summary')}
        />
      </Card>

      <Card>
        <SectionHeader
          title="Context"
          subtitle="Optional, but it makes the message stronger"
        />
        <Input
          label="What is it about?"
          placeholder="The situation or issue, in plain language"
          value={draft.whatItsAbout}
          onChangeText={(whatItsAbout) => patch((current) => ({ ...current, whatItsAbout }))}
          multiline
        />
        <Input
          label="Who should it reach?"
          placeholder="The people whose attention would matter most"
          value={draft.whoItShouldReach}
          onChangeText={(whoItShouldReach) => patch((current) => ({ ...current, whoItShouldReach }))}
          multiline
        />
        <Input
          label="Why does it matter?"
          placeholder="Why this message deserves to be seen"
          value={draft.whyItMatters}
          onChangeText={(whyItMatters) => patch((current) => ({ ...current, whyItMatters }))}
          multiline
        />
        <Input
          label="Supporting evidence"
          placeholder="Data, reports, or lived experience that backs this up"
          value={draft.evidence}
          onChangeText={(evidence) => patch((current) => ({ ...current, evidence }))}
          multiline
        />
      </Card>
    </WizardScaffold>
  );
}

const styles = StyleSheet.create({
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
