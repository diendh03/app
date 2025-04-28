import { MinusIcon, PlusIcon } from 'lucide-react-native';
import React from 'react';
import { type ViewProps } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useGetPromotionSuggest } from '@/api/products';
import {
  Button,
  ButtonIcon,
  HStack,
  Input,
  InputField,
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from '@/components/ui';
import { getUserInfo } from '@/lib/auth/utils';
import { useAppStore } from '@/store';
import { type ProductCart } from '@/types';

import {
  transformDataRequestPromotionSuggest,
  transformDataResponsePromotionSuggest,
} from '../common/utils';

type Props = ViewProps & {
  productCart: ProductCart;
};

export const QuantityUpdate = ({ productCart }: Props) => {
  const { incQty, decQty, enteredQty, update } = useAppStore(
    useShallow((state) => ({
      addProduct: state.addProduct,
      incQty: state.incQty,
      decQty: state.decQty,
      enteredQty: state.enteredQty,
      update: state.updateProduct,
      products: state.products,
    }))
  );

  const customerInfo = getUserInfo();

  const searchPromotionSuggest = useGetPromotionSuggest();

  const toast = useToast();
  const [toastId, setToastId] = React.useState(0);

  const handleEnteredQtySubmit = React.useCallback(
    (text: string) => {
      const numericQty = text.replace(/[^0-9]/g, '');
      enteredQty(productCart.sku, Number(numericQty));
      searchPromotionSuggest.mutate(
        transformDataRequestPromotionSuggest(
          productCart,
          customerInfo,
          'text',
          numericQty
        ),
        {
          onSuccess: (res) => {
            update(productCart.sku, transformDataResponsePromotionSuggest(res));
          },
        }
      );
    },
    [productCart, enteredQty]
  );
  const handleDecQty = React.useCallback(
    (sku: string) => {
      decQty(sku);
      if (productCart.quantity > 1) {
        searchPromotionSuggest.mutate(
          transformDataRequestPromotionSuggest(productCart, customerInfo),
          {
            onSuccess: (res) => {
              update(sku, transformDataResponsePromotionSuggest(res));
            },
          }
        );
      }
    },
    [productCart, decQty]
  );

  const handleIncQty = React.useCallback(
    (sku: string) => {
      if (
        productCart.availQty / 2 <= productCart.quantity &&
        productCart.quantity < productCart.availQty - 1
      ) {
        if (!toast.isActive(String(toastId))) {
          showNewToast(
            'Sản phẩm có thể không đáp ứng đủ số lượng vì tồn kho còn quá ít!!'
          );
        }
        incQty(sku);
      } else if (productCart.quantity >= productCart.availQty - 1) {
        if (!toast.isActive(String(toastId))) {
          showNewToast('Sản phẩm không đủ lượng tồn kho');
        }
      } else {
        incQty(sku);
        searchPromotionSuggest.mutate(
          transformDataRequestPromotionSuggest(
            productCart,
            customerInfo,
            'inc'
          ),
          {
            onSuccess: (res) => {
              const promotion = transformDataResponsePromotionSuggest(res);
              update(sku, promotion);
            },
          }
        );
      }
    },
    [productCart, incQty]
  );

  const showNewToast = (message: string) => {
    const newId = Math.random();
    setToastId(newId);
    toast.show({
      id: String(newId),
      placement: 'bottom',
      duration: 3000,
      render: ({ id }) => {
        const uniqueToastId = 'toast-' + id;
        return (
          <Toast nativeID={uniqueToastId} action="warning" variant="solid">
            <ToastTitle>Thông báo!</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <VStack className="flex-1">
      <HStack space="sm">
        <Button
          size="sm"
          variant="solid"
          action="primary"
          onPress={() => handleDecQty(productCart.sku)}
        >
          <ButtonIcon as={MinusIcon} />
        </Button>
        <Input
          variant="outline"
          size="sm"
          isInvalid={false}
          isReadOnly={false}
          className="flex-1"
        >
          <InputField
            placeholder=""
            defaultValue={`${productCart.quantity}`}
            className="text-center"
            onEndEditing={(e) => handleEnteredQtySubmit(e.nativeEvent.text)}
          />
        </Input>
        <Button
          size="sm"
          variant="solid"
          action="primary"
          onPress={() => handleIncQty(productCart.sku)}
        >
          <ButtonIcon as={PlusIcon} />
        </Button>
      </HStack>
    </VStack>
  );
};
