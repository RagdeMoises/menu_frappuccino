import { create } from 'zustand';

export const useUIStore = create((set) => ({
  showSplash: true,
  setShowSplash: (show) => set({ showSplash: show }),
}));
