/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import {
  FileClockIcon,
  ShoppingBagIcon,
  ShoppingBasketIcon,
  UserCogIcon,
} from 'lucide-react-native';
import React, { useCallback, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { Icon, Text, VStack } from '@/components/ui';
import { translate, useAuth } from '@/lib';
import { useAppStore } from '@/store';

export default function TabLayout() {
  const status = useAuth.use.status();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  const { products } = useAppStore(
    useShallow((state) => ({
      products: state.products,
    }))
  );

  if (status !== 'signIn') {
    return <Redirect href="/auth/login" />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: translate('Common.Home'),
          tabBarIcon: ({ color }) => (
            <Icon className="" as={ShoppingBagIcon} color={color} />
          ),
          tabBarButtonTestID: 'home-tab',
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Giỏ hàng',
          tabBarIcon: ({ color }) => (
            <>
              <VStack className="mr-4">
                <Icon className="" as={ShoppingBasketIcon} color={color} />
                <Text
                  bold
                  size="sm"
                  className="absolute -right-4 -top-2 h-5 min-w-6 rounded-full bg-error-500 text-center leading-5 text-white"
                >
                  {products?.length}
                </Text>
              </VStack>
            </>
          ),
          tabBarButtonTestID: 'cart-tab',
        }}
      />

      <Tabs.Screen
        name="order-history"
        options={{
          title: 'Lịch sử đơn hàng',
          tabBarIcon: ({ color }) => <FileClockIcon color={color} />,
          tabBarButtonTestID: 'order-history-tab',
        }}
      />

      <Tabs.Screen
        name="account"
        options={{
          title: translate('Common.Account'),
          tabBarIcon: ({ color }) => (
            <Icon className="" as={UserCogIcon} color={color} />
          ),
          tabBarButtonTestID: 'account-tab',
        }}
      />
    </Tabs>
  );
}
