import debounce from 'lodash.debounce';
import { CheckIcon, CircleXIcon, SearchIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  type TextInput,
  TouchableOpacity,
  type ViewProps,
  VirtualizedList,
} from 'react-native';

import { useLocations } from '@/api/customers';
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  Heading,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Spinner,
  Text,
  View,
  VStack,
} from '@/components/ui';
import { translate, viSlugify } from '@/lib';
import { type ILocation } from '@/types';

type Props = ViewProps & {
  typeId: string | null;
  province: ILocation | null;
  district: ILocation | null;
  ward: ILocation | null;
  isOpen: boolean;
  handleClose: () => void;
  handleSelect: (_typeId: string, loc: ILocation) => void;
};

export const SheetLoctions = ({
  isOpen,
  typeId,
  province,
  district,
  ward,
  handleClose,
  handleSelect,
}: Props) => {
  const sheetTitle = useMemo(() => {
    if (typeId === '1' || !province?.sourceId)
      return translate('delivery_address.province_select');
    if (typeId === '2' || !district?.sourceId)
      return translate('delivery_address.district_select');
    return translate('delivery_address.ward_select');
  }, [typeId, province, district]);

  const params = useMemo(() => {
    if (typeId === '1' || !province?.sourceId) {
      return { typeId: '1', parentId: null, sourceIdAct: province?.sourceId };
    }

    if (typeId === '2' || !district?.sourceId) {
      return {
        typeId: '2',
        parentId: province.sourceId,
        sourceIdAct: district?.sourceId,
      };
    }

    return {
      typeId: '3',
      parentId: district.sourceId,
      sourceIdAct: ward?.sourceId,
    };
  }, [typeId, province, district, ward]);

  const { data: locations, isFetching } = useLocations({
    variables: {
      typeId: params?.typeId,
      parentId: params?.parentId,
    },
  });

  const [dataList, setDataList] = useState<ILocation[]>([]);

  const searchInputRef = React.createRef<TextInput>();
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const handleSearchText = React.useCallback(
    (text: string) => {
      if (text === '') searchInputRef.current?.clear();
      setSearchQuery(text);
    },
    [searchInputRef],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchTextDebounce = React.useCallback(
    debounce(handleSearchText, 1000),
    [],
  );

  useEffect(() => {
    const list = (locations?.items || []) as ILocation[];
    const filterList = list.filter((item) =>
      viSlugify(item?.sourceName || '').includes(viSlugify(searchQuery)),
    );

    setDataList(filterList);
  }, [locations, searchQuery]);

  const onSelect = useCallback(
    (item: ILocation) => {
      handleSearchText('');
      handleSelect(params?.typeId || '', item);
    },
    [handleSearchText, handleSelect, params],
  );

  const _renderItem = useCallback(
    ({ item }: { item: ILocation }) => (
      <TouchableOpacity onPress={() => onSelect(item)}>
        <View className="flex-row items-center justify-between border-b border-background-200 py-2">
          <Text className="pl-1">{item?.sourceName}</Text>
          {item?.sourceId === params?.sourceIdAct && <Icon as={CheckIcon} />}
        </View>
      </TouchableOpacity>
    ),
    [onSelect, params],
  );

  return (
    <Actionsheet isOpen={isOpen} onClose={handleClose} snapPoints={[75]}>
      <ActionsheetBackdrop className="bg-black" />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack space="sm" className="w-full">
          <Heading size="md" className="text-center">
            {sheetTitle}
          </Heading>

          <Input>
            <InputSlot className="pl-3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField
              placeholder={translate('common.search')}
              // @ts-expect-error
              ref={searchInputRef}
              onChangeText={handleSearchTextDebounce}
            />
            <InputSlot className="pr-3" onPress={() => handleSearchText('')}>
              {searchQuery && <InputIcon size="xs" as={CircleXIcon} />}
            </InputSlot>
          </Input>
          {!isFetching ? (
            <VirtualizedList
              data={dataList}
              getItem={(data: ILocation[], index: number): ILocation =>
                data[index]
              }
              getItemCount={() => dataList.length}
              keyExtractor={(item) => item?.sourceId}
              renderItem={_renderItem}
            />
          ) : (
            <View className="mt-10 flex-1 justify-center items-center">
              <Spinner size="large" />
            </View>
          )}
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
};
