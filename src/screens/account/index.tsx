import { LogOutIcon } from 'lucide-react-native';
import React from 'react';

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from '@/components/ui';
import { signOut } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';

import { LanguageItem } from './components/language-item';
import { ThemeItem } from './components/theme-item';

export const AccountScreen = () => {
  const userInfo = getUserInfo();
  return (
    <>
      <ScrollView className="mx-4">
        <Card variant="outline" className="mt-4 bg-background-0">
          <Box className="flex-row items-center justify-between">
            <HStack space="md" className="flex-1 items-center">
              <Avatar size="lg">
                <AvatarFallbackText>A</AvatarFallbackText>
                <AvatarImage
                  source={require('@/assets/images/png/avatar_def.png')}
                />
              </Avatar>
              <VStack className="flex-1">
                <HStack>
                  <Heading size="sm">{userInfo?.profile.fullName}</Heading>
                </HStack>
                <Text size="sm">{userInfo?.profile.mobilePhone}</Text>
              </VStack>
            </HStack>
            <Pressable onPress={signOut}>
              <Icon as={LogOutIcon} className="text-error-500" />
            </Pressable>
          </Box>
        </Card>

        <LanguageItem />

        <ThemeItem />
      </ScrollView>
    </>
  );
};
