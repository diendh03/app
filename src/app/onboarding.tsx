import React from 'react';

import { FocusAwareStatusBar, View } from '@/components/ui';
export default function Onboarding() {
  // const [_, setIsFirstTime] = useIsFirstTime();
  // const router = useRouter();
  return (
    <View className="flex h-full items-center  justify-center">
      <FocusAwareStatusBar />
    </View>
  );
}
