import { isValidHttpUrl, type CampaignDraft } from '@campaign/shared';
import type { WizardStepKey } from './steps';

export const MAX_TITLE_LENGTH = 60;
export const MAX_AD_HEADLINE_LENGTH = 60;
export const MIN_DURATION_DAYS = 1;
export const MAX_DURATION_DAYS = 60;

export interface ValidationIssue {
  /** Identifies the field so a screen can attach the message inline. */
  field: string;
  message: string;
}

function required(value: string, field: string, message: string): ValidationIssue[] {
  return value.trim().length === 0 ? [{ field, message }] : [];
}

export function validateBasics(draft: CampaignDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  issues.push(...required(draft.title, 'title', 'Add a campaign title.'));
  if (draft.title.trim().length > MAX_TITLE_LENGTH) {
    issues.push({
      field: 'title',
      message: `Keep the title to ${MAX_TITLE_LENGTH} characters or fewer.`,
    });
  }
  if (!draft.category) {
    issues.push({ field: 'category', message: 'Choose a category.' });
  }
  issues.push(
    ...required(draft.creatorName, 'creatorName', 'Add the creator or organisation name.'),
  );
  issues.push(...required(draft.summary, 'summary', 'Add a one-line summary of the message.'));
  return issues;
}

export function validateStory(draft: CampaignDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  issues.push(...required(draft.storyHeadline, 'storyHeadline', 'Add a story headline.'));
  issues.push(...required(draft.storyIntro, 'storyIntro', 'Write an introduction for the story.'));
  if (draft.storySections.length === 0) {
    issues.push({ field: 'storySections', message: 'Add at least one story section.' });
  }
  draft.storySections.forEach((section, index) => {
    issues.push(...required(section.heading, `section.${section.id}.heading`, `Section ${index + 1} needs a heading.`));
    issues.push(...required(section.body, `section.${section.id}.body`, `Section ${index + 1} needs some body text.`));
  });
  draft.sources.forEach((source, index) => {
    issues.push(...required(source.title, `source.${source.id}.title`, `Source ${index + 1} needs a title.`));
    if (!isValidHttpUrl(source.url)) {
      issues.push({
        field: `source.${source.id}.url`,
        message: `Source ${index + 1} needs a valid http(s) link.`,
      });
    }
  });
  return issues;
}

export function validateVisuals(draft: CampaignDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!draft.adImageKey && !draft.adImageUri) {
    issues.push({ field: 'adImageKey', message: 'Choose an advertising image.' });
  }
  issues.push(...required(draft.adHeadline, 'adHeadline', 'Add an ad headline.'));
  if (draft.adHeadline.trim().length > MAX_AD_HEADLINE_LENGTH) {
    issues.push({
      field: 'adHeadline',
      message: `Keep the ad headline to ${MAX_AD_HEADLINE_LENGTH} characters or fewer.`,
    });
  }
  issues.push(...required(draft.adDescription, 'adDescription', 'Add an ad description.'));
  issues.push(...required(draft.callToAction, 'callToAction', 'Choose a call to action.'));
  return issues;
}

export function validateReach(draft: CampaignDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (draft.targetLocations.length === 0) {
    issues.push({ field: 'targetLocations', message: 'Choose at least one location.' });
  }
  if (draft.audienceInterests.length === 0) {
    issues.push({ field: 'audienceInterests', message: 'Choose at least one audience interest.' });
  }
  if (draft.channels.length === 0) {
    issues.push({ field: 'channels', message: 'Choose at least one distribution channel.' });
  }
  if (
    !Number.isFinite(draft.durationDays) ||
    draft.durationDays < MIN_DURATION_DAYS ||
    draft.durationDays > MAX_DURATION_DAYS
  ) {
    issues.push({
      field: 'durationDays',
      message: `Duration must be between ${MIN_DURATION_DAYS} and ${MAX_DURATION_DAYS} days.`,
    });
  }
  if (!Number.isFinite(draft.distributionBudget) || draft.distributionBudget <= 0) {
    issues.push({
      field: 'distributionBudget',
      message: 'Enter a proposed distribution budget greater than zero.',
    });
  }
  return issues;
}

export function validateSubmit(draft: CampaignDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (!Number.isFinite(draft.fundingGoal) || draft.fundingGoal <= 0) {
    issues.push({
      field: 'fundingGoal',
      message: 'Enter a funding goal greater than zero. This is the only place the goal is set.',
    });
  }
  if (!draft.policyConfirmed) {
    issues.push({
      field: 'policyConfirmed',
      message: 'Confirm the policy before submitting for review.',
    });
  }
  return issues;
}

export const STEP_VALIDATORS: Record<WizardStepKey, (draft: CampaignDraft) => ValidationIssue[]> = {
  basics: validateBasics,
  story: validateStory,
  visuals: validateVisuals,
  reach: validateReach,
  submit: validateSubmit,
};

/** Every rule across all five steps — used before final submission. */
export function validateDraft(draft: CampaignDraft): ValidationIssue[] {
  return [
    ...validateBasics(draft),
    ...validateStory(draft),
    ...validateVisuals(draft),
    ...validateReach(draft),
    ...validateSubmit(draft),
  ];
}

export function isStepValid(draft: CampaignDraft, key: WizardStepKey): boolean {
  return STEP_VALIDATORS[key](draft).length === 0;
}

export function issueFor(issues: ValidationIssue[], field: string): string | null {
  return issues.find((issue) => issue.field === field)?.message ?? null;
}
