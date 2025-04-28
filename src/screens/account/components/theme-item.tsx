import classNames from 'classnames';
import {
  CircleIcon,
  ContrastIcon,
  MoonIcon,
  SunIcon,
} from 'lucide-react-native';
import React from 'react';

import {
  Box,
  Card,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  Text,
} from '@/components/ui';
import { type ColorSchemeType, translate, useSelectedTheme } from '@/lib';

export const ThemeItem = () => {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();
  const handleThemeChange = React.useCallback(
    (option: string) => {
      setSelectedTheme(option as ColorSchemeType);
    },
    [setSelectedTheme]
  );

  const themes = React.useMemo(
    () => [
      {
        label: translate('Common.System'),
        value: 'system',
        icon: ContrastIcon,
        divier: true,
      },
      {
        label: translate('Common.Light'),
        value: 'light',
        icon: SunIcon,
        divier: true,
      },
      {
        label: translate('Common.Dark'),
        icon: MoonIcon,
        value: 'dark',
        divier: false,
      },
    ],
    []
  );

  return (
    <>
      <Text bold className="mx-2 my-4">
        {translate('Common.Theme')}
      </Text>

      <Card variant="outline" className="bg-background-0 p-0">
        <RadioGroup value={selectedTheme} onChange={handleThemeChange}>
          {themes.map((theme) => {
            return (
              <Radio key={theme.value} value={theme.value}>
                <Box
                  className={`flex-row  px-4 py-3 ${classNames({ 'border-b border-background-200': theme.divier })}`}
                >
                  <HStack className="flex-1" space="md">
                    <Icon as={theme.icon} />
                    <Text> {theme.label}</Text>
                  </HStack>
                  <RadioIndicator>
                    <RadioIcon as={CircleIcon} />
                  </RadioIndicator>
                </Box>
              </Radio>
            );
          })}
        </RadioGroup>
      </Card>
    </>
  );
};
