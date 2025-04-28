import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronRight, MapPinPlusIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useGetListAddressV2 } from '@/api/customers';
import {
  Box,
  Card,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@/components/ui';
import { translate } from '@/lib';
import { useAppStore } from '@/store';

export const DeliveryAddressScreen = () => {
  const local = useLocalSearchParams<{ id: string }>();
  const { setDeliveryAddress } = useAppStore(
    useShallow((state) => ({
      setDeliveryAddress: state.setShippingAddress,
      deliveryAddress: state.shippingAddress,
    }))
  );

  const {
    data: addressList,
    isFetching,
    refetch,
  } = useGetListAddressV2(Number(local.id));
  const navigation = useNavigation();
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView className="bg-background-0 px-4">
      <Pressable
        onPress={() => router.navigate('/customer/add-delivery-address')}
      >
        <Box className="flex-row items-center justify-between border-b border-background-200 py-4">
          <HStack space="md">
            <Icon as={MapPinPlusIcon} />
            <Text>{translate('delivery_address.add_address')}</Text>
          </HStack>

          <Icon as={ChevronRight} />
        </Box>
      </Pressable>
      {!isFetching ? (
        addressList?.map((addr) => {
          return (
            <VStack
              key={addr?.id}
              className="border-b border-background-200 py-4"
            >
              <Box className="flex-row justify-between">
                <Pressable
                  onPress={() => {
                    setDeliveryAddress(addr);
                    router.back();
                  }}
                  className="flex-1"
                >
                  <VStack>
                    <Text bold>{addr?.name}</Text>
                    <Text>{addr?.mobilePhone}</Text>
                    <Text>{addr?.fullAddress}</Text>
                  </VStack>
                </Pressable>
                {/* <Pressable onPress={() => console.log('Edit Delivery Address')}>
                  <Text size="sm" bold className="text-red-500">
                    {translate('common.edit')}
                  </Text>
                </Pressable> */}
              </Box>
              {addr.isPrimary && (
                <Box className="flex-row">
                  <Text size="sm" className="bg-background-200 px-1">
                    {translate('common.default')}
                  </Text>
                </Box>
              )}
            </VStack>
          );
        })
      ) : (
        <Card className="bg-background-theme mt-5 flex-1 items-center justify-center">
          <Spinner size="large" />
        </Card>
      )}
    </ScrollView>
  );
};
