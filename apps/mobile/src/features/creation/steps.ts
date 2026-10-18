export type WizardStepKey = 'basics' | 'story' | 'visuals' | 'reach' | 'submit';

export interface WizardStepMeta {
  /** 1-based position shown in the progress indicator. */
  index: number;
  key: WizardStepKey;
  title: string;
  /** Compact label for the progress indicator. */
  short: string;
  blurb: string;
}

/**
 * The exact five creation steps, in order. No other setup screens are inserted
 * between them (spec rule 10).
 */
export const WIZARD_STEPS: WizardStepMeta[] = [
  { index: 1, key: 'basics', title: 'Basics', short: 'Basics', blurb: 'Title, category, and who is behind the message.' },
  { index: 2, key: 'story', title: 'Story', short: 'Story', blurb: 'The editorial message: headline, sections, sources, images.' },
  { index: 3, key: 'visuals', title: 'Campaign & Ad Visuals', short: 'Visuals', blurb: 'Cover artwork and the advertising creative.' },
  { index: 4, key: 'reach', title: 'Reach', short: 'Reach', blurb: 'Locations, audience, channels, duration, and budget.' },
  { index: 5, key: 'submit', title: 'Submit', short: 'Submit', blurb: 'Review everything, set the funding goal, and submit.' },
];

export const FIRST_STEP = 1;
export const LAST_STEP = WIZARD_STEPS.length;

export function stepMeta(index: number): WizardStepMeta {
  const clamped = Math.min(Math.max(Math.round(index), FIRST_STEP), LAST_STEP);
  return WIZARD_STEPS[clamped - 1];
}

export function stepKey(index: number): WizardStepKey {
  return stepMeta(index).key;
}

export function stepIndexForKey(key: WizardStepKey): number {
  const found = WIZARD_STEPS.find((step) => step.key === key);
  return found ? found.index : FIRST_STEP;
}

export function stepMetaByKey(key: WizardStepKey): WizardStepMeta {
  return stepMeta(stepIndexForKey(key));
}

/** The key of the following step, or null at the final step. */
export function nextStepKey(key: WizardStepKey): WizardStepKey | null {
  const index = stepIndexForKey(key);
  return index < LAST_STEP ? stepKey(index + 1) : null;
}

/** The key of the previous step, or null at the first step. */
export function previousStepKey(key: WizardStepKey): WizardStepKey | null {
  const index = stepIndexForKey(key);
  return index > FIRST_STEP ? stepKey(index - 1) : null;
}
