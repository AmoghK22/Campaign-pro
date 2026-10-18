import { useCallback, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import type { CampaignDraft } from '@campaign/shared';
import { useDraftsStore } from '../../store';
import { useActiveDraft } from './useActiveDraft';
import { STEP_VALIDATORS, type ValidationIssue } from './validation';
import {
  WIZARD_STEPS,
  stepIndexForKey,
  stepMetaByKey,
  type WizardStepKey,
} from './steps';

/**
 * Shared behaviour for a single wizard step: resolve the draft, expose the
 * current validation issues, and handle Back/Continue with keyboard-safe
 * flushing so no edit is lost between screens.
 */
export function useStepController(stepKey: WizardStepKey) {
  const params = useLocalSearchParams<{ draftId: string }>();
  const draftId = String(params.draftId);
  const { draft, missing } = useActiveDraft(draftId);
  const patchActive = useDraftsStore((state) => state.patchActive);
  const flushActive = useDraftsStore((state) => state.flushActive);
  const [showErrors, setShowErrors] = useState(false);

  const issues: ValidationIssue[] = draft ? STEP_VALIDATORS[stepKey](draft) : [];
  const meta = stepMetaByKey(stepKey);

  const patch = useCallback(
    (updater: (current: CampaignDraft) => CampaignDraft) => {
      patchActive(updater);
    },
    [patchActive],
  );

  const continueTo = useCallback(
    async (nextKey: WizardStepKey | null) => {
      const current = useDraftsStore.getState().activeDraft;
      if (!current) {
        return false;
      }
      const stepIssues = STEP_VALIDATORS[stepKey](current);
      if (stepIssues.length > 0) {
        setShowErrors(true);
        return false;
      }
      if (nextKey) {
        patchActive((draftState) => ({ ...draftState, currentStep: stepIndexForKey(nextKey) }));
      }
      await flushActive();
      if (nextKey) {
        router.push(`/creation/${draftId}/${nextKey}`);
      }
      return true;
    },
    [draftId, flushActive, patchActive, stepKey],
  );

  const goBack = useCallback(() => {
    void flushActive();
    router.back();
  }, [flushActive]);

  const goToStep = useCallback(
    (index: number) => {
      const target = WIZARD_STEPS.find((step) => step.index === index);
      if (!target || target.key === stepKey) {
        return;
      }
      void flushActive();
      router.push(`/creation/${draftId}/${target.key}`);
    },
    [draftId, flushActive, stepKey],
  );

  return {
    draftId,
    draft,
    missing,
    meta,
    patch,
    issues,
    showErrors,
    setShowErrors,
    continueTo,
    goBack,
    goToStep,
    save: flushActive,
  };
}
