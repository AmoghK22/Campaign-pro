import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  CAMPAIGN_CATEGORIES,
  CAMPAIGN_SORTS,
  filterAndSortCampaigns,
  type CampaignCategory,
  type CampaignSort,
} from '@campaign/shared';
import {
  AppText,
  Button,
  Chip,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  ScreenContainer,
} from '../../src/components';
import { CampaignCard } from '../../src/features/campaigns/CampaignCard';
import { useCampaignsStore } from '../../src/store';
import { colors, spacing } from '../../src/theme';

export default function ExploreScreen() {
  const { status, campaigns, error, load } = useCampaignsStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CampaignCategory | null>(null);
  const [sort, setSort] = useState<CampaignSort>('recommended');

  useEffect(() => {
    void load();
  }, [load]);

  const results = useMemo(
    () => filterAndSortCampaigns(campaigns, { search, category, sort }),
    [campaigns, search, category, sort],
  );

  const hasActiveFilters = search.trim().length > 0 || category !== null || sort !== 'recommended';

  function clearFilters() {
    setSearch('');
    setCategory(null);
    setSort('recommended');
  }

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <ScreenContainer
      title="Explore"
      subtitle="Search, filter, and sort every campaign. Browsing needs no account."
    >
      <Input
        label="Search"
        placeholder="Search by title, creator, category, or summary"
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        returnKeyType="search"
        rightAdornment={
          search.length > 0 ? (
            <Pressable
              onPress={() => setSearch('')}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              hitSlop={8}
            >
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </Pressable>
          ) : null
        }
      />

      <View style={styles.group}>
        <AppText variant="label">Category</AppText>
        <View style={styles.chipWrap}>
          <Chip label="All" selected={category === null} onPress={() => setCategory(null)} />
          {CAMPAIGN_CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={item}
              selected={category === item}
              accessibilityLabel={`Filter by ${item}`}
              onPress={() => setCategory(category === item ? null : item)}
            />
          ))}
        </View>
      </View>

      <View style={styles.group}>
        <AppText variant="label">Sort by</AppText>
        <View style={styles.chipWrap}>
          {CAMPAIGN_SORTS.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={sort === option.value}
              accessibilityLabel={`Sort by ${option.label}`}
              onPress={() => setSort(option.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.resultBar}>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          {status === 'ready'
            ? `${results.length} campaign${results.length === 1 ? '' : 's'}`
            : 'Loading campaigns…'}
        </AppText>
        {hasActiveFilters ? (
          <Button label="Clear filters" onPress={clearFilters} variant="ghost" size="medium" />
        ) : null}
      </View>

      {isLoading ? <LoadingState message="Loading demo campaigns…" /> : null}

      {status === 'error' ? (
        <ErrorState message={error ?? 'Unknown error'} onRetry={() => void load({ force: true })} />
      ) : null}

      {status === 'ready' && results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No campaigns match"
          message={
            campaigns.length === 0
              ? 'The demo repository returned no campaigns. Reload to try again.'
              : 'Try a different search term, another category, or reset the filters.'
          }
          actionLabel={campaigns.length === 0 ? 'Reload' : 'Clear filters'}
          onAction={campaigns.length === 0 ? () => void load({ force: true }) : clearFilters}
        />
      ) : null}

      {status === 'ready'
        ? results.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPress={() => router.push(`/campaign/${campaign.id}`)}
            />
          ))
        : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  group: {
    gap: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  resultBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
});
