import React from 'react';

import { FocusAwareStatusBar, View } from '@/components/ui';
import { HomeScreen } from '@/screens/home';

export default function Feed() {
  return (
    <View className="flex-1 ">
      <FocusAwareStatusBar />
      <HomeScreen />
    </View>
  );
}
