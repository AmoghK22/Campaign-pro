import React, { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image, type ImageSource } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../theme';

interface ImageWithFallbackProps {
  /** A bundled asset (e.g. `require(...)`) or an expo-image source. */
  source?: ImageSource | number | null;
  uri?: string | null;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  contentFit?: 'cover' | 'contain';
  iconSize?: number;
}

/**
 * Bundled/remote image with a graceful neutral placeholder so missing or
 * offline assets never break layout.
 */
export function ImageWithFallback({
  source,
  uri,
  style,
  accessibilityLabel,
  contentFit = 'cover',
  iconSize = 28,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const resolvedSource = source ?? (uri ? { uri } : null);
  const showPlaceholder = !resolvedSource || failed;

  return (
    <View style={[styles.container, style]} accessibilityLabel={accessibilityLabel}>
      {showPlaceholder ? (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={iconSize} color={colors.textMuted} />
        </View>
      ) : (
        <Image
          source={resolvedSource}
          style={styles.image}
          contentFit={contentFit}
          transition={150}
          onError={() => setFailed(true)}
          accessibilityLabel={accessibilityLabel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
