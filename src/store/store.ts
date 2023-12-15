import { create } from 'zustand';

import configStore, { ConfigStoreState } from './configStore';

export const useConfigStore = create<ConfigStoreState>((...obj) => ({
  ...configStore(...obj),
}));
