import coverRiverWardens from '../../assets/campaigns/cover-river-wardens.png';
import adRiverWardens from '../../assets/campaigns/ad-river-wardens.png';
import storyRiverWardens1 from '../../assets/campaigns/story-river-wardens-1.png';
import coverStemLab from '../../assets/campaigns/cover-stem-lab.png';
import adStemLab from '../../assets/campaigns/ad-stem-lab.png';
import storyStemLab1 from '../../assets/campaigns/story-stem-lab-1.png';
import coverAirMonitors from '../../assets/campaigns/cover-air-monitors.png';
import adAirMonitors from '../../assets/campaigns/ad-air-monitors.png';
import storyAirMonitors1 from '../../assets/campaigns/story-air-monitors-1.png';
import coverMangroveGuards from '../../assets/campaigns/cover-mangrove-guards.png';
import adMangroveGuards from '../../assets/campaigns/ad-mangrove-guards.png';
import storyMangroveGuards1 from '../../assets/campaigns/story-mangrove-guards-1.png';
import coverHearingScreening from '../../assets/campaigns/cover-hearing-screening.png';
import adHearingScreening from '../../assets/campaigns/ad-hearing-screening.png';
import storyHearingScreening1 from '../../assets/campaigns/story-hearing-screening-1.png';
import coverOpenTextbook from '../../assets/campaigns/cover-open-textbook.png';
import adOpenTextbook from '../../assets/campaigns/ad-open-textbook.png';
import storyOpenTextbook1 from '../../assets/campaigns/story-open-textbook-1.png';
import coverNightBusSafety from '../../assets/campaigns/cover-night-bus-safety.png';
import adNightBusSafety from '../../assets/campaigns/ad-night-bus-safety.png';
import storyNightBusSafety1 from '../../assets/campaigns/story-night-bus-safety-1.png';
import coverWomenInTrades from '../../assets/campaigns/cover-women-in-trades.png';
import adWomenInTrades from '../../assets/campaigns/ad-women-in-trades.png';
import storyWomenInTrades1 from '../../assets/campaigns/story-women-in-trades-1.png';
import coverOralHistory from '../../assets/campaigns/cover-oral-history.png';
import adOralHistory from '../../assets/campaigns/ad-oral-history.png';
import storyOralHistory1 from '../../assets/campaigns/story-oral-history-1.png';

/**
 * Every bundled campaign visual, addressed by a stable string key.
 *
 * Campaign seed data stores keys (not paths or URLs), so the category of
 * "which image" stays decoupled from "how it is loaded". Regenerate the files
 * with `node scripts/generate-campaign-assets.cjs`.
 */
export const CAMPAIGN_IMAGES = {
  'cover-river-wardens': coverRiverWardens,
  'ad-river-wardens': adRiverWardens,
  'story-river-wardens-1': storyRiverWardens1,
  'cover-stem-lab': coverStemLab,
  'ad-stem-lab': adStemLab,
  'story-stem-lab-1': storyStemLab1,
  'cover-air-monitors': coverAirMonitors,
  'ad-air-monitors': adAirMonitors,
  'story-air-monitors-1': storyAirMonitors1,
  'cover-mangrove-guards': coverMangroveGuards,
  'ad-mangrove-guards': adMangroveGuards,
  'story-mangrove-guards-1': storyMangroveGuards1,
  'cover-hearing-screening': coverHearingScreening,
  'ad-hearing-screening': adHearingScreening,
  'story-hearing-screening-1': storyHearingScreening1,
  'cover-open-textbook': coverOpenTextbook,
  'ad-open-textbook': adOpenTextbook,
  'story-open-textbook-1': storyOpenTextbook1,
  'cover-night-bus-safety': coverNightBusSafety,
  'ad-night-bus-safety': adNightBusSafety,
  'story-night-bus-safety-1': storyNightBusSafety1,
  'cover-women-in-trades': coverWomenInTrades,
  'ad-women-in-trades': adWomenInTrades,
  'story-women-in-trades-1': storyWomenInTrades1,
  'cover-oral-history': coverOralHistory,
  'ad-oral-history': adOralHistory,
  'story-oral-history-1': storyOralHistory1,
} as const;

export type CampaignImageKey = keyof typeof CAMPAIGN_IMAGES;

export function getCampaignImageSource(key?: string | null): number | null {
  if (!key) {
    return null;
  }
  const images = CAMPAIGN_IMAGES as Record<string, number>;
  return images[key] ?? null;
}
