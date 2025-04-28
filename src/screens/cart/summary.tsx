import { router } from 'expo-router';
import {
  ChartColumnBigIcon,
  MapPinIcon,
  NewspaperIcon,
  WalletIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { useGetListAddressV2 } from '@/api/customers';
import { useCreateOrderPharma } from '@/api/order';
import { CustomerCard } from '@/components/common/customer-card';
import {
  Button,
  ButtonText,
  Card,
  ScrollView,
  Spinner,
  Text,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from '@/components/ui';
import { formatDataPaymentMethod, formatPriceVND, translate } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';
import { useAppStore } from '@/store';

import { listPaymentMethod, listShippingMethod } from './common/constants';
import { formatDataRequestCreateOrder } from './common/utils';
import ModalOrderSuccess from './components/create-order-success';
import ModalSelectPaymentMethod from './components/modal-select-payment';
import ModalSelectShippingMethod from './components/modal-select-shipping';

export const SummaryScreen = () => {
  const insets = useSafeAreaInsets();

  const {
    shippingAddress,
    total,
    savingMoney,
    cart,
    reset,
    paymentMethod,
    setPaymentMethod,
    dsShippingMethod,
    setShippingMethod,
    setShippingAddress,
  } = useAppStore(
    useShallow((state) => ({
      shippingAddress: state.shippingAddress,
      paymentMethod: state.paymentMethod,
      total: state.total,
      savingMoney: state.savingMoney,
      cart: state,
      reset: state.reset,
      setPaymentMethod: state.setPaymentMethod,
      setShippingAddress: state.setShippingAddress,
      dsShippingMethod: state.dsShippingMethod,
      setShippingMethod: state.setShippingMethod,
    }))
  );

  const createOrder = useCreateOrderPharma();
  const toast = useToast();
  const customerCart = getUserInfo();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isVisibleShipping, setIsVisibleShipping] = useState<boolean>(false);
  const [showModalSuccess, setShowModalSuccess] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<string>('');

  const customerId = React.useMemo(
    () => customerCart?.customerId,
    [customerCart]
  );

  const { data: listAddress } = useGetListAddressV2(Number(customerId));

  const defaultAddress = React.useMemo(() => {
    const primaryAddress = listAddress?.find((addr) => addr.isPrimary === true);

    return primaryAddress ? primaryAddress : listAddress?.[0];
  }, [listAddress]);

  useEffect(() => {
    if (defaultAddress?.id) {
      setShippingAddress(defaultAddress);
    }
  }, [defaultAddress]);

  const isLoaded = React.useMemo(() => !!customerId, [customerId]);

  const businessTypeName = React.useMemo(
    () => customerCart?.profile?.businessTypeName,
    [customerCart]
  );

  const handleCreateOrder = async () => {
    setIsLoading(true);

    if (!shippingAddress?.fullAddress) {
      setIsLoading(false);

      return toast.show({
        id: 'inValid-address',
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              action={'warning'}
              variant="solid"
              className="w-full"
            >
              <ToastTitle>Thông báo</ToastTitle>
              <ToastDescription>
                Vui lòng chọn địa chỉ nhận hàng
              </ToastDescription>
            </Toast>
          );
        },
      });
    }

    if (!customerCart?.profile?.isActive) {
      setIsLoading(false);

      return toast.show({
        id: 'inValid-isActivve',
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              action={'warning'}
              variant="solid"
              className="w-full"
            >
              <ToastTitle>Thông báo</ToastTitle>
              <ToastDescription>
                Hồ sơ khách hàng đang bị khóa. Vui lòng liên hệ CS để kích hoạt
                hồ sơ khách hàng.
              </ToastDescription>
            </Toast>
          );
        },
      });
    }

    createOrder.mutate(formatDataRequestCreateOrder(cart, customerCart), {
      onSuccess: (res: any) => {
        if (res.status === 200) {
          reset();
          setIsLoading(false);
          setOrderSuccess(res.data.orderNo);
          setShowModalSuccess(true);
        }
      },
      onError: () => {
        setIsLoading(false);
        return toast.show({
          id: 'serverError',
          placement: 'top',
          duration: 3000,
          render: ({ id }) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast
                nativeID={uniqueToastId}
                action={'warning'}
                variant="solid"
                className="w-full"
              >
                <ToastTitle>Thông báo</ToastTitle>
                <ToastDescription>
                  Hệ thống đang gặp sự cố. Vui lòng thử lại sau
                </ToastDescription>
              </Toast>
            );
          },
        });
      },
    });
  };

  const handleCloseModalSuccess = () => {
    setShowModalSuccess(false);
    router.replace(`/order/${orderSuccess}`);
  };
  return (
    <>
      {!isLoading ? (
        <>
          <ScrollView className="flex-1 px-4">
            <CustomerCard
              icon={NewspaperIcon}
              text="Sumary.PaymentDetails"
              isLoaded={true}
              className="mt-2"
            >
              <Card className="flex-row items-center justify-between py-1">
                <Text>{translate('Sumary.InitialTotalAmount')}</Text>
                <Text>{formatPriceVND(total + savingMoney)}</Text>
              </Card>
              <Card className="flex-row items-center justify-between py-1">
                <Text>{translate('Sumary.DirectDiscount')}</Text>
                <Text>{formatPriceVND(savingMoney)}</Text>
              </Card>

              <Card className="flex-row items-center justify-between border-t-[0.5px] border-neutral-200 py-2">
                <Text>{translate('Sumary.TotalAmount')}</Text>
                <Text className="text-red-500 dark:text-red-500">
                  {formatPriceVND(total)}
                </Text>
              </Card>
            </CustomerCard>
            <CustomerCard
              icon={ChartColumnBigIcon}
              text="Sumary.BussinessForm"
              isLoaded={isLoaded}
              className="my-2"
            >
              <Text>{businessTypeName}</Text>
            </CustomerCard>

            <CustomerCard
              icon={MapPinIcon}
              text="Sumary.DeliveryAddress"
              onPress={() =>
                router.push(`/customer/delivery-address/${customerId}`)
              }
              isLoaded={isLoaded}
              className="my-2"
            >
              <Text>
                {shippingAddress?.name ? shippingAddress?.name : ' '}
                {shippingAddress?.mobilePhone
                  ? ` | ${shippingAddress.mobilePhone}`
                  : ''}
              </Text>
              <Text>{shippingAddress?.fullAddress}</Text>
            </CustomerCard>

            <CustomerCard
              icon={WalletIcon}
              text="Sumary.PaymentMethod"
              onPress={() => setIsVisible(true)}
              isLoaded={isLoaded}
              className="my-2"
            >
              <Text>
                {formatDataPaymentMethod(
                  listPaymentMethod,
                  String(paymentMethod)
                )}
              </Text>
            </CustomerCard>

            {/* <CustomerCard
              icon={PackageIcon}
              text="customer.order_source"
              isLoaded={isLoaded}
              className="my-2"
            >
              <Text>APP_BACSI</Text>
            </CustomerCard> */}
          </ScrollView>

          <Card
            style={{ marginBottom: insets.bottom + 20 }}
            className="border-border_theme	bg-background-theme flex-row items-center justify-between border-t px-4 pt-2"
          >
            <Button
              size="lg"
              variant="solid"
              action="primary"
              className="flex-1"
              onPress={() => handleCreateOrder()}
            >
              <ButtonText>{translate('Sumary.CreateOrder')}</ButtonText>
            </Button>
          </Card>
        </>
      ) : (
        <Card className="bg-background-theme mt-5 flex-1 items-center justify-center">
          <Spinner size="large" />
        </Card>
      )}

      <ModalSelectPaymentMethod
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onValueChange={(item) => setPaymentMethod(item)}
        selectedValue={paymentMethod}
        listPaymentMethod={listPaymentMethod}
      />

      <ModalSelectShippingMethod
        isVisible={isVisibleShipping}
        onClose={() => setIsVisibleShipping(false)}
        onValueChange={(item) => setShippingMethod(item)}
        selectedValue={dsShippingMethod.code}
        listShippingMethod={listShippingMethod}
      />

      <ModalOrderSuccess
        isVisible={showModalSuccess}
        onClose={() => handleCloseModalSuccess()}
        orderNo={orderSuccess}
      />
    </>
  );
};
