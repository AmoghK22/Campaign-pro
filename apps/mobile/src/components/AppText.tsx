import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { colors, typography } from '../theme';

export type TextVariant = keyof typeof typography;

interface AppTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
  accessibilityRole?: 'text' | 'header' | 'summary' | 'link';
  onPress?: () => void;
}

export function AppText({
  children,
  variant = 'body',
  color = colors.text,
  style,
  numberOfLines,
  accessibilityRole = 'text',
  onPress,
}: AppTextProps) {
  return (
    <Text
      style={[typography[variant], { color }, style]}
      numberOfLines={numberOfLines}
      accessibilityRole={accessibilityRole}
      onPress={onPress}
    >
      {children}
    </Text>
  );
}
