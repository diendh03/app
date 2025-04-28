import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCreateDeliveryAddress } from '@/api/customers';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  Button,
  ButtonText,
  Heading,
  Spinner,
  Text,
} from '@/components/ui';
import { translate } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';
import { type ICustomerDeliveryAddress } from '@/types';

import {
  DeliveryAddressForm,
  type FormProps,
} from './components/delivery-address-form';

const SpinnerOverlay = () => {
  return (
    <Box className="absolute inset-0 z-[999999] flex-1 items-center justify-center bg-black/50">
      <Spinner size="large" className="rounded-lg bg-white p-3" />
    </Box>
  );
};

export const AddDeliveryAddressScreen = () => {
  const customerInfo = getUserInfo();

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleCloseSuccess = useCallback(() => {
    setShowAlertDialog(false);
    router.back();
  }, []);

  const handleCloseError = useCallback(() => {
    setShowAlertDialog(false);
  }, []);
  const { mutate, isPending, isSuccess, isError } = useCreateDeliveryAddress();
  const onSubmit: FormProps['onSubmit'] = (formData) => {
    const dataCreate: ICustomerDeliveryAddress = {
      customerCode: String(customerInfo?.profile?.customerCode),
      authorityFullName: formData.name,
      authorityPhoneNumber: formData.phone,
      detailAddress: formData.address,
      provinceId: formData.province.sourceId,
      provinceName: formData.province.sourceName ?? '',
      districtId: formData.district.sourceId,
      districtName: formData.district.sourceName ?? '',
      wardId: formData.ward.sourceId,
      wardName: formData.ward.sourceName ?? '',
      fullAddress: [
        formData.address,
        formData.ward.sourceName,
        formData.district.sourceName,
        formData.province.sourceName,
      ].join(', '),
      isPrimary: formData.is_default,
    };

    mutate(dataCreate);
  };

  useEffect(() => {
    if ((!isPending && isSuccess) || isError) {
      setShowAlertDialog(true);
    }
  }, [isPending, isSuccess, isError]);

  return (
    <>
      <SafeAreaView className="flex-1" edges={['right', 'bottom', 'left']}>
        {isPending && <SpinnerOverlay />}

        <DeliveryAddressForm onSubmit={onSubmit} />

        <AlertDialog
          isOpen={showAlertDialog}
          onClose={isSuccess ? handleCloseSuccess : handleCloseError}
          size="md"
        >
          <AlertDialogBackdrop className="bg-black" />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Heading className="font-semibold text-typography-950" size="md">
                {isSuccess
                  ? translate('common.alert')
                  : translate('common.error')}
              </Heading>
            </AlertDialogHeader>
            <AlertDialogBody className="mb-4 mt-3">
              <Text size="sm">
                {isSuccess
                  ? translate('delivery_address.add_address_success')
                  : translate('delivery_address.add_address_error')}
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter className="">
              <Button
                variant="outline"
                action="secondary"
                onPress={isSuccess ? handleCloseSuccess : handleCloseError}
                size="sm"
              >
                <ButtonText>{translate('common.close')}</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SafeAreaView>
    </>
  );
};
