import React from 'react';

import { FocusAwareStatusBar, View } from '@/components/ui';
import { CartScreen } from '@/screens/cart';

export default function Cart() {
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <CartScreen />
    </View>
  );
}
