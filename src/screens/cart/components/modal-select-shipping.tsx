import React from 'react';
import { StyleSheet } from 'react-native';
import { ShippingMethodType } from '@/types';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from '@/components/ui';

interface ModalSelectShippingMethodProps {
  isVisible: boolean;
  onClose: () => void;
  onValueChange: (option: ShippingMethodType) => void;
  selectedValue: string;
  listShippingMethod: ShippingMethodType[];
}

const ModalSelectShippingMethod = (props: ModalSelectShippingMethodProps) => {
  const {
    isVisible,
    onClose,
    onValueChange,
    selectedValue,
    listShippingMethod,
  } = props;

  return (
    <Actionsheet isOpen={isVisible} onClose={onClose}>
      <ActionsheetBackdrop className="bg-black" />
      <ActionsheetContent className="max-h-[60%] items-start px-0">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ScrollView className="mt-2 rounded-lg pb-2 flex-col w-full">
          {listShippingMethod?.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="py-3 w-full"
              style={[item.code === selectedValue && styles.selectedOption]}
              onPress={() => {
                onValueChange && onValueChange(item);
                onClose();
              }}
            >
              <View className="flex-row">
                <Text className="text-base ml-2 px-2">{item.value}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
};

const styles = StyleSheet.create({
  selectedOption: {
    backgroundColor: '#d1e7fd',
  },
});

export default ModalSelectShippingMethod;
