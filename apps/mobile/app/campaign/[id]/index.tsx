import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Share, StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  DEMO_ASSUMPTION_NOTES,
  DEMO_REFUND_POLICY,
  calculateUseOfFunds,
  createId,
  estimateImpressionsForGoal,
  formatDate,
  formatImpressions,
  formatINR,
  isFundingOpen,
  isValidHttpUrl,
  type Campaign,
  type FeedbackChoice,
  type Feedback,
} from '@campaign/shared';
import {
  AppText,
  Button,
  Card,
  Chip,
  DemoBadge,
  ErrorState,
  LoadingState,
  ProgressBar,
  ScreenContainer,
  SectionHeader,
  StatusPill,
} from '../../../src/components';
import { CampaignImage } from '../../../src/features/campaigns/CampaignImage';
import { getCampaignRepository } from '../../../src/services';
import { useAppStore } from '../../../src/store';
import { colors, radius, spacing } from '../../../src/theme';

const CHANNEL_LABELS: Record<string, string> = {
  social_feed: 'Social feed',
  stories: 'Stories',
  search: 'Search',
  display: 'Display',
};

const FEEDBACK_OPTIONS: { value: FeedbackChoice; label: string }[] = [
  { value: 'no', label: 'No' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'yes', label: 'Yes' },
];

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const guestKey = useAppStore((state) => state.guestKey);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [fundsOpen, setFundsOpen] = useState(false);
  const [creativeEncouraged, setCreativeEncouraged] = useState<FeedbackChoice | null>(null);
  const [messageChanged, setMessageChanged] = useState<FeedbackChoice | null>(null);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    let active = true;
    async function run() {
      setStatus('loading');
      try {
        const result = await getCampaignRepository().getCampaign(String(id));
        if (active) {
          setCampaign(result);
          setStatus('ready');
        }
      } catch {
        if (active) {
          setStatus('error');
        }
      }
    }
    void run();
    return () => {
      active = false;
    };
  }, [id]);

  const useOfFunds = useMemo(
    () => (campaign ? calculateUseOfFunds(campaign.fundingGoal, campaign.budgetAllocation) : null),
    [campaign],
  );

  if (status === 'loading') {
    return (
      <ScreenContainer scroll={false}>
        <LoadingState message="Loading campaign…" />
      </ScreenContainer>
    );
  }

  if (status === 'error' || !campaign || !useOfFunds) {
    return (
      <ScreenContainer>
        <Button
          label="Back"
          onPress={() => router.back()}
          variant="ghost"
          icon="arrow-back"
          size="medium"
        />
        <ErrorState
          title="Campaign not found"
          message="This campaign id does not exist in the demo repository. It may have been removed."
          onRetry={() => router.replace('/explore')}
          retryLabel="Go to Explore"
        />
      </ScreenContainer>
    );
  }

  const fundingOpen = isFundingOpen(campaign.status);
  const current: Campaign = campaign;
  const canSubmitFeedback =
    creativeEncouraged !== null && messageChanged !== null && feedbackState !== 'saved';

  async function submitFeedback() {
    if (creativeEncouraged === null || messageChanged === null) {
      return;
    }
    setFeedbackState('saving');
    const entry: Feedback = {
      id: createId('feedback'),
      campaignId: current.id,
      guestKey: guestKey.length > 0 ? guestKey : null,
      creativeEncouraged,
      messageChanged,
      createdAt: new Date().toISOString(),
    };
    try {
      await getCampaignRepository().saveFeedback(entry);
      setFeedbackState('saved');
    } catch {
      setFeedbackState('error');
    }
  }

  async function shareCampaign() {
    try {
      await Share.share({
        message: `${current.title} by ${current.creatorName} — on Campaign Amplification (demo). Contributions fund message distribution, not the cause directly.`,
      });
    } catch {
      // The user dismissed the share sheet; nothing to report.
    }
  }

  return (
    <ScreenContainer subtitle={`by ${campaign.creatorName} · ${campaign.category}`}>
      <Button
        label="Back"
        onPress={() => router.back()}
        variant="ghost"
        icon="arrow-back"
        size="medium"
        style={styles.backButton}
      />

      <CampaignImage
        imageKey={campaign.coverImageKey}
        uri={campaign.coverImageUri}
        style={styles.cover}
        accessibilityLabel={`Cover image for ${campaign.title}`}
      />

      <View style={styles.titleBlock}>
        <View style={styles.metaRow}>
          <AppText variant="overline" color={colors.primary}>
            {campaign.category.toUpperCase()}
          </AppText>
          <StatusPill status={campaign.status} size="small" />
        </View>
        <AppText variant="title" accessibilityRole="header">
          {campaign.title}
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {campaign.summary}
        </AppText>
      </View>

      <Card style={styles.disclaimerCard}>
        <AppText variant="subheading">What your contribution funds</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Contributions fund the distribution and amplification of this message across the campaign’s
          audience. They are <AppText variant="label">not</AppText> a donation to the cause, person, or
          organisation named in the message, and the creator receives no cash.
        </AppText>
      </Card>

      <Card>
        <AppText variant="subheading">Funding</AppText>
        <ProgressBar
          value={campaign.fundingRaised}
          max={campaign.fundingGoal}
          label={`${formatINR(campaign.fundingRaised)} raised of ${formatINR(campaign.fundingGoal)}`}
          accessibilityLabel={`${formatINR(campaign.fundingRaised)} raised of ${formatINR(campaign.fundingGoal)}`}
        />
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <AppText variant="caption" color={colors.textSecondary}>
              Goal
            </AppText>
            <AppText variant="label">{formatINR(campaign.fundingGoal)}</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="caption" color={colors.textSecondary}>
              Raised (demo)
            </AppText>
            <AppText variant="label">{formatINR(campaign.fundingRaised)}</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="caption" color={colors.textSecondary}>
              Closes
            </AppText>
            <AppText variant="label">{formatDate(campaign.deadline) || 'Open'}</AppText>
          </View>
        </View>
        <AppText variant="caption" color={colors.textMuted}>
          Reaching the goal does not start advertising automatically — distribution setup is required
          first.
        </AppText>
      </Card>

      <Card>
        <SectionHeader title="Story" subtitle="The message this campaign is asking people to see" />
        {campaign.storyHeadline ? (
          <AppText variant="subheading">{campaign.storyHeadline}</AppText>
        ) : null}
        <AppText variant="body">{campaign.storyIntro}</AppText>
        {campaign.storySections.map((section) => (
          <View key={section.id} style={styles.section}>
            <AppText variant="label">{section.heading}</AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              {section.body}
            </AppText>
          </View>
        ))}
        {campaign.storyImages.map((image) => (
          <View key={image.id} style={styles.storyImage}>
            <CampaignImage
              imageKey={image.imageKey}
              uri={image.uri}
              style={styles.storyImageAsset}
              accessibilityLabel={image.caption}
            />
            <AppText variant="caption" color={colors.textSecondary}>
              {image.caption}
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {image.credit}
            </AppText>
          </View>
        ))}
      </Card>

      <Card>
        <SectionHeader title="Ad creative" subtitle="What people in the audience will actually see" />
        <CampaignImage
          imageKey={campaign.adAssets.adImageKey}
          uri={campaign.adAssets.adImageUri}
          style={styles.adImage}
          accessibilityLabel={`Ad creative for ${campaign.title}`}
        />
        <AppText variant="label">{campaign.adHeadline}</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {campaign.adDescription}
        </AppText>
        <AppText variant="caption" color={colors.primary}>
          Call to action: {campaign.callToAction}
        </AppText>
        <View style={styles.divider} />
        <AppText variant="label">Who this reaches</AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Locations: {campaign.targetLocations.join(', ') || 'Not specified'}
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Interests:{' '}
          {campaign.audienceInterests.map((interest) => `#${interest}`).join('  ') || 'Not specified'}
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Channels: {campaign.channels.map((channel) => CHANNEL_LABELS[channel] ?? channel).join(', ')}
        </AppText>
      </Card>

      <Card>
        <SectionHeader
          title="Use of funds"
          subtitle="Illustrative demo split of the funding goal"
          actionLabel={fundsOpen ? 'Hide' : 'Show'}
          onAction={() => setFundsOpen((value) => !value)}
        />
        {fundsOpen ? (
          <View style={styles.fundsList}>
            <FundsRow
              label={`Platform / processing fee (${Math.round(useOfFunds.platformFee / useOfFunds.grossAmount * 1000) / 10}%)`}
              value={formatINR(useOfFunds.platformFee)}
            />
            <FundsRow
              label={`Advertising budget (${useOfFunds.advertisingSharePercent}% of net)`}
              value={formatINR(useOfFunds.advertisingBudget)}
            />
            <FundsRow
              label={`Contingency reserve (${useOfFunds.contingencySharePercent}% of net)`}
              value={formatINR(useOfFunds.contingencyBudget)}
            />
            <View style={styles.divider} />
            <FundsRow label="Total funding goal" value={formatINR(useOfFunds.grossAmount)} emphasis />
            <AppText variant="caption" color={colors.textSecondary}>
              {DEMO_REFUND_POLICY}
            </AppText>
            <AppText variant="caption" color={colors.textMuted}>
              {DEMO_ASSUMPTION_NOTES.allocation}
            </AppText>
          </View>
        ) : (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Expand to see how the goal splits into fees, advertising budget, and a contingency reserve.
          </AppText>
        )}
      </Card>

      <Card>
        <SectionHeader title="Estimated reach" subtitle="What the number means and what it does not" />
        <AppText variant="bodySmall" color={colors.textSecondary}>
          At the {formatINR(campaign.fundingGoal)} goal: about{' '}
          {formatImpressions(estimateImpressionsForGoal(campaign.fundingGoal))} estimated impressions. At
          the {formatINR(campaign.fundingRaised)} raised so far: about{' '}
          {formatImpressions(estimateImpressionsForGoal(campaign.fundingRaised))} estimated impressions.
        </AppText>
        <DemoBadge tone="estimate" />
        <View style={styles.divider} />
        <AppText variant="label">Assumptions</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {DEMO_ASSUMPTION_NOTES.fee}
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {DEMO_ASSUMPTION_NOTES.impressions}
        </AppText>
        <View style={styles.divider} />
        <AppText variant="label">Impressions vs unique reach</AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          {DEMO_ASSUMPTION_NOTES.reach}
        </AppText>
      </Card>

      <Card>
        <SectionHeader title="Sources" subtitle="References the creator cites for this message" />
        {campaign.sources.length === 0 ? (
          <AppText variant="bodySmall" color={colors.textSecondary}>
            No sources provided.
          </AppText>
        ) : (
          campaign.sources.map((source) => {
            const linkable = isValidHttpUrl(source.url);
            return (
              <View key={source.id} style={styles.sourceRow}>
                <Ionicons
                  name={linkable ? 'open-outline' : 'document-text-outline'}
                  size={16}
                  color={linkable ? colors.info : colors.textMuted}
                />
                {linkable ? (
                  <AppText
                    variant="bodySmall"
                    color={colors.info}
                    accessibilityRole="link"
                    onPress={() => void Linking.openURL(source.url)}
                    style={styles.sourceText}
                  >
                    {source.title}
                  </AppText>
                ) : (
                  <AppText variant="bodySmall" color={colors.textSecondary} style={styles.sourceText}>
                    {source.title} (link unavailable)
                  </AppText>
                )}
              </View>
            );
          })
        )}
        <AppText variant="caption" color={colors.textMuted}>
          Demo sources point to example.org. No claim here has been independently verified.
        </AppText>
      </Card>

      <Card>
        <SectionHeader title="Campaign feedback" subtitle="Two quick questions about this message" />
        {feedbackState === 'saved' ? (
          <View style={styles.feedbackSaved}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <AppText variant="bodySmall" color={colors.textSecondary}>
              Thanks — your feedback is saved on this device. It helps show how people react to campaign
              creative.
            </AppText>
          </View>
        ) : (
          <>
            <FeedbackQuestion
              question="Did this creative encourage you to take part?"
              value={creativeEncouraged}
              onChange={setCreativeEncouraged}
            />
            <FeedbackQuestion
              question="Did it change how you think about the issue?"
              value={messageChanged}
              onChange={setMessageChanged}
            />
            {feedbackState === 'error' ? (
              <AppText variant="caption" color={colors.error}>
                Could not save feedback. Please try again.
              </AppText>
            ) : null}
            <Button
              label="Submit feedback"
              onPress={() => void submitFeedback()}
              disabled={!canSubmitFeedback}
              loading={feedbackState === 'saving'}
              variant="secondary"
              size="medium"
            />
          </>
        )}
      </Card>

      {fundingOpen ? (
        <Card style={styles.ctaCard}>
          <AppText variant="subheading">Back this campaign</AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            Contributions fund message distribution, not the cause directly. The contribution flow opens in
            the next phase — this button takes you to its placeholder so nothing pretends to charge you.
          </AppText>
          <Button
            label="Back this campaign"
            onPress={() => router.push(`/campaign/${campaign.id}/contribute`)}
            icon="megaphone-outline"
          />
        </Card>
      ) : (
        <Card>
          <AppText variant="subheading">Funding is closed</AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            This campaign is {campaign.status === 'COMPLETED' ? 'completed' : 'past its funding stage'}.
            New contributions are not accepted, so no contribution button is shown. You can still share the
            message.
          </AppText>
          <Button
            label="Share this campaign"
            onPress={() => void shareCampaign()}
            variant="secondary"
            icon="share-outline"
          />
        </Card>
      )}

      <Button
        label="Share this campaign"
        onPress={() => void shareCampaign()}
        variant="ghost"
        icon="share-social-outline"
      />

      <AppText variant="caption" color={colors.textMuted}>
        Demo campaign. Figures and estimates are illustrative and unverified.
      </AppText>
    </ScreenContainer>
  );
}

function FundsRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <View style={styles.fundsRow}>
      <AppText variant={emphasis ? 'label' : 'bodySmall'} color={emphasis ? colors.text : colors.textSecondary}>
        {label}
      </AppText>
      <AppText variant={emphasis ? 'label' : 'bodySmall'}>{value}</AppText>
    </View>
  );
}

function FeedbackQuestion({
  question,
  value,
  onChange,
}: {
  question: string;
  value: FeedbackChoice | null;
  onChange: (choice: FeedbackChoice) => void;
}) {
  return (
    <View style={styles.question}>
      <AppText variant="bodySmall">{question}</AppText>
      <View style={styles.chipWrap}>
        {FEEDBACK_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={value === option.value}
            accessibilityLabel={`${question} ${option.label}`}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
  },
  cover: {
    height: 216,
    borderRadius: radius.lg,
  },
  titleBlock: {
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  disclaimerCard: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primaryMuted,
  },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  stat: {
    gap: spacing.xxs,
  },
  section: {
    gap: spacing.xs,
    borderLeftWidth: 2,
    borderLeftColor: colors.border,
    paddingLeft: spacing.md,
    borderRadius: radius.sm,
  },
  storyImage: {
    gap: spacing.xs,
  },
  storyImageAsset: {
    height: 172,
    borderRadius: radius.md,
  },
  adImage: {
    height: 186,
    borderRadius: radius.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
  fundsList: {
    gap: spacing.sm,
  },
  fundsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sourceText: {
    flex: 1,
  },
  question: {
    gap: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  feedbackSaved: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  ctaCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },
});
