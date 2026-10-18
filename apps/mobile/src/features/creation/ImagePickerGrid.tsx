import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../components';
import { CampaignImage } from '../campaigns/CampaignImage';
import type { ImageOption } from './assets';
import { colors, radius, spacing } from '../../theme';

interface ImagePickerGridProps {
  options: ImageOption[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  accessibilityLabel?: string;
}

/**
 * Selects artwork from the bundled demo asset set. Selecting writes a stable
 * image key into the draft; campaign detail resolves it to a local file.
 */
export function ImagePickerGrid({
  options,
  selectedKey,
  onSelect,
  accessibilityLabel,
}: ImagePickerGridProps) {
  return (
    <View style={styles.grid} accessibilityLabel={accessibilityLabel}>
      {options.map((option) => {
        const selected = option.key === selectedKey;
        return (
          <Pressable
            key={option.key}
            onPress={() => onSelect(option.key)}
            accessibilityRole="button"
            accessibilityLabel={`Use ${option.label} artwork`}
            accessibilityState={{ selected }}
            style={styles.cell}
          >
            <CampaignImage
              imageKey={option.key}
              style={[styles.thumb, selected && styles.thumbSelected]}
              accessibilityLabel={option.label}
            />
            {selected ? (
              <View style={styles.check}>
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              </View>
            ) : null}
            <AppText
              variant="caption"
              color={selected ? colors.primary : colors.textSecondary}
              numberOfLines={1}
              style={styles.label}
            >
              {option.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  cell: {
    width: '31%',
    gap: spacing.xs,
  },
  thumb: {
    height: 72,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbSelected: {
    borderColor: colors.primary,
  },
  check: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  label: {
    textAlign: 'center',
  },
});
