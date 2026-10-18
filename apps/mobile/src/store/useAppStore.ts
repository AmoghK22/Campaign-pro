import { useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createId } from '@campaign/shared';

interface AppState {
  guestKey: string;
  notificationsEnabled: boolean;
  ensureGuestKey: () => void;
  setNotificationsEnabled: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      guestKey: '',
      notificationsEnabled: true,
      ensureGuestKey: () => {
        if (get().guestKey.length === 0) {
          set({ guestKey: createId('guest') });
        }
      },
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
    }),
    {
      name: 'campaignamp.app.v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** True once the persisted store has rehydrated; avoids first-paint flicker. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => useAppStore.persist.onFinishHydration(onStoreChange),
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
