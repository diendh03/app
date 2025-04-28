import { useLocalSearchParams } from 'expo-router';
import { CircleChevronDownIcon } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCancelOrder, useGetDetailOrder } from '@/api/order';
import {
  Card,
  colors,
  Image,
  SafeAreaView,
  ScrollView,
  Spinner,
  Toast,
  ToastDescription,
  ToastTitle,
  TouchableOpacity,
  useToast,
} from '@/components/ui';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text/index';
import { formatDateV2, formatPriceVND } from '@/lib';
import { DATE_FORMAT } from '@/lib/constants';
import { type DetailOrder } from '@/types/order';

import { CancelOrderAlertDialog } from './components/cancel-order-alert-dialog';
import ModalListProducts from './components/modal-list-product';
import ModalChooseReasonDeleted from './components/modal-reason-deleted-order';

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data, isFetching, refetch, isRefetching } = useGetDetailOrder(
    String(id)
  );

  const mutateCancelOrder = useCancelOrder();

  const handleConfirmCancelOrder = useCallback(() => {
    setShowAlert(false);
    setIsDeleted(true);
  }, [setShowAlert]);

  const handleCancelOrder = (reason: string) => {
    setIsLoading(true);
    setIsDeleted(false);
    mutateCancelOrder.mutate(
      { orderNo: String(data?.orderCode), reason: reason },
      {
        onSuccess: async (res) => {
          if (res.status === 200) {
            setTimeout(async () => {
              refetch();
              setIsLoading(false);
              await toast.show({
                id: 'cancel-order',
                placement: 'bottom',
                duration: 3000,
                render: ({ id }) => {
                  const uniqueToastId = 'toast-' + id;
                  return (
                    <Toast
                      nativeID={uniqueToastId}
                      action={'info'}
                      variant="solid"
                      className="w-full"
                    >
                      <ToastTitle>Thông báo</ToastTitle>
                      <ToastDescription>{res.data.message}</ToastDescription>
                    </Toast>
                  );
                },
              });
            }, 2000);
          }
        },
      }
    );
  };

  return (
    <SafeAreaView edges={['right', 'left', 'bottom']} style={{ flex: 1 }}>
      <Box className="flex-1 bg-background-0">
        {!isLoading && !isRefetching && !isFetching ? (
          <>
            <ScrollView>
              <Card className=" mx-4 mt-5 flex-col gap-x-2 rounded-lg border border-gray-300 p-3">
                <Box className="w-[30%] flex-row items-center justify-center rounded-full border-2 border-pink-500 bg-pink-50 p-1">
                  <Text className="font-medium text-pink-500">
                    {data?.status?.statusLabel}
                  </Text>
                </Box>
                <Box className="mt-3 divide-dashed border-b border-gray-300 pb-3">
                  <Text className="text-lg font-medium">
                    Đơn hàng {data?.orderCode}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Ngày đặt:{' '}
                    {formatDateV2({
                      date: String(data?.orderDate),
                      formatInput: DATE_FORMAT.INPUT,
                      formatOutput: DATE_FORMAT.ID4,
                    })}
                  </Text>
                </Box>
                <Box className="mt-3 flex-col gap-y-2 divide-dashed border-b border-gray-300 pb-3">
                  <Box className="flex-row items-center justify-between">
                    <Text className="w-[30%] text-lg font-bold">Tổng cộng</Text>
                    <Text className="text-right text-lg font-medium text-primary-500">
                      {formatPriceVND(data?.orderPrice?.finalPrice)}
                    </Text>
                  </Box>
                  <Box className="flex-row items-center justify-between">
                    <Text className="w-[50%] text-base font-normal">
                      Tổng tiền ban đầu
                    </Text>
                    <Text className="text-right text-base font-normal">
                      {formatPriceVND(data?.orderPrice?.totalPrice)}
                    </Text>
                  </Box>
                  <Box className="flex-row items-center justify-between">
                    <Text className="w-[50%] text-base font-normal">
                      Phí ship
                    </Text>
                    <Text className="text-right text-base font-normal">
                      {formatPriceVND(data?.orderPrice?.deliveryFee)}
                    </Text>
                  </Box>
                  <Box className="flex-row items-center justify-between">
                    <Text className="w-[50%] text-base font-normal">
                      Giảm giá voucher
                    </Text>
                    <Text className="text-right text-base font-normal">
                      {formatPriceVND(data?.orderPrice?.promotion)}
                    </Text>
                  </Box>
                </Box>
                <Box className="mt-3 flex-col gap-y-2 pb-3">
                  <Box className="flex-row items-center justify-between">
                    <Text className="w-[50%] text-base font-normal">
                      Tiết kiệm
                    </Text>
                    <Text className="text-right text-base font-normal">
                      {formatPriceVND(data?.orderPrice?.promotion)}
                    </Text>
                  </Box>
                </Box>
              </Card>

              <Card className=" mt-5 flex-col gap-x-2  rounded-lg p-3">
                <Box className="mt-3 border-b border-gray-300 pb-3">
                  <Text className="text-lg font-medium">
                    Sản phẩm ({data?.totalProduct})
                  </Text>
                </Box>

                <Box className="mt-3 flex-row justify-start">
                  <Image
                    source={{
                      uri: String(data?.orderProducts[0]?.image),
                    }}
                    size={'sm'}
                    alt="image"
                    className="rounded-[10px] border-[3px] border-gray-300"
                  />
                  <Box className="ml-3 flex-1 shrink flex-col">
                    <Box className="mt-2 flex-row items-center">
                      <Text className="w-[90%] text-lg font-medium">
                        {data?.orderProducts[0]?.title}
                      </Text>
                      <Text className="w-[10%] pr-2 text-right text-base font-normal">
                        x{data?.orderProducts[0]?.quantity}
                      </Text>
                    </Box>

                    <Box className="mt-2 flex-row items-center">
                      <Text className="w-[50%] text-sm text-gray-500">
                        Đơn vị: {data?.orderProducts[0]?.unitLabel}
                      </Text>
                      <Text className="w-[50%] pr-2 text-right text-base font-medium text-primary-500">
                        {formatPriceVND(
                          data?.orderProducts[0]?.totalAfterDiscount
                        )}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                {(data?.orderProducts || []).length > 1 && (
                  <TouchableOpacity
                    onPress={() => setIsVisible(true)}
                    className="mt-2 flex-row items-center justify-center gap-x-1 p-1"
                  >
                    <Text className="text-sm font-normal text-gray-400">
                      Xem thêm
                    </Text>
                    <CircleChevronDownIcon
                      size={10}
                      color={colors.neutral[400]}
                    />
                  </TouchableOpacity>
                )}
              </Card>

              <Card className=" mt-5 flex-col gap-x-2 rounded-lg border-t border-gray-300 p-3">
                <Box className="flex-row items-center justify-between">
                  <Text className="text-lg font-medium">
                    Thông tin đơn hàng
                  </Text>
                </Box>

                {data?.orderInformation && (
                  <Box className="mt-3 flex-1 shrink gap-y-1 pb-3">
                    <Text className="text-lg font-medium">Khách hàng</Text>
                    <Text className="text-base font-normal">
                      {`${data?.orderInformation?.customerName ? data?.orderInformation?.customerName : ''} ${data?.orderInformation?.phoneNumber ? `| ${data?.orderInformation?.phoneNumber}` : ''} `}
                    </Text>

                    <Text className="text-lg font-medium">
                      Địa chỉ nhận hàng
                    </Text>
                    <Text className="text-base font-normal">
                      {data?.orderInformation?.receiverFullAddress}
                    </Text>
                  </Box>
                )}
              </Card>
            </ScrollView>

            {data?.status?.code === 1 && (
              <Box
                style={{ marginBottom: insets.bottom + 35 }}
                className="border-t-[0.5px] border-neutral-200 bg-background-0 px-6 pt-2"
              >
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAlert(true)}
                  className="items-center"
                >
                  <Text className="font-bold text-red-500">Hủy đơn</Text>
                </TouchableOpacity>
              </Box>
            )}
          </>
        ) : (
          <Box className="flex-1 justify-center">
            <Spinner size="large" />
          </Box>
        )}

        <ModalListProducts
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
          data={data || ({} as DetailOrder)}
        />

        <CancelOrderAlertDialog
          isOpen={showAlert}
          handleClose={() => setShowAlert(false)}
          handleOk={() => handleConfirmCancelOrder()}
        />

        <ModalChooseReasonDeleted
          isVisible={isDeleted}
          onClose={() => setIsDeleted(false)}
          onValueChange={handleCancelOrder}
        />
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: '#fff5f2',
    borderColor: '#ff5a36',
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

export default OrderDetailScreen;
