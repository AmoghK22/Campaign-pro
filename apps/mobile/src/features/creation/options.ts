import type { DistributionChannel } from '@campaign/shared';

export const LOCATION_OPTIONS: string[] = [
  'Nationwide',
  'Kochi',
  'Thiruvananthapuram',
  'Bengaluru',
  'Chennai',
  'Hyderabad',
  'Mumbai',
  'Pune',
  'Delhi NCR',
  'Kolkata',
];

export const INTEREST_OPTIONS: string[] = [
  'Environment',
  'Public health',
  'Education',
  'Civic engagement',
  'Science',
  'Local community',
  'Youth',
  'Women & girls',
  'Climate',
  'Animal welfare',
];

export const AUDIENCE_ACTION_OPTIONS: string[] = [
  'Read the full story',
  'Sign up for updates',
  'Volunteer with us',
  'Attend an event',
  'Share with your network',
];

export interface ChannelOption {
  value: DistributionChannel;
  label: string;
  description: string;
}

export const CHANNEL_OPTIONS: ChannelOption[] = [
  { value: 'social_feed', label: 'Social feed', description: 'Sponsored posts in the main feed.' },
  { value: 'stories', label: 'Stories', description: 'Full-screen vertical placements.' },
  { value: 'search', label: 'Search', description: 'Promoted results for relevant queries.' },
  { value: 'display', label: 'Display', description: 'Banner placements across partner sites.' },
];

export const CALL_TO_ACTION_OPTIONS: string[] = [
  'Learn more',
  'Sign up',
  'Volunteer',
  'Share',
  'Donate time',
  'Read the story',
];

export function channelLabel(channel: DistributionChannel): string {
  return CHANNEL_OPTIONS.find((option) => option.value === channel)?.label ?? channel;
}
