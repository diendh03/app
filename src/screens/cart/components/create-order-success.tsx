import React from 'react';

import {
  Button,
  ButtonText,
  CloseIcon,
  Heading,
  Icon,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from '@/components/ui';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  orderNo: string;
};

const ModalOrderSuccess = ({ isVisible, onClose, orderNo }: Props) => {
  return (
    <Modal isOpen={isVisible} onClose={() => onClose()} size="md">
      <ModalBackdrop className="bg-black" />
      <ModalContent>
        <ModalHeader>
          <Heading size="md" className="text-typography-950">
            Đặt hàng thành công
          </Heading>
          <ModalCloseButton>
            <Icon
              as={CloseIcon}
              size="md"
              className="stroke-background-400 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900 group-[:hover]/modal-close-button:stroke-background-700"
            />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Text size="sm" className="text-typography-500">
            Đơn hàng{' '}
            <Text size="sm" bold>
              {orderNo}
            </Text>{' '}
            đang được xử lý
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button onPress={() => onClose()}>
            <ButtonText>Đóng</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalOrderSuccess;
