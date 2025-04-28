import React from 'react';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
} from '@/components/ui';

import { reasonCancelList } from '../common/constants';

interface ModalChooseReasonDeletedProps {
  isVisible: boolean;
  onClose: () => void;
  onValueChange: (reason: string) => void;
}

const ModalChooseReasonDeleted = (props: ModalChooseReasonDeletedProps) => {
  const { isVisible, onClose, onValueChange } = props;

  return (
    <Actionsheet isOpen={isVisible} onClose={onClose}>
      <ActionsheetBackdrop className="bg-black" />
      <ActionsheetContent className="max-h-[40%]">
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <ActionsheetSectionHeaderText className="w-full border-b border-gray-400 text-center text-lg font-medium normal-case text-primary-500">
          Vui lòng chọn lý do hủy đơn
        </ActionsheetSectionHeaderText>

        {reasonCancelList.map((item, index) => (
          <ActionsheetItem
            key={index}
            className="border-b border-gray-300"
            onPress={() => onValueChange(item.code)}
          >
            <ActionsheetItemText className="text-base">
              {item.label}
            </ActionsheetItemText>
          </ActionsheetItem>
        ))}
      </ActionsheetContent>
    </Actionsheet>
  );
};

export default ModalChooseReasonDeleted;
