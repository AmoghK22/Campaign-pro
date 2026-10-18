export type CampaignStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_REVIEW'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'AVAILABLE_FOR_FUNDING'
  | 'FUNDING'
  | 'FUNDING_GOAL_REACHED'
  | 'FUNDING_PERIOD_ENDED'
  | 'DISTRIBUTION_PREPARATION'
  | 'PROMOTING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'FAILED';

export type CampaignCategory =
  | 'Environment'
  | 'Health'
  | 'Science'
  | 'Education'
  | 'Public Policy'
  | 'Economic Policy'
  | 'Community'
  | 'Arts & Culture'
  | 'Business'
  | 'Other';

export const CAMPAIGN_CATEGORIES: CampaignCategory[] = [
  'Environment',
  'Health',
  'Science',
  'Education',
  'Public Policy',
  'Economic Policy',
  'Community',
  'Arts & Culture',
  'Business',
  'Other',
];

export type DistributionChannel = 'social_feed' | 'stories' | 'search' | 'display';

export const DISTRIBUTION_CHANNELS: DistributionChannel[] = [
  'social_feed',
  'stories',
  'search',
  'display',
];

export interface StorySection {
  id: string;
  heading: string;
  body: string;
}

export interface CampaignSource {
  id: string;
  title: string;
  url: string;
}

export interface StoryImage {
  id: string;
  uri: string | null;
  /** Key into the app's bundled asset registry (preferred over remote `uri`). */
  imageKey?: string | null;
  caption: string;
  credit: string;
}

export interface CampaignStatistic {
  id: string;
  label: string;
  value: string;
}

export interface AdAssets {
  coverImageUri: string | null;
  adImageUri: string | null;
  /** Key into the app's bundled asset registry (preferred over remote URIs). */
  adImageKey?: string | null;
  hasVideoPlaceholder: boolean;
}

export interface BudgetAllocation {
  advertisingSharePercent: number;
  contingencySharePercent: number;
}

export interface Campaign {
  id: string;
  creatorId: string;
  title: string;
  category: CampaignCategory;
  summary: string;
  creatorName: string;
  coverImageUri: string | null;
  /** Key into the app's bundled asset registry (preferred over remote `coverImageUri`). */
  coverImageKey?: string | null;
  /** Curated flag for the Home hero slot. */
  featured?: boolean;
  /** Editorial story headline, kept separate from the ad headline. */
  storyHeadline?: string | null;
  storyIntro: string;
  storySections: StorySection[];
  storyImages: StoryImage[];
  sources: CampaignSource[];
  statistics: CampaignStatistic[];
  audienceActions: string[];
  adAssets: AdAssets;
  adHeadline: string;
  adDescription: string;
  callToAction: string;
  targetLocations: string[];
  audienceInterests: string[];
  channels: DistributionChannel[];
  budgetAllocation: BudgetAllocation;
  durationDays: number;
  fundingGoal: number;
  fundingRaised: number;
  status: CampaignStatus;
  dataOrigin: 'seed_demo' | 'user';
  createdAt: string;
  submittedAt: string | null;
  deadline: string | null;
  updatedAt: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REJECTED';

export interface Contribution {
  id: string;
  reference: string;
  campaignId: string;
  userId: string | null;
  guestKey: string | null;
  amount: number;
  fee: number;
  total: number;
  estimatedImpressions: number;
  paymentStatus: PaymentStatus;
  isPublicBacker: boolean;
  createdAt: string;
}

export interface Follow {
  id: string;
  campaignId: string;
  guestKey: string;
  createdAt: string;
}

export interface SavedCampaign {
  id: string;
  campaignId: string;
  guestKey: string;
  createdAt: string;
}

export type ActivityEventType =
  | 'SUBMISSION_RECEIVED'
  | 'CHANGES_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'FUNDING_MILESTONE'
  | 'DEADLINE_APPROACHING'
  | 'CONTRIBUTION_SUCCESS'
  | 'CONTRIBUTION_FAILURE'
  | 'PROMOTION_BEGINS'
  | 'PROGRESS_UPDATE'
  | 'CAMPAIGN_COMPLETED'
  | 'REPORT_AVAILABLE'
  | 'CAMPAIGN_UPDATE';

export interface ActivityEvent {
  id: string;
  campaignId: string | null;
  type: ActivityEventType;
  title: string;
  message: string;
  readAt: string | null;
  createdAt: string;
}

export interface CampaignUpdate {
  id: string;
  campaignId: string;
  title: string;
  body: string;
  createdAt: string;
}

export type FeedbackChoice = 'no' | 'somewhat' | 'yes';

export interface Feedback {
  id: string;
  campaignId: string;
  guestKey: string | null;
  creativeEncouraged: FeedbackChoice;
  messageChanged: FeedbackChoice;
  createdAt: string;
}

export interface ReviewEvent {
  id: string;
  campaignId: string;
  actor: string;
  previousStatus: CampaignStatus | null;
  newStatus: CampaignStatus;
  reason: string | null;
  createdAt: string;
}

export interface DistributionReport {
  campaignId: string;
  budgetAllocated: number;
  spend: number;
  impressions: number;
  estimatedReach: number;
  measuredReach: number | null;
  clicks: number | null;
  startAt: string | null;
  endAt: string | null;
  metricNotes: string;
}

export interface CampaignDraft {
  id: string;
  currentStep: number;
  title: string;
  category: CampaignCategory | null;
  creatorName: string;
  summary: string;
  whatItsAbout: string;
  whoItShouldReach: string;
  whyItMatters: string;
  evidence: string;
  coverImageUri: string | null;
  /** Key into the app's bundled asset registry for the chosen cover. */
  coverImageKey: string | null;
  storyHeadline: string;
  storyIntro: string;
  storySections: StorySection[];
  storyImages: StoryImage[];
  sources: CampaignSource[];
  statistics: CampaignStatistic[];
  audienceActions: string[];
  adImageUri: string | null;
  /** Key into the app's bundled asset registry for the chosen ad creative. */
  adImageKey: string | null;
  hasVideoPlaceholder: boolean;
  adHeadline: string;
  adDescription: string;
  callToAction: string;
  targetLocations: string[];
  audienceInterests: string[];
  channels: DistributionChannel[];
  budgetAllocation: BudgetAllocation;
  durationDays: number;
  /** Planning input: how much the creator proposes to spend on distribution. */
  distributionBudget: number;
  fundingGoal: number;
  policyConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

export function createEmptyDraft(
  id: string,
  now: string,
  creatorName = '',
): CampaignDraft {
  return {
    id,
    currentStep: 1,
    title: '',
    category: null,
    creatorName,
    summary: '',
    whatItsAbout: '',
    whoItShouldReach: '',
    whyItMatters: '',
    evidence: '',
    coverImageUri: null,
    coverImageKey: null,
    storyHeadline: '',
    storyIntro: '',
    storySections: [],
    storyImages: [],
    sources: [],
    statistics: [],
    audienceActions: [],
    adImageUri: null,
    adImageKey: null,
    hasVideoPlaceholder: false,
    adHeadline: '',
    adDescription: '',
    callToAction: '',
    targetLocations: [],
    audienceInterests: [],
    channels: [],
    budgetAllocation: {
      advertisingSharePercent: 85,
      contingencySharePercent: 15,
    },
    durationDays: 14,
    distributionBudget: 0,
    fundingGoal: 0,
    policyConfirmed: false,
    createdAt: now,
    updatedAt: now,
  };
}
