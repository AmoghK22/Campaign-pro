import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
import { CampaignImage } from '../../../src/features/campaigns/CampaignImage';
import { ImagePickerGrid } from '../../../src/features/creation/ImagePickerGrid';
import { STORY_IMAGE_OPTIONS } from '../../../src/features/creation/assets';
import { AUDIENCE_ACTION_OPTIONS } from '../../../src/features/creation/options';
import { MissingDraft } from '../../../src/features/creation/MissingDraft';
import { useStepController } from '../../../src/features/creation/useStepController';
import {
  addSection,
  addSource,
  addStatistic,
  addStoryImage,
  moveSection,
  removeSection,
  removeSource,
  removeStatistic,
  removeStoryImage,
  toggleValue,
  updateSection,
  updateSource,
  updateStatistic,
  updateStoryImage,
} from '../../../src/features/creation/draftOps';
import { colors, radius, spacing } from '../../../src/theme';

export default function StoryStep() {
  const controller = useStepController('story');
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
      step={2}
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
            label="Continue to Visuals"
            icon="arrow-forward"
            onPress={() => void controller.continueTo('visuals')}
          />
        </>
      }
    >
      <Card>
        <SectionHeader title="Story" subtitle="The editorial message people will read" />
        <Input
          label="Story headline"
          placeholder="The headline for the full story"
          value={draft.storyHeadline}
          onChangeText={(storyHeadline) => patch((current) => ({ ...current, storyHeadline }))}
          error={errorFor('storyHeadline')}
        />
        <Input
          label="Introduction"
          placeholder="An opening paragraph that frames the issue"
          value={draft.storyIntro}
          onChangeText={(storyIntro) => patch((current) => ({ ...current, storyIntro }))}
          multiline
          error={errorFor('storyIntro')}
        />
        <AppText variant="caption" color={colors.textMuted}>
          Plain text only — this build has no rich-text formatting toolbar.
        </AppText>
      </Card>

      <Card>
        <SectionHeader
          title="Sections"
          subtitle="Break the story into clear parts"
          actionLabel="Add section"
          onAction={() => patch(addSection)}
        />
        {draft.storySections.length === 0 ? (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Add at least one section to continue.
          </AppText>
        ) : null}
        {draft.storySections.map((section, index) => (
          <View key={section.id} style={styles.subCard}>
            <View style={styles.subHeader}>
              <AppText variant="label">Section {index + 1}</AppText>
              <View style={styles.subActions}>
                <IconAction
                  icon="arrow-up"
                  label={`Move section ${index + 1} up`}
                  disabled={index === 0}
                  onPress={() => patch((current) => moveSection(current, section.id, 'up'))}
                />
                <IconAction
                  icon="arrow-down"
                  label={`Move section ${index + 1} down`}
                  disabled={index === draft.storySections.length - 1}
                  onPress={() => patch((current) => moveSection(current, section.id, 'down'))}
                />
                <IconAction
                  icon="trash-outline"
                  label={`Remove section ${index + 1}`}
                  tone="danger"
                  onPress={() => patch((current) => removeSection(current, section.id))}
                />
              </View>
            </View>
            <Input
              label="Heading"
              placeholder="Section heading"
              value={section.heading}
              onChangeText={(heading) =>
                patch((current) => updateSection(current, section.id, { heading }))
              }
              error={errorFor(`section.${section.id}.heading`)}
            />
            <Input
              label="Body"
              placeholder="Write this section"
              value={section.body}
              onChangeText={(body) => patch((current) => updateSection(current, section.id, { body }))}
              multiline
              error={errorFor(`section.${section.id}.body`)}
            />
          </View>
        ))}
        {errorFor('storySections') ? (
          <AppText variant="caption" color={colors.error}>
            {errorFor('storySections')}
          </AppText>
        ) : null}
      </Card>

      <Card>
        <SectionHeader title="Images" subtitle="Optional photos from bundled demo artwork" />
        <ImagePickerGrid
          options={STORY_IMAGE_OPTIONS}
          selectedKey={null}
          onSelect={(imageKey) => patch((current) => addStoryImage(current, imageKey))}
          accessibilityLabel="Add a story image"
        />
        {draft.storyImages.map((image, index) => (
          <View key={image.id} style={styles.imageRow}>
            <CampaignImage imageKey={image.imageKey} uri={image.uri} style={styles.imageThumb} />
            <View style={styles.imageFields}>
              <Input
                label={`Caption ${index + 1}`}
                placeholder="Describe the image"
                value={image.caption}
                onChangeText={(caption) =>
                  patch((current) => updateStoryImage(current, image.id, { caption }))
                }
              />
              <Input
                label="Credit"
                placeholder="Photo credit"
                value={image.credit}
                onChangeText={(credit) =>
                  patch((current) => updateStoryImage(current, image.id, { credit }))
                }
              />
              <Button
                label="Remove image"
                variant="ghost"
                size="medium"
                icon="trash-outline"
                onPress={() => patch((current) => removeStoryImage(current, image.id))}
              />
            </View>
          </View>
        ))}
      </Card>

      <Card>
        <SectionHeader title="Statistics" subtitle="Optional numbers that support the story" actionLabel="Add" onAction={() => patch(addStatistic)} />
        {draft.statistics.map((stat) => (
          <View key={stat.id} style={styles.statRow}>
            <View style={styles.flex}>
              <Input
                label="Value"
                placeholder="e.g. 12,000"
                value={stat.value}
                onChangeText={(value) => patch((current) => updateStatistic(current, stat.id, { value }))}
              />
            </View>
            <View style={styles.flex}>
              <Input
                label="Label"
                placeholder="What the number means"
                value={stat.label}
                onChangeText={(label) => patch((current) => updateStatistic(current, stat.id, { label }))}
              />
            </View>
            <IconAction
              icon="trash-outline"
              label="Remove statistic"
              tone="danger"
              onPress={() => patch((current) => removeStatistic(current, stat.id))}
            />
          </View>
        ))}
      </Card>

      <Card>
        <SectionHeader
          title="Sources"
          subtitle="Link the evidence behind the message"
          actionLabel="Add source"
          onAction={() => patch(addSource)}
        />
        {draft.sources.map((source, index) => (
          <View key={source.id} style={styles.subCard}>
            <View style={styles.subHeader}>
              <AppText variant="label">Source {index + 1}</AppText>
              <IconAction
                icon="trash-outline"
                label={`Remove source ${index + 1}`}
                tone="danger"
                onPress={() => patch((current) => removeSource(current, source.id))}
              />
            </View>
            <Input
              label="Title"
              placeholder="Publication or document name"
              value={source.title}
              onChangeText={(title) => patch((current) => updateSource(current, source.id, { title }))}
              error={errorFor(`source.${source.id}.title`)}
            />
            <Input
              label="Link"
              placeholder="https://…"
              autoCapitalize="none"
              keyboardType="url"
              value={source.url}
              onChangeText={(url) => patch((current) => updateSource(current, source.id, { url }))}
              error={errorFor(`source.${source.id}.url`)}
            />
          </View>
        ))}
        <AppText variant="caption" color={colors.textMuted}>
          Sources are shown publicly. Use a valid http(s) link; demo sources point to example.org.
        </AppText>
      </Card>

      <Card>
        <SectionHeader
          title="Suggested actions"
          subtitle="Optional nudges for readers who want to take part"
        />
        <View style={styles.chipWrap}>
          {AUDIENCE_ACTION_OPTIONS.map((action) => (
            <Chip
              key={action}
              label={action}
              selected={draft.audienceActions.includes(action)}
              onPress={() =>
                patch((current) => ({
                  ...current,
                  audienceActions: toggleValue(current.audienceActions, action),
                }))
              }
            />
          ))}
        </View>
      </Card>
    </WizardScaffold>
  );
}

function IconAction({
  icon,
  label,
  onPress,
  disabled = false,
  tone = 'default',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  tone?: 'default' | 'danger';
}) {
  const color = disabled ? colors.disabled : tone === 'danger' ? colors.error : colors.primary;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={8}
      style={styles.iconButton}
    >
      <Ionicons name={icon} size={18} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  subCard: {
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  subActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconButton: {
    padding: spacing.xs,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  imageRow: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  imageThumb: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
  },
  imageFields: {
    flex: 1,
    gap: spacing.sm,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
