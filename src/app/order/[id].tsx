// eslint-disable-next-line unicorn/filename-case
import { router, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { VStack } from '@/components/ui';
import OrderDetailScreen from '@/screens/order-history/order-detail';

const OrderDetail = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Chi tiết đơn hàng',
          headerLeft: () => {
            return (
              <TouchableOpacity onPress={() => router.back()}>
                <VStack className="mr-4">
                  <ArrowLeft className="text-primary-500" size={30} />
                </VStack>
              </TouchableOpacity>
            );
          },
        }}
      />

      <OrderDetailScreen />
    </>
  );
};

export default OrderDetail;
