import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import {
  ArrowLeftIcon,
  CircleXIcon,
  EyeIcon,
  EyeOffIcon,
  InfoIcon,
  LockIcon,
  PhoneIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { isEmpty, isMobilePhone } from 'validator';
import { z } from 'zod';

import { useVerifyWithPassword } from '@/api/customers';
import {
  Alert,
  AlertCircleIcon,
  AlertIcon,
  AlertText,
  Box,
  Button,
  ButtonSpinner,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  HStack,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  LinkText,
  Pressable,
  Text,
  View,
  VStack,
} from '@/components/ui';
import { signIn, translate } from '@/lib';

import AuthLayout from './components/auth-layout';

const schema = z.object({
  username: z
    .string()
    .refine((val) => !isEmpty(val), {
      message: translate('Validation.PhoneNumberRequired'),
    })
    .refine((val) => isMobilePhone(val, 'vi-VN'), {
      message: translate('Validation.PhoneNumberInvalidFormat'),
    }),
  password: z.string().refine((val) => !isEmpty(val), {
    message: translate('Validation.PasswordRequired'),
  }),
});

export type FormType = z.infer<typeof schema>;

export default function VerifyPasswordScreen() {
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      username: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const mutation = useVerifyWithPassword();

  const handleSignIn = (formData: FormType) => {
    mutation.mutate({
      username: formData.username,
      password: formData.password,
    });
  };

  useEffect(() => {
    if (mutation.data?.accessToken) {
      signIn();
      router.navigate('/');
    }
  }, [mutation]);

  return (
    <>
      <AuthLayout>
        <Pressable
          onPress={() => router.back()}
          className="absolute left-5 top-11"
        >
          <ArrowLeftIcon size={25} color={'black'} />
        </Pressable>
        <View className="flex-1" />
        <VStack space="md" className="mx-4 flex-1">
          <FormControl
            isInvalid={!!errors?.username?.message}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
          >
            <Controller
              name="username"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input>
                  <InputSlot className="pl-3">
                    <InputIcon as={PhoneIcon} />
                  </InputSlot>
                  <InputField
                    placeholder={translate('Validation.EnterPhoneNumber')}
                    value={value}
                    className="text-gray-500"
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => resetField('username')}
                  >
                    {value && <InputIcon size="xs" as={CircleXIcon} />}
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors?.username?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl
            isInvalid={!!errors?.password?.message}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
          >
            <Controller
              name="password"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input>
                  <InputSlot className="pl-3">
                    <InputIcon as={LockIcon} />
                  </InputSlot>
                  <InputField
                    placeholder={translate('Validation.EnterPassword')}
                    type={showPassword ? 'text' : 'password'}
                    className="text-gray-500"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => setShowPassword((showState) => !showState)}
                  >
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors?.password?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button
            size="md"
            variant="solid"
            className="bg-black"
            action="primary"
            onPress={handleSubmit(handleSignIn)}
          >
            {mutation.isPending && <ButtonSpinner />}
            <ButtonText className="text-white">
              {translate('Login.Login')}
            </ButtonText>
          </Button>

          {mutation.isError && (
            <Alert action="error" variant="solid">
              <AlertIcon as={InfoIcon} />
              <AlertText>
                {mutation.error.response?.data?.message?.errorDescription ||
                  mutation.error.response?.data?.message}
              </AlertText>
            </Alert>
          )}

          <Box className="flex flex-row justify-end">
            <HStack>
              <Text className="text-gray-500">
                {translate('Login.LoginWith')}
              </Text>
              <Button
                className="items-start"
                variant="link"
                onPress={() => router.back()}
              >
                <LinkText>{translate('Login.WithOTP')}</LinkText>
              </Button>
            </HStack>
          </Box>
        </VStack>
      </AuthLayout>
    </>
  );
}
