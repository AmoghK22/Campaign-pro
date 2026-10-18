import React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { ImageWithFallback } from '../../components';
import { getCampaignImageSource } from '../../assets/campaignImages';

interface CampaignImageProps {
  imageKey?: string | null;
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain';
  iconSize?: number;
}

/**
 * Resolves a campaign image key from the bundled asset registry, falling back
 * to a remote URI and finally to the neutral placeholder.
 */
export function CampaignImage({
  imageKey,
  uri,
  style,
  accessibilityLabel,
  contentFit = 'cover',
  iconSize,
}: CampaignImageProps) {
  return (
    <ImageWithFallback
      source={getCampaignImageSource(imageKey)}
      uri={uri}
      style={style}
      accessibilityLabel={accessibilityLabel}
      contentFit={contentFit}
      iconSize={iconSize}
    />
  );
}
