import classNames from 'classnames';
import { CircleIcon, LanguagesIcon } from 'lucide-react-native';
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
import { translate, useSelectedLanguage } from '@/lib';
import { type Language } from '@/lib/i18n/resources';

export const LanguageItem = () => {
  const { language, setLanguage } = useSelectedLanguage();

  const handleLangChange = React.useCallback(
    (option: string) => {
      setLanguage(option as Language);
    },
    [setLanguage]
  );

  const langs = React.useMemo(
    () => [
      {
        label: translate('Common.English'),
        value: 'en',
        icon: LanguagesIcon,
        divier: true,
      },
      {
        label: translate('Common.Vietnamese'),
        value: 'vi',
        icon: LanguagesIcon,
        divier: false,
      },
    ],
    []
  );

  return (
    <>
      <Text bold className="mx-2 my-4">
        {translate('Common.Language')}
      </Text>

      <Card variant="outline" className="bg-background-0 p-0">
        <RadioGroup value={language} onChange={handleLangChange}>
          {langs.map((lang) => {
            return (
              <Radio key={lang.value} value={lang.value}>
                <Box
                  className={`flex-row  px-4 py-3 ${classNames({ 'border-b border-background-200': lang.divier })}`}
                >
                  <HStack className="flex-1" space="md">
                    <Icon as={lang.icon} />
                    <Text> {lang.label}</Text>
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
