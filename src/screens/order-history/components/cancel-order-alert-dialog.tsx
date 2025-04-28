import { TrashIcon } from 'lucide-react-native';
import { type ViewProps } from 'react-native';

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
  Icon,
  Text,
} from '@/components/ui';

type Props = ViewProps & {
  isOpen: boolean;
  handleOk: () => void;
  handleClose: () => void;
};

export const CancelOrderAlertDialog = ({
  isOpen,
  handleOk,
  handleClose,
}: Props) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop className="bg-black" />
      <AlertDialogContent className="w-4/5  items-center gap-4">
        <Box className="size-[52px] items-center justify-center rounded-full bg-background-error">
          <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
        </Box>
        <AlertDialogHeader className="mb-2">
          <Heading size="md">Bạn có chắc chắn muốn hủy đơn?</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm" className="text-center">
            Dữ liệu có thể bị xóa nếu bạn rời khỏi trang
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-5">
          <Button
            variant="outline"
            action="secondary"
            onPress={handleClose}
            size="sm"
            className="px-[30px]"
          >
            <ButtonText>Đóng</ButtonText>
          </Button>
          <Button
            size="sm"
            action="negative"
            onPress={handleOk}
            className="px-[30px]"
          >
            <ButtonText>Hủy đơn</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
