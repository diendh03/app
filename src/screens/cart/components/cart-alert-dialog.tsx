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
  handleClose: () => void;
};

export const CartAlertDialog = ({ isOpen, handleClose }: Props) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="w-full max-w-[415px] items-center gap-4">
        <Box className="size-[52px] items-center justify-center rounded-full bg-background-error">
          <Icon as={TrashIcon} size="lg" className="stroke-error-500" />
        </Box>
        <AlertDialogHeader className="mb-2">
          <Heading size="md">Delete account?</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm" className="text-center">
            The invoice will be deleted from the invoices section and in the
            documents folder. This cannot be undone.
          </Text>
        </AlertDialogBody>
        <AlertDialogFooter className="mt-5">
          <Button
            size="sm"
            action="negative"
            onPress={handleClose}
            className="px-[30px]"
          >
            <ButtonText>Delete</ButtonText>
          </Button>
          <Button
            variant="outline"
            action="secondary"
            onPress={handleClose}
            size="sm"
            className="px-[30px]"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
