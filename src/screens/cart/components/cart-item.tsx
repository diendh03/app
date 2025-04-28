import { Link } from 'expo-router';
import { TrashIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, type ViewProps } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import {
  Box,
  Button,
  ButtonIcon,
  Card,
  Divider,
  HStack,
  Image,
  Skeleton,
  Text,
  VStack,
} from '@/components/ui';
import { formatPriceVND, getPriceIncludeVAT, getVAT } from '@/lib';
import { QuantityUpdate } from '@/screens/cart/components/quantity-update';
import { useAppStore } from '@/store';
import { type ProductCart } from '@/types';

type Props = ViewProps & {
  productCart: ProductCart;
};

export const CartItem = ({ productCart, className }: Props) => {
  const { removeProduct } = useAppStore(
    useShallow((state) => ({
      removeProduct: state.removeProduct,
      products: state.products,
    }))
  );
  return (
    <Card
      size="md"
      variant="outline"
      className={`${className} bg-background-0`}
    >
      <HStack space="lg">
        <Skeleton
          variant="rounded"
          className="w-24"
          isLoaded={!!productCart.image}
        >
          <Link href={`/product/${productCart.sku}`} asChild>
            <Pressable>
              <Image
                size="lg"
                source={{
                  uri: productCart.image,
                }}
                alt="image"
              />
              {Number(productCart?.discount?.discount) > 0 && (
                <Box className="absolute right-0 top-0 bg-orange-500 p-1">
                  <Text size="xs" className="text-center text-white" bold>
                    {productCart?.discount?.promotionTagText}
                  </Text>
                </Box>
              )}
            </Pressable>
          </Link>
        </Skeleton>

        <VStack className="flex-1">
          <Text numberOfLines={1} bold>
            {productCart.webName || productCart.name}
          </Text>
          {Number(productCart?.discount?.discount) > 0 ? (
            <>
              <Divider className="my-2" />

              <Box className="flex-row items-center gap-x-1">
                <Text
                  className="px-1 italic text-neutral-400 line-through"
                  size="sm"
                  bold
                >
                  {`${formatPriceVND(productCart.priceIncludeVAT)} / ${productCart?.price?.measureUnitName}`}
                </Text>
                <Text className="text-red-500" size="sm" bold>
                  {`Giảm còn: ${formatPriceVND(getPriceIncludeVAT(getVAT(productCart.exportTax), productCart.discount?.finalPrice))} / ${productCart?.price?.measureUnitName}`}
                </Text>
              </Box>
            </>
          ) : (
            <Text className="text-red-500" size="sm" bold>
              {`${formatPriceVND(productCart.priceIncludeVAT)} / ${productCart?.price?.measureUnitName}`}
            </Text>
          )}
          <Divider className="my-2" />
          <HStack>
            <Text size="sm" className="">
              {productCart?.specification}
            </Text>
          </HStack>
          <Divider className="my-2" />
          <HStack space="md">
            <Button
              size="sm"
              variant="outline"
              action="primary"
              onPress={() => removeProduct(productCart.sku)}
            >
              <ButtonIcon as={TrashIcon} />
            </Button>

            <QuantityUpdate productCart={productCart} />
          </HStack>
        </VStack>
      </HStack>
    </Card>
  );
};
