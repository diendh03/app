import { Stack } from 'expo-router';
import React from 'react';

import { AddDeliveryAddressScreen } from '@/screens/delivery-address/add';

export default () => (
  <>
    <Stack.Screen
      options={{
        title: 'Tạo địa chỉ mới',
        headerBackButtonDisplayMode: 'minimal',
      }}
    />
    <AddDeliveryAddressScreen />
  </>
);
