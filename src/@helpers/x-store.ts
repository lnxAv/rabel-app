import { NextRouter } from 'next/router';
import create from 'zustand';
import { GlobalStore } from './types';

export const useGlobalStore = create<GlobalStore>((set) => ({
  /* APP - buildtime vals only */
  app: {
    // devMode - for optimization, will require re-mount on certain features (just refresh the page)
    devMode: process.env.NODE_ENV === 'development',
  },
  /* next router */
  router: null,
  /* x-canvas tracked */
  selectedCanvas: '',
  /* x-perf data */
  perfData: undefined,
  /* x-gui-store data */
  guiStore: null,
  // Setters & Dispatch
  setPerfData: (perfData) => set({ perfData }),
  setSelectedCanvas: (selectedCanvas) => set({ selectedCanvas }),
  setGUIStore: (guiStore) => set({ guiStore }),
  setRouter: (router: NextRouter) => set({ router }),
}));

export const { getState: getGlobalState, setState: setGlobalState } = useGlobalStore;
