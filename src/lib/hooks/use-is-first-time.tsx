import { useMMKVBoolean } from 'react-native-mmkv';

import { IS_FIRST_TIME } from '@/lib/constants';

import { storage } from '../storage';

export const useIsFirstTime = () => {
  const [isFirstTime, setIsFirstTime] = useMMKVBoolean(IS_FIRST_TIME, storage);
  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }
  return [isFirstTime, setIsFirstTime] as const;
};
