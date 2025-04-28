import { useIsFocused } from '@react-navigation/native';
import * as React from 'react';
import { Platform } from 'react-native';
import { SystemBars, type SystemBarStyle } from 'react-native-edge-to-edge';

type Props = { hidden?: boolean; style?: SystemBarStyle };
export const FocusAwareStatusBar = ({
  hidden = false,
  style = 'auto',
}: Props) => {
  const isFocused = useIsFocused();

  if (Platform.OS === 'web') return null;

  return isFocused ? <SystemBars style={style} hidden={hidden} /> : null;
};
