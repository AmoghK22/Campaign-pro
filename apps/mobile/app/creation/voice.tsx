import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import {
  AppText,
  Button,
  Card,
  DemoBadge,
  Input,
  ScreenContainer,
} from '../../src/components';
import { useDraftsStore } from '../../src/store';
import { colors, spacing } from '../../src/theme';

const EXAMPLE = {
  title: 'Bring back the night bus on Route 14',
  summary: 'A community push to restore the late-night bus that thousands of workers rely on.',
  whyItMatters:
    'The last bus leaves at 9pm, leaving hospital and hospitality staff with unsafe, costly commutes.',
  storyIntro:
    'Route 14 used to run until midnight. When it was cut, night-shift workers lost their only affordable way home. This campaign amplifies their request to restore it.',
};

/**
 * Honest guided fallback for "Create with Your Voice". Speech recognition is
 * NOT enabled in this build, so this is a text-based helper that drafts an
 * editable campaign — it never submits anything automatically.
 */
export default function VoiceDraftScreen() {
  const createDraft = useDraftsStore((state) => state.createDraft);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [storyIntro, setStoryIntro] = useState('');
  const [busy, setBusy] = useState(false);

  function useExample() {
    setTitle(EXAMPLE.title);
    setSummary(EXAMPLE.summary);
    setWhyItMatters(EXAMPLE.whyItMatters);
    setStoryIntro(EXAMPLE.storyIntro);
  }

  async function createEditableDraft() {
    setBusy(true);
    try {
      const draft = await createDraft({
        title: title.trim(),
        summary: summary.trim(),
        whyItMatters: whyItMatters.trim(),
        storyHeadline: title.trim(),
        storyIntro: storyIntro.trim(),
      });
      router.replace(`/creation/${draft.id}/basics`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScreenContainer
      title="Create with your voice"
      subtitle="A guided helper that prepares an editable draft. It never submits on its own."
    >
      <Button
        label="Back"
        onPress={() => router.back()}
        variant="ghost"
        icon="arrow-back"
        size="medium"
        style={styles.back}
      />

      <Card style={styles.noticeCard}>
        <DemoBadge tone="simulated" label="Text fallback — no speech recognition" />
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Speech recognition is not enabled in this build, so we do not pretend to listen. Instead, type
          or paste a short pitch below and we will turn it into a draft you can edit step by step.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subheading">Your pitch</AppText>
        <Input
          label="What is the message about?"
          placeholder="A short headline for the campaign"
          value={title}
          onChangeText={setTitle}
          maxLength={60}
        />
        <Input
          label="One-line summary"
          placeholder="Summarise the message in a sentence"
          value={summary}
          onChangeText={setSummary}
          multiline
        />
        <Input
          label="Why does it matter?"
          placeholder="Why this message should reach more people"
          value={whyItMatters}
          onChangeText={setWhyItMatters}
          multiline
        />
        <Input
          label="First story paragraph"
          placeholder="An opening paragraph for the story"
          value={storyIntro}
          onChangeText={setStoryIntro}
          multiline
        />
        <View style={styles.actions}>
          <Button
            label="Use an example"
            onPress={useExample}
            variant="ghost"
            size="medium"
            icon="sparkles-outline"
          />
        </View>
      </Card>

      <Button
        label="Create editable draft"
        onPress={() => void createEditableDraft()}
        disabled={title.trim().length === 0 || busy}
        loading={busy}
        icon="create-outline"
      />
      <AppText variant="caption" color={colors.textMuted}>
        You can change every field afterwards. Nothing is submitted until you confirm at step 5.
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: {
    alignSelf: 'flex-start',
  },
  noticeCard: {
    backgroundColor: colors.accentMuted,
    borderColor: colors.accentMuted,
  },
  actions: {
    marginTop: spacing.sm,
  },
});
