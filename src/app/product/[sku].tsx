import { Stack } from 'expo-router';
import React from 'react';

import { ProductScreen } from '@/screens/home/detail-product';

export default () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chi tiết sản phẩm',
          headerBackButtonDisplayMode: 'minimal',
          // headerTransparent: true,
        }}
      />
      <ProductScreen />
    </>
  );
};
