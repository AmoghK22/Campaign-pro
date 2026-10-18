import {
  createId,
  type CampaignDraft,
  type CampaignSource,
  type CampaignStatistic,
  type StoryImage,
  type StorySection,
} from '@campaign/shared';

const MAX_SECTIONS = 12;
const MAX_SOURCES = 12;
const MAX_STORY_IMAGES = 8;
const MAX_STATISTICS = 8;

/**
 * Pure, immutable draft edits for the Story step. Keeping these separate from
 * the store makes add/remove/reorder behaviour unit-testable.
 */

export function addSection(draft: CampaignDraft): CampaignDraft {
  if (draft.storySections.length >= MAX_SECTIONS) {
    return draft;
  }
  const section: StorySection = { id: createId('section'), heading: '', body: '' };
  return { ...draft, storySections: [...draft.storySections, section] };
}

export function updateSection(
  draft: CampaignDraft,
  id: string,
  patch: Partial<Pick<StorySection, 'heading' | 'body'>>,
): CampaignDraft {
  return {
    ...draft,
    storySections: draft.storySections.map((section) =>
      section.id === id ? { ...section, ...patch } : section,
    ),
  };
}

export function removeSection(draft: CampaignDraft, id: string): CampaignDraft {
  return { ...draft, storySections: draft.storySections.filter((section) => section.id !== id) };
}

export function moveSection(
  draft: CampaignDraft,
  id: string,
  direction: 'up' | 'down',
): CampaignDraft {
  const index = draft.storySections.findIndex((section) => section.id === id);
  if (index < 0) {
    return draft;
  }
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= draft.storySections.length) {
    return draft;
  }
  const next = draft.storySections.slice();
  [next[index], next[target]] = [next[target], next[index]];
  return { ...draft, storySections: next };
}

export function addSource(draft: CampaignDraft): CampaignDraft {
  if (draft.sources.length >= MAX_SOURCES) {
    return draft;
  }
  const source: CampaignSource = { id: createId('source'), title: '', url: '' };
  return { ...draft, sources: [...draft.sources, source] };
}

export function updateSource(
  draft: CampaignDraft,
  id: string,
  patch: Partial<Pick<CampaignSource, 'title' | 'url'>>,
): CampaignDraft {
  return {
    ...draft,
    sources: draft.sources.map((source) => (source.id === id ? { ...source, ...patch } : source)),
  };
}

export function removeSource(draft: CampaignDraft, id: string): CampaignDraft {
  return { ...draft, sources: draft.sources.filter((source) => source.id !== id) };
}

export function addStoryImage(draft: CampaignDraft, imageKey: string): CampaignDraft {
  if (draft.storyImages.length >= MAX_STORY_IMAGES) {
    return draft;
  }
  const image: StoryImage = {
    id: createId('storyimg'),
    uri: null,
    imageKey,
    caption: '',
    credit: '',
  };
  return { ...draft, storyImages: [...draft.storyImages, image] };
}

export function updateStoryImage(
  draft: CampaignDraft,
  id: string,
  patch: Partial<Pick<StoryImage, 'caption' | 'credit' | 'imageKey'>>,
): CampaignDraft {
  return {
    ...draft,
    storyImages: draft.storyImages.map((image) =>
      image.id === id ? { ...image, ...patch } : image,
    ),
  };
}

export function removeStoryImage(draft: CampaignDraft, id: string): CampaignDraft {
  return { ...draft, storyImages: draft.storyImages.filter((image) => image.id !== id) };
}

export function addStatistic(draft: CampaignDraft): CampaignDraft {
  if (draft.statistics.length >= MAX_STATISTICS) {
    return draft;
  }
  const stat: CampaignStatistic = { id: createId('stat'), label: '', value: '' };
  return { ...draft, statistics: [...draft.statistics, stat] };
}

export function updateStatistic(
  draft: CampaignDraft,
  id: string,
  patch: Partial<Pick<CampaignStatistic, 'label' | 'value'>>,
): CampaignDraft {
  return {
    ...draft,
    statistics: draft.statistics.map((stat) =>
      stat.id === id ? { ...stat, ...patch } : stat,
    ),
  };
}

export function removeStatistic(draft: CampaignDraft, id: string): CampaignDraft {
  return { ...draft, statistics: draft.statistics.filter((stat) => stat.id !== id) };
}

export function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}
