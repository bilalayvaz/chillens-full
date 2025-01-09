import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { userService } from '../services/api';

interface AppState {
  credits: number | null;
  lastPostTime: string | null;
  refreshCredits: (profileId: string, handle: string) => Promise<void>;
  updateLastPostTime: () => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      credits: null,
      lastPostTime: null,

      refreshCredits: async (profileId, handle) => {
        try {
          const userData = await userService.getOrCreate(profileId, handle);
          set({ 
            credits: userData.credits,
            lastPostTime: userData.lastPostTime 
          });
        } catch (error) {
          console.error('Error refreshing credits:', error);
        }
      },

      updateLastPostTime: () => {
        set({ lastPostTime: new Date().toISOString() });
      },

      reset: () => set({
        credits: null,
        lastPostTime: null
      })
    }),
    {
      name: 'app-store'
    }
  )
);