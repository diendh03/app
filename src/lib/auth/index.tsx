import { create } from 'zustand';

import { log } from '../logger';
import { createSelectors } from '../utils';
import { clearSessionExpired, getToken } from './utils';

interface AuthState {
  status: 'idle' | 'signOut' | 'signIn';
  signIn: () => void;
  signOut: () => void;
  hydrate: () => void;
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  signIn: () => set({ status: 'signIn' }),
  signOut: () => {
    const token = getToken();
    if (token) clearSessionExpired(true);
    set({ status: 'signOut' });
  },
  hydrate: () => {
    try {
      const token = getToken();
      if (!token) {
        get().signOut();
      } else {
        get().signIn();
      }
    } catch (error) {
      log.error('_useAuth::hydrate::', error);
      clearSessionExpired();
    }
  },
}));

export const useAuth = createSelectors(_useAuth);
export const signOut = () => _useAuth.getState().signOut();
export const signIn = () => _useAuth.getState().signIn();
export const hydrateAuth = () => _useAuth.getState().hydrate();
