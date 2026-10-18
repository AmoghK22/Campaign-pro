import { CAMPAIGN_IMAGES } from '../../assets/campaignImages';

export interface ImageOption {
  /** Key into the bundled asset registry (`CAMPAIGN_IMAGES`). */
  key: string;
  label: string;
}

function labelFromKey(key: string): string {
  return key
    .replace(/^(cover|ad|story)-/, '')
    .replace(/-\d+$/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function optionsWithPrefix(prefix: string): ImageOption[] {
  return Object.keys(CAMPAIGN_IMAGES)
    .filter((key) => key.startsWith(prefix))
    .map((key) => ({ key, label: labelFromKey(key) }));
}

/**
 * Bundled demo artwork offered by the image picker. This build selects from
 * local assets only — there is no device gallery upload and no AI image
 * generation, and the UI says so honestly.
 */
export const COVER_IMAGE_OPTIONS: ImageOption[] = optionsWithPrefix('cover-');
export const AD_IMAGE_OPTIONS: ImageOption[] = optionsWithPrefix('ad-');
export const STORY_IMAGE_OPTIONS: ImageOption[] = optionsWithPrefix('story-');
