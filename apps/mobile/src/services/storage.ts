/**
 * Minimal async key/value contract. AsyncStorage implements this, but keeping
 * it as an interface lets the persistence logic be unit-tested with an
 * in-memory adapter (no React Native runtime required).
 */
export interface KeyValueStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}
