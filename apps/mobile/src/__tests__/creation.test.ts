import { describe, expect, it } from 'vitest';
import { createEmptyDraft, createId, type CampaignDraft } from '@campaign/shared';
import { getCampaignImageSource } from '@app/assets/campaignImages';
import {
  FIRST_STEP,
  LAST_STEP,
  WIZARD_STEPS,
  nextStepKey,
  previousStepKey,
  stepIndexForKey,
  stepMeta,
} from '@app/features/creation/steps';
import {
  AD_IMAGE_OPTIONS,
  COVER_IMAGE_OPTIONS,
  STORY_IMAGE_OPTIONS,
} from '@app/features/creation/assets';
import { channelLabel } from '@app/features/creation/options';
import {
  addSection,
  addSource,
  addStatistic,
  addStoryImage,
  moveSection,
  removeSection,
  toggleValue,
  updateSection,
} from '@app/features/creation/draftOps';
import {
  STEP_VALIDATORS,
  isStepValid,
  issueFor,
  validateBasics,
  validateDraft,
  validateReach,
  validateStory,
  validateSubmit,
  validateVisuals,
} from '@app/features/creation/validation';
import { buildSubmission } from '@app/features/creation/submission';

const NOW = '2026-01-01T00:00:00.000Z';

function draftBase(): CampaignDraft {
  return createEmptyDraft('draft-test', NOW);
}

function validDraft(): CampaignDraft {
  const draft = draftBase();
  const section = addSection(draft);
  return {
    ...section,
    title: 'Restore the night bus',
    category: 'Community',
    creatorName: 'Night Shift Alliance',
    summary: 'A push to restore late-night service on Route 14.',
    coverImageKey: 'cover-night-bus-safety',
    storyHeadline: 'Why the last bus matters',
    storyIntro: 'Thousands of workers lost their only way home.',
    storySections: updateSection(section, section.storySections[0].id, {
      heading: 'The cut',
      body: 'Route 14 used to run until midnight.',
    }).storySections,
    adImageKey: 'ad-night-bus-safety',
    adHeadline: 'Bring back the night bus',
    adDescription: 'Restore late-night service on Route 14.',
    callToAction: 'Sign up',
    targetLocations: ['Kochi'],
    audienceInterests: ['Civic engagement'],
    channels: ['social_feed'],
    durationDays: 14,
    distributionBudget: 5000,
    fundingGoal: 25000,
    policyConfirmed: true,
  };
}

describe('wizard steps', () => {
  it('defines exactly five steps in the required order', () => {
    expect(WIZARD_STEPS.map((step) => step.key)).toEqual([
      'basics',
      'story',
      'visuals',
      'reach',
      'submit',
    ]);
    expect(WIZARD_STEPS.map((step) => step.index)).toEqual([1, 2, 3, 4, 5]);
    expect(FIRST_STEP).toBe(1);
    expect(LAST_STEP).toBe(5);
  });

  it('clamps out-of-range indices', () => {
    expect(stepMeta(0).key).toBe('basics');
    expect(stepMeta(99).key).toBe('submit');
    expect(stepIndexForKey('visuals')).toBe(3);
  });

  it('navigates forward and backward with nulls at the ends', () => {
    expect(nextStepKey('basics')).toBe('story');
    expect(nextStepKey('submit')).toBeNull();
    expect(previousStepKey('submit')).toBe('reach');
    expect(previousStepKey('basics')).toBeNull();
  });
});

describe('bundled image options', () => {
  it('only offers artwork that actually exists in the asset registry', () => {
    for (const option of [...COVER_IMAGE_OPTIONS, ...AD_IMAGE_OPTIONS, ...STORY_IMAGE_OPTIONS]) {
      expect(getCampaignImageSource(option.key), option.key).not.toBeNull();
      expect(option.label.length).toBeGreaterThan(0);
    }
  });

  it('offers cover, ad, and story artwork with the right prefixes', () => {
    expect(COVER_IMAGE_OPTIONS.length).toBeGreaterThan(0);
    expect(COVER_IMAGE_OPTIONS.every((option) => option.key.startsWith('cover-'))).toBe(true);
    expect(AD_IMAGE_OPTIONS.every((option) => option.key.startsWith('ad-'))).toBe(true);
    expect(STORY_IMAGE_OPTIONS.every((option) => option.key.startsWith('story-'))).toBe(true);
  });
});

describe('draft operations are immutable and bounded', () => {
  it('adds, edits, reorders, and removes sections', () => {
    const first = addSection(draftBase());
    const second = addSection(first);
    expect(second.storySections).toHaveLength(2);
    expect(first.storySections).toHaveLength(1);

    const edited = updateSection(second, second.storySections[0].id, { heading: 'One' });
    expect(edited.storySections[0].heading).toBe('One');
    expect(second.storySections[0].heading).toBe('');

    const moved = moveSection(edited, edited.storySections[1].id, 'up');
    expect(moved.storySections[0].id).toBe(second.storySections[1].id);

    const removed = removeSection(moved, moved.storySections[0].id);
    expect(removed.storySections).toHaveLength(1);
  });

  it('does not move a section past the ends', () => {
    const draft = addSection(addSection(draftBase()));
    expect(moveSection(draft, draft.storySections[0].id, 'up')).toBe(draft);
    expect(moveSection(draft, draft.storySections[1].id, 'down')).toBe(draft);
  });

  it('adds story images, sources, and statistics', () => {
    const withSource = addSource(addSource(draftBase()));
    expect(withSource.sources).toHaveLength(2);

    const withStat = addStatistic(draftBase());
    expect(withStat.statistics).toHaveLength(1);

    const withImage = addStoryImage(draftBase(), 'story-night-bus-safety-1');
    expect(withImage.storyImages[0].imageKey).toBe('story-night-bus-safety-1');
    expect(withImage.storyImages[0].uri).toBeNull();
  });

  it('toggles array membership without mutating the input', () => {
    const list = ['a'];
    expect(toggleValue(list, 'a')).toEqual([]);
    expect(toggleValue(list, 'b')).toEqual(['a', 'b']);
    expect(list).toEqual(['a']);
  });

  it('labels distribution channels', () => {
    expect(channelLabel('social_feed')).toBe('Social feed');
    expect(channelLabel('display')).toBe('Display');
  });
});

describe('validation gates each step', () => {
  it('rejects an empty basics step and accepts a filled one', () => {
    const issues = validateBasics(draftBase());
    expect(issues.map((issue) => issue.field)).toEqual(
      expect.arrayContaining(['title', 'category', 'creatorName', 'summary']),
    );
    expect(validateBasics(validDraft())).toHaveLength(0);
  });

  it('requires a title within the character limit', () => {
    const draft = { ...draftBase(), title: 'x'.repeat(61) };
    expect(issueFor(validateBasics(draft), 'title')).toMatch(/60 characters/);
  });

  it('requires story content and valid source links', () => {
    expect(validateStory(draftBase()).length).toBeGreaterThan(0);
    const draft: CampaignDraft = {
      ...validDraft(),
      sources: [{ id: 's1', title: 'Report', url: 'not-a-url' }],
    };
    expect(issueFor(validateStory(draft), 'source.s1.url')).toBeTruthy();
    expect(validateStory({ ...draft, sources: [{ id: 's1', title: 'Report', url: 'https://example.org' }] })).toHaveLength(0);
  });

  it('requires the advertising creative and copy', () => {
    expect(validateVisuals(draftBase()).map((issue) => issue.field)).toEqual(
      expect.arrayContaining(['adImageKey', 'adHeadline', 'adDescription', 'callToAction']),
    );
    expect(validateVisuals(validDraft())).toHaveLength(0);
  });

  it('requires audience targeting and a positive budget', () => {
    const draft = validDraft();
    expect(validateReach({ ...draft, channels: [] }).some((issue) => issue.field === 'channels')).toBe(true);
    expect(validateReach({ ...draft, durationDays: 0 }).some((issue) => issue.field === 'durationDays')).toBe(true);
    expect(
      validateReach({ ...draft, distributionBudget: 0 }).some(
        (issue) => issue.field === 'distributionBudget',
      ),
    ).toBe(true);
    expect(validateReach(draft)).toHaveLength(0);
  });

  it('sets the funding goal only at submit and requires policy confirmation', () => {
    const draft = validDraft();
    const fields = validateSubmit({ ...draft, fundingGoal: 0, policyConfirmed: false }).map(
      (issue) => issue.field,
    );
    expect(fields).toEqual(['fundingGoal', 'policyConfirmed']);
    expect(validateSubmit(draft)).toHaveLength(0);
    expect(validateDraft(draft)).toHaveLength(0);
    expect(isStepValid(draft, 'submit')).toBe(true);
  });

  it('exposes a validator for every step key', () => {
    for (const step of WIZARD_STEPS) {
      expect(typeof STEP_VALIDATORS[step.key]).toBe('function');
    }
  });
});

describe('submission promotes a draft to review, never beyond', () => {
  it('builds a user campaign awaiting review with a review event', () => {
    const draft = validDraft();
    const { campaign, reviewEvent } = buildSubmission(draft, {
      id: 'campaign-1',
      now: NOW,
      creatorId: 'guest-1',
    });

    expect(campaign.id).toBe('campaign-1');
    expect(campaign.status).toBe('SUBMITTED_FOR_REVIEW');
    expect(campaign.dataOrigin).toBe('user');
    expect(campaign.creatorId).toBe('guest-1');
    expect(campaign.fundingRaised).toBe(0);
    expect(campaign.storyHeadline).toBe('Why the last bus matters');
    expect(campaign.adAssets.adImageKey).toBe('ad-night-bus-safety');

    const days = (Date.parse(campaign.deadline ?? '') - Date.parse(NOW)) / (24 * 60 * 60 * 1000);
    expect(days).toBe(draft.durationDays);

    expect(reviewEvent.campaignId).toBe('campaign-1');
    expect(reviewEvent.previousStatus).toBe('DRAFT');
    expect(reviewEvent.newStatus).toBe('SUBMITTED_FOR_REVIEW');
    expect(reviewEvent.actor).toBe('creator');
  });

  it('never yields an approved or advertising status from a submission', () => {
    const { campaign } = buildSubmission(validDraft(), {
      id: createId('campaign'),
      now: NOW,
      creatorId: 'guest-1',
    });
    expect(['APPROVED', 'PROMOTING', 'FUNDING']).not.toContain(campaign.status);
  });
});
