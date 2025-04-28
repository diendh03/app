import { zodResolver } from '@hookform/resolvers/zod';
import { FlashList } from '@shopify/flash-list';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import { AlertCircleIcon, CircleXIcon, PhoneIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Platform } from 'react-native';
import uuid from 'react-native-uuid';
import { isEmpty, isMobilePhone } from 'validator';
import { z } from 'zod';

import { useCheckPhoneNumberExists, useRequestOTP } from '@/api/customers';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  Box,
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  HStack,
  Image,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  LinkText,
  Spinner,
  Text,
  View,
  VStack,
} from '@/components/ui';
import { translate } from '@/lib';
import { checkNeedsUpdate } from '@/lib/auth/utils';
import {
  GUIDE_LINE,
  GUIDE_LINE_ANDROID,
  GUIDE_LINE_IOS,
} from '@/lib/constants';

import AuthLayout from './components/auth-layout';

const schema = z.object({
  phone: z
    .string()
    .refine((val) => !isEmpty(val), {
      message: translate('Validation.PhoneNumberRequired'),
    })
    .refine((val) => isMobilePhone(val, 'vi-VN'), {
      message: translate('Validation.PhoneNumberInvalidFormat'),
    }),
});

export type FormType = z.infer<typeof schema>;

export default function LoginScreen() {
  const {
    handleSubmit,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      phone: '',
    },
    resolver: zodResolver(schema),
  });

  const [searchQuery, setSearchQuery] = useState<string>();
  const { data, isFetching, isError } = useCheckPhoneNumberExists({
    phoneNumber: searchQuery ?? '',
  });
  const [alertNeedsUpdate, setAlertNeedsUpdate] = useState<boolean>(false);
  const [linkQR, setLinkQR] = useState<string>('');
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
    if (isError || !data) {
      setError('phone', {
        type: 'not_exists',
        message: translate('Validation.PhoneNumberNotExists'),
      });
    }
  }, [isError, data, setError]);

  const handleSearchQueryClear = useCallback(() => {
    setSearchQuery('');
    reset();
  }, [setSearchQuery, reset]);

  const handleEndEditing = useCallback((formData?: FormType) => {
    Keyboard.dismiss();
    setSearchQuery(formData?.phone);
  }, []);

  const router = useRouter();

  const mutation = useRequestOTP();

  const handleRequestOTP = (formData: FormType) => {
    const requestId = uuid.v4();
    mutation.mutate({
      phoneNumber: formData.phone,
      requestId,
    });
    router.push({
      pathname: '/auth/verify-otp',
      params: { phone: formData.phone, requestId },
    });
  };

  return (
    <>
      <AuthLayout>
        <View className="flex-1" />
        <VStack space="md" className="mx-4 flex-1">
          <FormControl
            isInvalid={!!errors?.phone?.message}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
          >
            <Controller
              name="phone"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input>
                  <InputSlot className="pl-3">
                    <InputIcon as={PhoneIcon} />
                  </InputSlot>
                  <InputField
                    placeholder={translate('Validation.EnterPhoneNumber')}
                    returnKeyType="done"
                    value={value}
                    className="text-gray-500"
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      if (text === '') {
                        handleSearchQueryClear();
                      }
                      onChange(text);
                    }}
                    onEndEditing={handleSubmit(handleEndEditing)}
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => handleSearchQueryClear()}
                  >
                    {value && !isFetching && (
                      <InputIcon size="xs" as={CircleXIcon} />
                    )}
                    {isFetching && <Spinner size="small" />}
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors?.phone?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button
            size="md"
            variant="solid"
            className="bg-black"
            action="primary"
            onPress={handleSubmit(handleRequestOTP)}
          >
            <ButtonText className="text-white">
              {translate('Login.ReceiveOTPCode')}
            </ButtonText>
          </Button>

          <Box className="flex flex-row justify-end">
            <HStack>
              <Text className="text-gray-500">
                {translate('Login.LoginWith')}
              </Text>
              <Link href="/auth/verify-password">
                <LinkText>{translate('Login.WithPassword')}</LinkText>
              </Link>
            </HStack>
          </Box>
        </VStack>
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
      </AuthLayout>
    </>
  );
}
