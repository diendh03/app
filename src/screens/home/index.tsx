import { FlashList } from '@shopify/flash-list';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import debounce from 'lodash.debounce';
import { CircleXIcon, MicIcon, PackageSearchIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Platform, type TextInput, TouchableOpacity, View } from 'react-native';

import { useGetPromotionProducts, useSearchProducts } from '@/api/products';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  Box,
  colors,
  Image,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Spinner,
  Text,
  VStack,
} from '@/components/ui';
import { checkNeedsUpdate, getUserInfo } from '@/lib/auth/utils';
import {
  GUIDE_LINE,
  GUIDE_LINE_ANDROID,
  GUIDE_LINE_IOS,
} from '@/lib/constants';
import {
  type ProductSearch,
  type PromotionProduct,
  type PromotionProductsResponse,
} from '@/types';

import { recordingOptions } from './common/constant';
import {
  transformDataRequestSearchPromotions,
  uploadAudioAsync,
} from './common/utils';
import { ProductCard } from './components/product-card';
import { AnimatedSoundBars } from './components/recording-popup';

export const HomeScreen = () => {
  const searchInputRef = React.createRef<TextInput>();
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [recording, setRecording] = React.useState<any>(null);
  const [rippleOverflow, setRippleOverflow] = React.useState<boolean>(false);
  const [alertNeedsUpdate, setAlertNeedsUpdate] =
    React.useState<boolean>(false);
  const [linkQR, setLinkQR] = React.useState<string>('');

  const { data, fetchNextPage, isFetching, isFetchingNextPage } =
    useSearchProducts({
      limit: 10,
      searchQuery,
    });

  const searchPromotion = useGetPromotionProducts();
  const customerCart = getUserInfo();

  const products = React.useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data?.pages]);

  const [promotionData, setPromotionData] =
    React.useState<PromotionProductsResponse>();

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      (async () => {
        if (!alertNeedsUpdate) {
          const data = await checkNeedsUpdate();

          if (data?.needsUpdate) {
            setAlertNeedsUpdate(data?.needsUpdate);
            setLinkQR(data?.linkQR);
          }
        }
      })();
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [alertNeedsUpdate])
  );

  useEffect(() => {
    if (products.length > 0) {
      searchPromotion.mutate(
        transformDataRequestSearchPromotions(products, customerCart),
        {
          onSuccess: (res) => {
            setPromotionData(res);
          },
        }
      );
    }
  }, [products]);

  const handleSearchText = React.useCallback(
    (text: string) => {
      if (text === '') searchInputRef.current?.clear();
      setSearchQuery(text);
    },
    [searchInputRef]
  );

  const handleSearchQuerySubmit = React.useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchTextDebounce = React.useCallback(
    debounce(handleSearchQuerySubmit, 1000),
    []
  );

  const onClearSearchText = () => {
    handleSearchText('');
    handleSearchQuerySubmit('');
  };

  const onPressIn = async () => {
    try {
      await Audio.requestPermissionsAsync()
        .then(() => {
          console.log('Permission granted!');
        })
        .catch(() => {
          alert('Vui lòng cấp quyền ghi âm cho ứng dụng');
        });
      setRippleOverflow(!rippleOverflow);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      let fileRecord = new Audio.Recording();
      await fileRecord.prepareToRecordAsync(recordingOptions);

      await fileRecord.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
      setRecording(fileRecord);
    } catch (error: any) {
      return;
    }
  };
  const onPressOut = async () => {
    setRippleOverflow(!rippleOverflow);
    if (!recording) {
      return;
    }
    try {
      await recording.stopAndUnloadAsync();
    } catch (error: any) {
      return;
    }
    // const soundObject = new Audio.Sound();
    const info = await FileSystem.getInfoAsync(recording.getURI() || '');
    if (info.exists) {
      const response: any = await uploadAudioAsync(info.uri);

      const results = response?.results;
      if (results) {
        const transcript = results?.[0].alternatives?.[0].transcript;
        if (!transcript) {
          alert('Không nhận dạng được giọng nói');
        }
        handleSearchQuerySubmit(String(transcript));
        return transcript;
      } else {
        alert('Không nhận dạng được giọng nói');
        return undefined;
      }

      // if (response.data.status === 0) {
      //   let textSTT = response.data.hypotheses[0].utterance;
      //   textSTT = textSTT.replace('.', '');
      //   textSTT = textSTT.replace('?', '');
      //   textSTT = textSTT.trim();
      //   if (textSTT) {
      //     handleSearchQuerySubmit(String(textSTT));
      //   } else {
      //     alert('Không nhận dạng được giọng nói');
      //   }
      // } else {
      //   alert('Không nhận dạng được giọng nói');
      // }
    }
  };

  const _renderItem = React.useCallback(
    ({ item }: { item: ProductSearch }) => {
      const promotionItem = promotionData?.items.find(
        (promo: PromotionProduct) => promo.itemCode === item.sku
      );

      return (
        <ProductCard
          product={item}
          promotion={promotionItem}
          className="mx-3 my-1"
        />
      );
    },

    [promotionData]
  );

  return (
    <View className="flex-1 pb-5">
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
        className="m-3"
      >
        <InputSlot className="pl-3">
          <InputIcon as={PackageSearchIcon} />
        </InputSlot>
        <InputField
          placeholder="Tìm kiếm sản phẩm"
          // @ts-expect-error
          ref={searchInputRef}
          defaultValue={searchQuery}
          onChangeText={handleSearchTextDebounce}
          onEndEditing={(e) => handleSearchQuerySubmit(e.nativeEvent.text)}
        />
        <InputSlot className="pr-3" onPress={onClearSearchText}>
          {searchQuery && !isFetching && (
            <InputIcon size="xs" as={CircleXIcon} />
          )}
          {isFetching && <Spinner size="small" />}
        </InputSlot>

        <InputSlot className="pr-3">
          <TouchableOpacity onPress={() => onPressIn()}>
            <MicIcon color={rippleOverflow ? 'red' : colors.neutral[400]} />
          </TouchableOpacity>
        </InputSlot>
      </Input>

      <FlashList
        data={data?.pages.flatMap((page) => page.items)}
        renderItem={_renderItem}
        keyExtractor={(item) => item.sku.toString()}
        onEndReached={() => !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetching && isFetchingNextPage ? <Spinner size="large" /> : null
        }
        ListEmptyComponent={() =>
          !isFetching && (
            <View className="mt-5 flex-1 items-center justify-center">
              <Text className="flex-1 items-center text-primary-400">
                {searchQuery
                  ? 'Không tìm thấy sản phẩm'
                  : 'Danh sách sản phẩm trống'}
              </Text>
            </View>
          )
        }
        estimatedItemSize={100}
      />

      <AnimatedSoundBars
        visible={rippleOverflow}
        onClose={() => onPressOut()}
      />

      <AlertDialog isOpen={alertNeedsUpdate}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogBody className="h-3/5">
            <VStack space="md">
              <Box className="items-center">
                <Image
                  source={{
                    uri: linkQR,
                  }}
                  alt="QR Code Install"
                  size="2xl"
                />
              </Box>
              <FlashList
                data={[
                  ...GUIDE_LINE,
                  ...(Platform.OS === 'ios'
                    ? GUIDE_LINE_IOS
                    : GUIDE_LINE_ANDROID),
                ]}
                renderItem={({ item }) => (
                  <Text className="text-justify">{item.title}</Text>
                )}
                estimatedItemSize={200}
              />
            </VStack>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
};
