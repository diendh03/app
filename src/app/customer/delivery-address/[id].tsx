import { Stack } from 'expo-router';
import React from 'react';

import { translate } from '@/lib';
import { DeliveryAddressScreen } from '@/screens/delivery-address/index';

export default () => (
  <>
    <Stack.Screen
      options={{
        title: translate('delivery_address.title'),
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
    <DeliveryAddressScreen />
  </>
);
