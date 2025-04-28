import { useLocalSearchParams } from 'expo-router';
import { ChevronDownIcon, ChevronUpIcon, HeartIcon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, useWindowDimensions } from 'react-native';
// import { useShallow } from 'zustand/react/shallow';
import HTMLView from 'react-native-htmlview';

import { useGetPromotionProducts, useProductSlug } from '@/api/products';
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
  Box,
  Center,
  HStack,
  Icon,
  Image,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from '@/components/ui';
import { ColdStorage, NearDated, SpecialControl } from '@/components/ui/icons';
import { PageIndicator } from '@/components/ui/page-indicator';
import { formatPriceVND, getPriceIncludeVAT, getVAT } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';
import { type PromotionProduct, type PromotionProductsResponse } from '@/types';

import { transformDataRequestSearchPromotionSuggest } from './common/utils';
import Countdown from './components/countdown';

export const ProductScreen = () => {
  const { slug } = useLocalSearchParams();

  const { data, isFetching } = useProductSlug(slug.toString());
  const [promotion, setPromotion] = useState<PromotionProduct>();

  const customerCart = getUserInfo();

  const searchPromotion = useGetPromotionProducts();

  useEffect(() => {
    if (data)
      searchPromotion.mutate(
        transformDataRequestSearchPromotionSuggest(data, customerCart),
        {
          onSuccess: (data: PromotionProductsResponse) => {
            setPromotion(data.items[0]);
          },
        }
      );
  }, [data]);

  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const animatedCurrent = useRef(Animated.divide(scrollX, width)).current;

  const infos = [
    {
      label: 'Danh mục',
      value: data?.categories[0].name,
    },
    {
      label: 'Dạng bào chế',
      value: data?.dosageForm,
    },
    {
      label: 'Quy cách',
      value: data?.specification,
    },
    {
      label: 'Thành phần',
      value: data?.ingredient?.map((item) => item?.name).join(', '),
    },
    {
      label: 'Xuất xứ thương hiệu',
      value: data?.manufactor,
    },
    {
      label: 'Nhà sản xuất',
      value: data?.producer,
    },
    {
      label: 'Thời hạn bảo hành',
      value: data?.warrantyPeriod,
    },
    {
      label: 'Số đăng ký',
      value: data?.registNum,
    },
  ];

  const accordions = [
    {
      title: 'Thành phần',
      content: data?.webIngredient,
    },
    {
      title: 'Công dụng',
      content: data?.usage,
    },
    {
      title: 'Liều dùng',
      content: data?.dosage,
    },
    {
      title: 'Tác dụng phụ',
      content: data?.adverseEffect,
    },
    {
      title: 'Lưu ý',
      content: data?.careful,
    },
    {
      title: 'Bảo quản',
      content: data?.preservation,
    },
  ];

  return (
    <>
      {!isFetching ? (
        <Box className="flex-1 bg-background-0">
          <Box className="mt-4">
            <Animated.ScrollView
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                {
                  useNativeDriver: true,
                }
              )}
            >
              {data?.secondaryImages?.map((page, index) => (
                <Center key={index} style={{ width }}>
                  <Image
                    size="2xl"
                    source={{
                      uri: page,
                    }}
                    alt="image"
                  />
                </Center>
              ))}
            </Animated.ScrollView>
            <Center className="absolute inset-x-1/2 bottom-2 origin-[-50%_-50%]">
              <PageIndicator
                count={data?.secondaryImages?.length || 0}
                current={animatedCurrent}
                color="#F37021"
              />
            </Center>
            {Number(promotion?.discount) > 0 && (
              <Box className="absolute right-2 top-0 bg-orange-500 p-1">
                <Text size="md" className="text-center text-white" bold>
                  {promotion?.promotionTagText}
                </Text>
              </Box>
            )}
          </Box>
          <ScrollView className="">
            <VStack space="lg" className="px-4">
              <Box className="mt-2 flex-row items-center justify-between">
                <VStack className="flex-1" space="md">
                  <Text>Thương hiệu: {data?.brand}</Text>
                  <Text bold size="lg">
                    {data?.webName || data?.name}
                  </Text>
                  {Number(promotion?.discount) > 0 ? (
                    <>
                      <Box className="flex-row items-center gap-x-1">
                        <Text className="p-1 text-neutral-400" size="sm" bold>
                          Thời gian giảm giá còn:
                        </Text>
                        <Countdown
                          expiredDate={String(promotion?.timeExpired)}
                        />
                      </Box>

                      <Box className="flex-row items-center gap-x-1">
                        <Text
                          className="px-1 italic text-neutral-400 line-through"
                          size="sm"
                          bold
                        >
                          {`${formatPriceVND(data?.priceIncludeVAT)} / ${data?.price?.measureUnitName}`}
                        </Text>
                        <Text className="text-red-500" size="sm" bold>
                          {`Giảm còn: ${formatPriceVND(getPriceIncludeVAT(getVAT(data?.exportTax), promotion?.finalPrice))} / ${data?.price?.measureUnitName}`}
                        </Text>
                      </Box>
                    </>
                  ) : (
                    <Text className="text-red-500" size="sm" bold>
                      {`${formatPriceVND(data?.priceIncludeVAT)} / ${data?.price?.measureUnitName}`}
                    </Text>
                  )}

                  <HStack>
                    {data?.isSpecialControl && <SpecialControl />}
                    {data?.isColdStorage && <ColdStorage />}
                    {data?.isExpireDateControl && <NearDated />}
                  </HStack>
                </VStack>
                <Pressable onPress={() => {}}>
                  <Icon as={HeartIcon} />
                </Pressable>
              </Box>
              <Box className="mt-2 flex-row items-center justify-between">
                <HStack space="md" className="mr-4 flex-1">
                  {/* <Button
                  size="sm"
                  variant="outline"
                  action="primary"
                  onPress={() => {
                    if (data?.sku && !cartProduct?.sku) {
                      addProduct(data);
                    } else if (cartProduct?.sku) {
                      removeProduct(cartProduct.sku);
                    }
                  }}
                >
                  <ButtonIcon
                    as={cartProduct?.sku ? TrashIcon : ShoppingCartIcon}
                  />
                </Button> */}

                  {/* {cartProduct?.sku && (
                  <QuantityUpdate cartProduct={cartProduct} />
                )} */}
                </HStack>
                {/* <Text>{formatPriceVND(finalPrice)}</Text> */}
              </Box>
              <VStack space="md">
                {infos.map((info) => {
                  return (
                    <Box key={info.label} className="flex-row">
                      <Text className="flex-1">{info.label}</Text>
                      <Text className="flex-1 text-left">{info.value}</Text>
                    </Box>
                  );
                })}
              </VStack>
            </VStack>

            <Accordion variant="unfilled" type="multiple">
              {accordions.map((acc, index) => {
                return (
                  <AccordionItem key={index} value={`${index}`}>
                    <AccordionHeader>
                      <AccordionTrigger>
                        {({ isExpanded }) => {
                          return (
                            <>
                              <AccordionTitleText>
                                {acc.title}
                              </AccordionTitleText>
                              <AccordionIcon
                                as={
                                  isExpanded ? ChevronUpIcon : ChevronDownIcon
                                }
                              />
                            </>
                          );
                        }}
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent className="mt-0 flex-1 bg-background-0 py-2">
                      <AccordionContentText className="box-content py-1">
                        <HTMLView value={String(acc?.content)} />
                      </AccordionContentText>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollView>
        </Box>
      ) : (
        <Box className="flex-1 justify-center">
          <Spinner size="large" />
        </Box>
      )}
    </>
  );
};
