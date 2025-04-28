import { Stack } from 'expo-router';
import React from 'react';

import { translate } from '@/lib';
import { SummaryScreen } from '@/screens/cart/summary';

export default () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: translate('Sumary.Title'),
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <SummaryScreen />
    </>
  );
};
