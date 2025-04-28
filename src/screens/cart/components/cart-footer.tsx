import React, { useEffect, useMemo } from 'react';
import { type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { Box, Button, ButtonText, HStack, Text } from '@/components/ui';
import { formatPriceVND, getPriceIncludeVAT, getVAT, translate } from '@/lib';
import { useAppStore } from '@/store';

type Props = ViewProps & {
  isDisabled?: boolean;
  onPress?: () => void;
};

export const CartFooter = ({
  className,
  isDisabled = false,
  onPress,
}: Props) => {
  const insets = useSafeAreaInsets();
  const { products, setTotal, setSavingMoney } = useAppStore(
    useShallow((state) => ({
      products: state.products,
      setTotal: state.setTotal,
      setSavingMoney: state.setSavingMoney,
    }))
  );

  const savingMoney = useMemo(() => {
    return products.reduce((sum, cur) => {
      return (
        sum +
        (cur.quantity *
          Number(cur.discount?.discount) *
          (100 + getVAT(cur.exportTax))) /
          100
      );
    }, 0);
  }, [products]);

  const sumEstimated = useMemo(() => {
    return products.reduce((sum, cur) => {
      return (
        sum +
        cur.quantity *
          getPriceIncludeVAT(
            getVAT(cur.exportTax),
            Number(cur.discount?.discount) > 0
              ? cur.discount?.finalPrice
              : cur.price?.price
          )
      );
    }, 0);
  }, [products]);

  useEffect(() => {
    setTotal(sumEstimated);
    setSavingMoney(savingMoney);
  }, [sumEstimated, savingMoney]);

  return (
    <Box
      className={`flex-row items-center justify-between border-t border-gray-900 bg-background-0 px-4 pt-2 ${className}`}
      style={{ paddingBottom: insets.bottom }}
    >
      <Box className="flex-1 pr-4">
        <HStack className="items-center justify-between">
          <Text bold>{translate('Sumary.SaveMoney')}</Text>
          <Text bold>{formatPriceVND(savingMoney)}</Text>
        </HStack>
        <HStack className="flex-row items-center justify-between">
          <Text bold>{translate('Sumary.EstTotalAmount')}</Text>
          <Text bold className="text-error-500">
            {formatPriceVND(sumEstimated)}
          </Text>
        </HStack>
      </Box>
      <Button
        size="md"
        variant="solid"
        action="primary"
        isDisabled={isDisabled}
        onPress={onPress}
      >
        <ButtonText>{translate('Common.Continue')}</ButtonText>
      </Button>
    </Box>
  );
};
