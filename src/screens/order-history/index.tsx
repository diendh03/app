import { useNavigation } from 'expo-router';
import debounce from 'lodash.debounce';
import { CircleXIcon, PackageSearchIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { FlatList, RefreshControl, type TextInput, View } from 'react-native';

import { useGetListHistoryOrder } from '@/api/order';
import {
  Box,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  SafeAreaView,
  Spinner,
  Text,
} from '@/components/ui';
import { translate } from '@/lib';
import { type Order } from '@/types/order';

import { tabCodeList } from './common/constants';
import OrderItem from './components/order-item';
import { SingleSelect } from './components/ui-select';

interface FlatListItem {
  index: number;
  item: Order;
}

const HistoryOrderScreen = () => {
  const searchInputRef = React.createRef<TextInput>();
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchText, setSearchText] = React.useState<string>('');
  const [tabCode, setTabCode] = React.useState<string>('1');

  const {
    data,
    isFetching,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useGetListHistoryOrder({
    limit: 10,
    search: searchQuery,
    tabCode: tabCode,
  });
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const handleSearchText = React.useCallback(
    (text: string) => {
      if (text === '') searchInputRef.current?.clear();
      setSearchText(text);
    },
    [searchInputRef]
  );

  const handleSearchQuerySubmit = React.useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchTextDebounce = React.useCallback(
    debounce(handleSearchText, 1000),
    []
  );

  const onClearSearchText = () => {
    handleSearchText('');
    handleSearchQuerySubmit('');
  };

  const _renderItem = React.useCallback(
    (item: FlatListItem) => <OrderItem order={item.item} />,
    []
  );

  return (
    <SafeAreaView edges={['right', 'left']} className="flex-1">
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
          placeholder={translate('HistoryOrder.PlaceholderSearch')}
          // @ts-expect-error
          ref={searchInputRef}
          onChangeText={handleSearchTextDebounce}
          onEndEditing={(e) => handleSearchQuerySubmit(e.nativeEvent.text)}
        />
        <InputSlot className="pr-3" onPress={onClearSearchText}>
          {searchText && !isFetching && (
            <InputIcon size="xs" as={CircleXIcon} />
          )}
          {isFetching && <Spinner size="small" />}
        </InputSlot>
      </Input>

      <Box className="flex-row items-center gap-x-3 px-3">
        <Text className="text-base font-semibold text-primary-500">
          Trạng thái:
        </Text>
        <SingleSelect
          data={tabCodeList}
          onSelect={(value) => {
            setTabCode(value);
          }}
          selectedValue={tabCode}
        />
      </Box>
      <FlatList
        data={data?.pages.flatMap((page) => page.orders)}
        renderItem={_renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        onEndReached={() => !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isFetching && isFetchingNextPage ? <Spinner size="large" /> : null
        }
        ListEmptyComponent={() =>
          !isFetching && (
            <View className="mt-5 flex-1 items-center justify-center">
              <Text className="flex-1 items-center text-gray-400">
                {searchQuery ? 'Không tìm thấy đơn hàng' : 'Không có đơn hàng'}
              </Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => {
              refetch();
            }}
          />
        }
      />
    </SafeAreaView>
  );
};

export default HistoryOrderScreen;
