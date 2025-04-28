import React from 'react';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { type PaymentMethodType } from '@/types';

interface ModalSelectPaymentMethodProps {
  isVisible: boolean;
  onClose: () => void;
  onValueChange: (option: PaymentMethodType) => void;
  selectedValue: string;
  listPaymentMethod: PaymentMethodType[];
}

const ModalSelectPaymentMethod = (props: ModalSelectPaymentMethodProps) => {
  const {
    isVisible,
    onClose,
    onValueChange,
    selectedValue,
    listPaymentMethod,
  } = props;

  return (
    <Actionsheet isOpen={isVisible} onClose={onClose}>
      <ActionsheetBackdrop className="bg-black" />
      <ActionsheetContent className="max-h-[60%] items-start px-0">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ScrollView className="mt-2 w-full flex-col rounded-lg pb-2">
          {listPaymentMethod?.map((item) => (
            <TouchableOpacity
              key={item.id}
              className={`w-full py-3 ${item.code === selectedValue ? 'bg-neutral-400' : 'bg-theme-0'}`}
              onPress={() => {
                onValueChange && onValueChange(item);
                onClose();
              }}
            >
              <View className="flex-row">
                <Text className="ml-2 px-2 text-base">{item.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default ModalSelectPaymentMethod;
