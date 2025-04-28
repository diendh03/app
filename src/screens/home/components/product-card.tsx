import { Link } from 'expo-router';
import { ShoppingCartIcon } from 'lucide-react-native';
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
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
  VStack,
} from '@/components/ui';
import { ColdStorage, NearDated, SpecialControl } from '@/components/ui/icons';
import { formatPriceVND, getPriceIncludeVAT, getVAT } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';
import { QuantityUpdate } from '@/screens/cart/components/quantity-update';
import { useAppStore } from '@/store';
import { type ProductSearch, type PromotionProduct } from '@/types';

import Countdown from './countdown';

type Props = ViewProps & {
  product: ProductSearch;
  promotion?: PromotionProduct;
};

export const ProductCard = ({ product, className, promotion }: Props) => {
  const { products, addProduct } = useAppStore(
    useShallow((state) => ({
      addProduct: state.addProduct,
      products: state.products,
    }))
  );
  const toast = useToast();
  const customerCart = getUserInfo();
  const productCart = React.useMemo(
    () => products.find((p) => p.sku === product.sku),
    [products, product]
  );

  const isHasSku = React.useMemo(() => !!productCart?.sku, [productCart]);

  const _preCheckKSDB = () => {
    if (product.specialControls === null) {
      return true;
    } else if (product.specialControls?.length === 0) {
      return true;
    } else if (customerCart?.profile?.specialControl?.length === 0) {
      return false;
    } else {
      return product?.specialControls?.every((productControl) =>
        customerCart?.profile?.specialControl?.some(
          (customerControl: any) =>
            customerControl.specialControlName === productControl.name
        )
      );
    }
  };

  const _preCheckInventory = () => {
    if (product.price.inventory > 1) {
      return true;
    }
    return false;
  };

  const handleAddToCart = () => {
    if (!customerCart?.profile?.isActive) {
      return toast.show({
        id: 'inValid-isActivve',
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              action={'warning'}
              variant="solid"
              className="w-full"
            >
              <ToastTitle>Thông báo</ToastTitle>
              <ToastDescription>
                Hồ sơ khách hàng đang bị khóa. Vui lòng liên hệ CS để kích hoạt
                hồ sơ khách hàng.
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
    if (_preCheckKSDB()) {
      if (_preCheckInventory()) {
        return addProduct({ ...product, discount: promotion });
      } else {
        return toast.show({
          id: 'inValid-inventory',
          placement: 'top',
          duration: 3000,
          render: ({ id }) => {
            const uniqueToastId = 'toast-' + id;
            return (
              <Toast
                nativeID={uniqueToastId}
                action={'warning'}
                variant="solid"
                className="w-full"
              >
                <ToastTitle>Thông báo</ToastTitle>
                <ToastDescription>
                  Sản phẩm này không đủ lượng tồn kho!!
                </ToastDescription>
              </Toast>
            );
          },
        });
      }
    } else {
      return toast.show({
        id: 'inValid-KSDB',
        placement: 'top',
        duration: 3000,
        render: ({ id }) => {
          const uniqueToastId = 'toast-' + id;
          return (
            <Toast
              nativeID={uniqueToastId}
              action={'warning'}
              variant="solid"
              className="w-full"
            >
              <ToastTitle>Thông báo</ToastTitle>
              <ToastDescription>
                Sản phẩm này thuộc danh mục KSDB mà bạn không được phép mua
              </ToastDescription>
            </Toast>
          );
        },
      });
    }
  };

  return (
    <Card
      size="md"
      variant="outline"
      className={`${className} bg-background-0`}
    >
      <HStack space="lg">
        <Skeleton variant="rounded" className="w-24" isLoaded={!!product.image}>
          <Link href={`/product/${product.sku}?slug=${product.slug}`} asChild>
            <Pressable>
              <Image
                size="lg"
                source={{
                  uri: product.image,
                }}
                alt="image"
              />
              {Number(promotion?.discount) > 0 && (
                <Box className="absolute right-0 top-0 bg-orange-500 p-1">
                  <Text size="xs" className="text-center text-white" bold>
                    {promotion?.promotionTagText}
                  </Text>
                </Box>
              )}
            </Pressable>
          </Link>
        </Skeleton>

        <VStack className="flex-1">
          <Link
            href={
              product.slug
                ? `/product/${product.sku}?slug=${product.slug}`
                : '/'
            }
            asChild
          >
            <Pressable>
              <Text numberOfLines={1} bold>
                {product.webName || product.name}
              </Text>

              {Number(promotion?.discount) > 0 ? (
                <>
                  <Box className="flex-row items-center gap-x-1">
                    <Text className="p-1 text-neutral-400" size="sm" bold>
                      Thời gian giảm giá còn:
                    </Text>
                    <Countdown expiredDate={String(promotion?.timeExpired)} />
                  </Box>

                  {isHasSku ? (
                    Number(productCart?.discount?.discount) > 0 ? (
                      <>
                        <Divider className="my-2" />
                        <Box className="flex-row items-center gap-x-1">
                          <Text
                            className="px-1 italic text-neutral-400 line-through"
                            size="sm"
                            bold
                          >
                            {`${formatPriceVND(product.priceIncludeVAT)} / ${product?.price?.measureUnitName}`}
                          </Text>
                          <Text className="text-red-500" size="sm" bold>
                            {`Giảm còn: ${formatPriceVND(getPriceIncludeVAT(getVAT(product.exportTax), productCart?.discount?.finalPrice))} / ${product?.price?.measureUnitName}`}
                          </Text>
                        </Box>
                      </>
                    ) : (
                      <Text className="text-red-500" size="sm" bold>
                        {`${formatPriceVND(product.priceIncludeVAT)} / ${product?.price?.measureUnitName}`}
                      </Text>
                    )
                  ) : (
                    <>
                      <Divider className="my-2" />
                      <Box className="flex-row items-center gap-x-1">
                        <Text
                          className="px-1 italic text-neutral-400 line-through"
                          size="sm"
                          bold
                        >
                          {`${formatPriceVND(product.priceIncludeVAT)} / ${product?.price?.measureUnitName}`}
                        </Text>
                        <Text className="text-red-500" size="sm" bold>
                          {`Giảm còn: ${formatPriceVND(getPriceIncludeVAT(getVAT(product.exportTax), promotion?.finalPrice))} / ${product?.price?.measureUnitName}`}
                        </Text>
                      </Box>
                    </>
                  )}
                </>
              ) : (
                <Text className="text-red-500" size="sm" bold>
                  {`${formatPriceVND(product.priceIncludeVAT)} / ${product?.price?.measureUnitName}`}
                </Text>
              )}

              <Divider className="my-2" />

              <HStack space="md">
                <Text size="sm" className="">
                  {product?.specification}
                </Text>
                {product?.isSpecialControl && <SpecialControl />}
                {product?.isColdStorage && <ColdStorage />}
                {product?.isExpireDateControl && <NearDated />}
              </HStack>
            </Pressable>
          </Link>

          <Divider className="my-2" />
          <HStack space="md">
            {product.price.inventory > 0 ? (
              <Button
                size="md"
                variant="outline"
                action="primary"
                isDisabled={isHasSku}
                onPress={() => {
                  if (Number(product?.price?.price) > 0)
                    return handleAddToCart();
                }}
              >
                <ButtonIcon as={ShoppingCartIcon} />
              </Button>
            ) : (
              <Text size="md" className="mt-1 font-bold text-red-500">
                Hết tồn
              </Text>
            )}

            {productCart?.sku && <QuantityUpdate productCart={productCart} />}
          </HStack>
        </VStack>
      </HStack>
    </Card>
  );
};
