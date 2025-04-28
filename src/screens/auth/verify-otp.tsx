import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  CircleXIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import { isEmpty } from 'validator';
import { z } from 'zod';

import { useRequestOTP, useVerifyWithOTP } from '@/api/customers';
import {
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
  Pressable,
  Text,
  View,
  VStack,
} from '@/components/ui';
import { signIn, translate } from '@/lib';

import AuthLayout from './components/auth-layout';

type Props = {
  phoneNumber: string;
  handleSetRequestId: (requestId: string) => void;
};

const CountDownTime = React.memo(
  ({ phoneNumber, handleSetRequestId }: Props) => {
    const [countDown, setCountDown] = useState(0);
    const [runTimer, setRunTimer] = useState(true);

    useEffect(() => {
      let timerId: number | NodeJS.Timeout;

      if (runTimer) {
        setCountDown(60 * 3);
        timerId = setInterval(() => {
          setCountDown((oldCountDown) => oldCountDown - 1);
        }, 1000);
      }

      return () => clearInterval(timerId);
    }, [runTimer]);

    useEffect(() => {
      if (countDown < 0 && runTimer) {
        setRunTimer(false);
        setCountDown(0);
      }
    }, [countDown, runTimer]);

    const seconds = String(countDown % 60).padStart(2, '0');
    const minutes = String(Math.floor(countDown / 60)).padStart(2, '0');

    const mutation = useRequestOTP();

    const handleRequestOTP = () => {
      const requestId = uuid.v4();
      mutation.mutate({
        phoneNumber: phoneNumber,
        requestId,
      });
      handleSetRequestId(requestId);
      setRunTimer(true);
    };

    return (
      <Box className="flex flex-row justify-center">
        {countDown === 0 ? (
          <Button
            size="sm"
            variant="link"
            onPress={handleRequestOTP}
            isDisabled={mutation.isPending}
          >
            <Text className="text-info-600">
              {translate('Login.ResendOTP')}
            </Text>
          </Button>
        ) : (
          <HStack>
            <Text className="text-gray-500">
              {translate('Login.OTPCodeExpiredAfter')}
            </Text>
            <Text className="text-info-600">{`${minutes}:${seconds}`}</Text>
          </HStack>
        )}
      </Box>
    );
  }
);

const schema = z.object({
  otp: z
    .string()
    .refine((val) => !isEmpty(val), {
      message: translate('Validation.OTPRequired'),
    })
    .refine((val) => val.length === 6, {
      message: translate('Validation.OTPInvalidLength'),
    }),
});

export type FormType = z.infer<typeof schema>;

export default function VerifyOtpScreen() {
  const {
    handleSubmit,
    control,
    resetField,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(schema),
  });

  const { phone, requestId } = useLocalSearchParams();
  const [idRequest, setRequestId] = useState<string>(
    Array.isArray(requestId) ? requestId[0] : requestId
  );

  const mutation = useVerifyWithOTP();

  const handleSignIn = (formData: FormType) => {
    mutation.mutate({
      phoneNumber: Array.isArray(phone) ? phone[0] : phone,
      otp: formData.otp,
      requestId: idRequest,
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
          <Text className="text-center text-gray-500">
            {translate('Login.PleaseEnterTheOTPCodeSentToYourPhoneNumber')}
          </Text>
          <Text className="text-center text-info-600">{phone}</Text>

          <FormControl
            isInvalid={!!errors?.otp?.message}
            size="md"
            isDisabled={false}
            isReadOnly={false}
            isRequired={false}
          >
            <Controller
              name="otp"
              control={control}
              render={({ field: { onBlur, onChange, value } }) => (
                <Input variant="outline" size="md">
                  <InputField
                    textAlign="center"
                    textContentType="oneTimeCode"
                    className="text-gray-500"
                    maxLength={6}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(value) => onChange(value)}
                    onEndEditing={handleSubmit(handleSignIn)}
                  />
                  <InputSlot className="pr-3" onPress={() => resetField('otp')}>
                    {value && <InputIcon size="xs" as={CircleXIcon} />}
                  </InputSlot>
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon as={AlertCircleIcon} />
              <FormControlErrorText>
                {errors?.otp?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <Button
            size="md"
            variant="solid"
            action="primary"
            className="bg-black"
            onPress={handleSubmit(handleSignIn)}
          >
            {mutation.isPending && <ButtonSpinner />}
            <ButtonText className="text-white">
              {translate('Login.Login')}
            </ButtonText>
          </Button>
          <CountDownTime
            phoneNumber={Array.isArray(phone) ? phone[0] : phone}
            handleSetRequestId={(value: string) => setRequestId(value)}
          />
        </VStack>
      </AuthLayout>
    </>
  );
}
