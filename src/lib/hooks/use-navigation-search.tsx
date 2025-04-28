import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { type SearchBarProps } from 'react-native-screens';

import { colors } from '@/components/ui';

const defaultSearchOptions: SearchBarProps = {
  tintColor: colors.black,
  hideWhenScrolling: false,
};

export const useNavigationSearch = ({
  searchBarOptions,
}: {
  searchBarOptions?: SearchBarProps;
}) => {
  const [search, setSearch] = useState('');

  const navigation = useNavigation();

  // const handleOnChangeText: SearchBarProps['onChangeText'] = ({
  //   nativeEvent: { text },
  // }) => {
  //   setSearch(text);
  // };

  const handleOnSearchButtonPress: SearchBarProps['onSearchButtonPress'] = ({
    nativeEvent: { text },
  }) => {
    setSearch(text);
  };

  const handleOnCancelButtonPress: SearchBarProps['onCancelButtonPress'] =
    () => {
      setSearch('');
    };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        ...defaultSearchOptions,
        ...searchBarOptions,
        // onChangeText: handleOnChangeText,
        onSearchButtonPress: handleOnSearchButtonPress,
        onCancelButtonPress: handleOnCancelButtonPress,
      },
    });
  }, [navigation, searchBarOptions]);

  return search;
};
