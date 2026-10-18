/**
 * Demo Mode resolution.
 *
 * The app is fully usable with NO backend configured. Demo Mode means:
 * - seeded campaigns are shown,
 * - drafts/contributions persist on-device via AsyncStorage,
 * - payments, review, and delivery are clearly labelled as simulated.
 *
 * When EXPO_PUBLIC_API_BASE_URL is set, an API-backed repository will be used
 * in a later phase; screens depend only on the repository interface.
 */
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '';

export const DEMO_MODE = apiBaseUrl.length === 0;

export function isDemoMode(): boolean {
  return DEMO_MODE;
}

export function getApiBaseUrl(): string | null {
  return DEMO_MODE ? null : apiBaseUrl;
}

export const DEMO_MODE_MESSAGE =
  'Demo mode: showing seeded campaigns. Contributions, review, and delivery are simulated on this device.';
