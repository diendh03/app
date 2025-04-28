import { router } from 'expo-router';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ScrollView } from '@/components/ui';
import { useAppStore } from '@/store';

import { CartFooter } from './components/cart-footer';
import { CartItem } from './components/cart-item';

export const CartScreen = () => {
  const { products } = useAppStore(
    useShallow((state) => ({
      products: state.products,
    }))
  );

  return (
    <>
      <ScrollView className="flex-1">
        {products.map((item) => (
          <CartItem key={item.sku} productCart={item} className="mx-3 my-1" />
        ))}
      </ScrollView>

      <CartFooter
        onPress={() => products.length > 0 && router.push('/cart/summary')}
      />
    </>
  );
};
