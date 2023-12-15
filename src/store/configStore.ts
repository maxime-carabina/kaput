import { persist } from 'zustand/middleware';

export interface ConfigStoreState {
  theme: 'dark' | 'light';

  setTheme: (theme: 'dark' | 'light') => void;

  dropTheme: () => void;
}

const configStore = persist<ConfigStoreState>(
  (set) => ({
    theme: 'light',

    setTheme: (theme: 'dark' | 'light') => set({ theme }),

    dropTheme: () => set({ theme: 'light' }),
  }),
  {
    name: 'config-store',
  },
);

export default configStore;
