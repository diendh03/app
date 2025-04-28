import { create } from 'zustand';
import {
  createJSONStorage,
  devtools,
  persist,
  type StateStorage,
  subscribeWithSelector,
} from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { getItem, removeItem, setItem } from '@/lib/storage';

import { type CartSlice, createCartSlice } from './cart-slice';

type AppStore = CartSlice;

const mmkvStorage: StateStorage = {
  setItem: (name, value) => setItem(name, value),
  getItem: (name) => getItem(name),
  removeItem: (name) => removeItem(name),
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createCartSlice(...a),
          // ...createCustomerSlice(...a),
        }))
      ),
      {
        name: 'app-storage',
        storage: createJSONStorage(() => mmkvStorage),
      }
    )
  )
);
