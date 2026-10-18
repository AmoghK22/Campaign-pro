export const colors = {
  background: '#F7F5F0',
  surface: '#FFFFFF',
  surfaceMuted: '#F0EDE6',
  border: '#E4DFD5',
  borderStrong: '#CFC8BA',
  primary: '#1F4D36',
  primaryPressed: '#173B29',
  primaryMuted: '#E4EDE7',
  text: '#1A1A18',
  textSecondary: '#5C6470',
  textMuted: '#8A8F98',
  textOnPrimary: '#FFFFFF',
  accent: '#B7791F',
  accentMuted: '#FBF3E4',
  error: '#B3261E',
  errorMuted: '#FBE9E7',
  success: '#2E7D32',
  successMuted: '#E8F3E9',
  info: '#2C5F8A',
  infoMuted: '#E7F0F7',
  disabled: '#B6B0A4',
  disabledSurface: '#ECE8DF',
  overlay: 'rgba(26, 26, 24, 0.45)',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  display: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700' as const,
    letterSpacing: -0.4,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  heading: {
    fontSize: 19,
    lineHeight: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.2,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  overline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.8,
  },
} as const;

export const touchTarget = 48;

export const theme = { colors, spacing, radius, typography, touchTarget } as const;

export type Theme = typeof theme;
