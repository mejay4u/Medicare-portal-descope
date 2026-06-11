import { create } from 'zustand';

interface UiState {
  isOffline: boolean;
  setOfflineBanner: (offline: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isOffline: false,
  setOfflineBanner: (offline) => set({ isOffline: offline }),
}));
