import React from 'react';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Box,
  Image,
  ScrollView,
  Text,
} from '@/components/ui';
import { formatPriceVND } from '@/lib';
import { type DetailOrder } from '@/types/order';

interface ModalListProductsProps {
  isVisible: boolean;
  onClose: () => void;
  data: DetailOrder;
}

const ModalListProducts = (props: ModalListProductsProps) => {
  const { isVisible, onClose, data } = props;

  return (
    <>
      <Actionsheet isOpen={isVisible} onClose={onClose}>
        <ActionsheetBackdrop className="bg-black" />

        <ActionsheetContent className="max-h-[60%] items-start px-3">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ScrollView className="mt-2 w-full flex-col rounded-lg pb-2">
            {data?.orderProducts?.map((product: any, index: any) => (
              <Box key={index} className="mt-3 flex-row justify-start">
                <Image
                  source={{
                    uri: String(product?.image),
                  }}
                  size="md"
                  alt="image"
                  className="rounded-[10px] border-[3px] border-gray-300"
                />
                <Box className="ml-3 flex-1 shrink flex-col">
                  <Box className="mt-2 flex-row items-center">
                    <Text className="w-[90%] text-lg font-medium">
                      {product?.title}
                    </Text>
                    <Text className="w-[10%] pr-2 text-right text-base font-normal">
                      x{product?.quantity}
                    </Text>
                  </Box>

                  <Box className="mt-2 flex-row items-center">
                    <Text className="w-[50%] text-sm text-gray-500">
                      Đơn vị: {product?.unitLabel}
                    </Text>
                    <Text className="w-[50%] pr-2 text-right text-base font-medium text-primary-500">
                      {formatPriceVND(product?.totalAfterDiscount)}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </ScrollView>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default ModalListProducts;
