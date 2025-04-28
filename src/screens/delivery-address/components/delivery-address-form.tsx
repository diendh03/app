import { zodResolver } from '@hookform/resolvers/zod';
import { BookUserIcon, ChevronDownIcon, PhoneIcon } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import { isEmpty, isMobilePhone } from 'validator';
import { z } from 'zod';

import {
  AlertCircleIcon,
  Box,
  Button,
  ButtonText,
  Card,
  colors,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  KeyboardAvoidingView,
  ScrollView,
  Select,
  SelectIcon,
  SelectInput,
  SelectTrigger,
  Switch,
  Text,
  Textarea,
  TextareaInput,
  VStack,
} from '@/components/ui';
import { translate } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';
import { type ILocation } from '@/types';

import { SheetLoctions } from './sheet-location';

const schema = z.object({
  name: z.string().refine((val) => !isEmpty(val), {
    message: translate('delivery_address.recipient_name_required'),
  }),
  phone: z
    .string()
    .refine((val) => !isEmpty(val), {
      message: translate('delivery_address.phone_number_required'),
    })
    .refine((val) => isMobilePhone(val, 'vi-VN'), {
      message: translate('delivery_address.phone_number_invalid_format'),
    }),
  province: z
    .object({
      sourceId: z.string().refine((val) => !isEmpty(val), {
        message: translate('delivery_address.province_required'),
      }),
      sourceName: z.string(),
    })
    .partial()
    .required({ sourceId: true }),
  district: z
    .object({
      sourceId: z.string().refine((val) => !isEmpty(val), {
        message: translate('delivery_address.district_required'),
      }),
      sourceName: z.string(),
    })
    .partial()
    .required({ sourceId: true }),
  ward: z
    .object({
      sourceId: z.string().refine((val) => !isEmpty(val), {
        message: translate('delivery_address.ward_required'),
      }),
      sourceName: z.string(),
    })
    .partial()
    .required({ sourceId: true }),
  address: z.string().refine((val) => !isEmpty(val), {
    message: translate('delivery_address.address_detail_required'),
  }),
  is_default: z.boolean(),
});

export type FormType = z.infer<typeof schema>;

export type FormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export const DeliveryAddressForm = ({ onSubmit = () => {} }: FormProps) => {
  const {
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      name: '',
      phone: '',
      province: { sourceId: '' },
      district: { sourceId: '' },
      ward: { sourceId: '' },
      address: '',
      is_default: false,
    },
    resolver: zodResolver(schema),
  });

  const customerInfo = getUserInfo();

  const province = watch('province') as ILocation;
  const district = watch('district') as ILocation;
  const ward = watch('ward') as ILocation;
  const isDefault = watch('is_default') as boolean;

  const [typeId, setTypeId] = useState<string | null>('1');
  const [showActionsheet, setShowActionsheet] = useState<boolean>(false);
  const handleClose = useCallback(() => setShowActionsheet(false), []);
  const handleOpenSheet = useCallback((_typeId: string) => {
    setTypeId(_typeId);
    setShowActionsheet(true);
  }, []);

  const handleOptionSelect = useCallback(
    (_typeId: string, loc: ILocation) => {
      if (_typeId === '1') {
        if (province?.sourceId !== loc?.sourceId) {
          setValue('district', { sourceId: '' });
          setValue('ward', { sourceId: '' });
        }
        setValue('province', loc, { shouldValidate: true });
      }
      if (_typeId === '2') {
        if (district?.sourceId !== loc?.sourceId) {
          setValue('ward', { sourceId: '' });
        }
        setValue('district', loc, { shouldValidate: true });
      }
      if (_typeId === '3') setValue('ward', loc, { shouldValidate: true });
      handleClose();
    },
    [handleClose, setValue, province, district]
  );

  useEffect(() => {
    if (customerInfo?.profile?.fullName) {
      setValue('name', customerInfo?.profile?.fullName);
    }
    if (customerInfo?.profile?.mobilePhone) {
      setValue('phone', customerInfo?.profile?.mobilePhone);
    }
  }, [customerInfo, setValue]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}
      className="flex-1 px-4"
    >
      <ScrollView className="flex-1">
        <VStack space="md">
          <Text className="px-2">
            {translate('delivery_address.recipient_info')}
          </Text>
          <Card>
            <VStack space="md">
              <FormControl
                isInvalid={!!errors?.name?.message}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
              >
                <Input>
                  <InputSlot className="pl-3">
                    <InputIcon as={BookUserIcon} />
                  </InputSlot>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur } }) => (
                      <InputField
                        placeholder={translate(
                          'delivery_address.recipient_name'
                        )}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    )}
                    name="name"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors?.name?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={!!errors?.phone?.message}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
              >
                <Input>
                  <InputSlot className="pl-3">
                    <InputIcon as={PhoneIcon} />
                  </InputSlot>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur } }) => (
                      <InputField
                        placeholder={translate('delivery_address.mobile_phone')}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    )}
                    name="phone"
                  />
                </Input>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors?.phone?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          </Card>

          <Text className="px-2">
            {translate('delivery_address.address_info')}
          </Text>
          <Card>
            <VStack space="md">
              <FormControl
                isInvalid={!!errors?.province?.sourceId?.message}
                size="md"
                isDisabled={false}
                isReadOnly={true}
                isRequired={false}
              >
                <Select>
                  <SelectTrigger
                    variant="outline"
                    size="md"
                    className="flex-row justify-between"
                    onPress={() => handleOpenSheet('1')}
                  >
                    <SelectInput
                      placeholder={translate(
                        'delivery_address.province_select'
                      )}
                      value={province?.sourceName || ''}
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                </Select>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors?.province?.sourceId?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={!!errors?.district?.sourceId?.message}
                size="md"
                isDisabled={false}
                isReadOnly={true}
                isRequired={false}
              >
                <Select>
                  <SelectTrigger
                    variant="outline"
                    size="md"
                    className="flex-row justify-between"
                    onPress={() => handleOpenSheet('2')}
                  >
                    <SelectInput
                      placeholder={translate(
                        'delivery_address.district_select'
                      )}
                      value={district?.sourceName || ''}
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                </Select>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors?.district?.sourceId?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={!!errors?.ward?.sourceId?.message}
                size="md"
                isDisabled={false}
                isReadOnly={true}
                isRequired={false}
              >
                <Select>
                  <SelectTrigger
                    variant="outline"
                    size="md"
                    className="flex-row justify-between"
                    onPress={() => handleOpenSheet('3')}
                  >
                    <SelectInput
                      placeholder={translate('delivery_address.ward_select')}
                      value={ward?.sourceName || ''}
                    />
                    <SelectIcon className="mr-3" as={ChevronDownIcon} />
                  </SelectTrigger>
                </Select>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors?.ward?.sourceId?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl
                isInvalid={!!errors?.address?.message}
                size="md"
                isDisabled={false}
                isReadOnly={false}
                isRequired={false}
              >
                <Textarea>
                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur } }) => (
                      <TextareaInput
                        placeholder={translate(
                          'delivery_address.address_detail'
                        )}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(value)}
                      />
                    )}
                    name="address"
                  />
                </Textarea>
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>
                    {errors?.address?.message}
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </VStack>
          </Card>

          <Card>
            <Box className="flex-row items-center justify-between">
              <Text>
                {translate('delivery_address.set_as_the_default_address')}
              </Text>
              <Switch
                size="md"
                value={isDefault}
                isDisabled={false}
                trackColor={{
                  false: colors.neutral[300],
                  true: colors.neutral[600],
                }}
                thumbColor={colors.neutral[50]}
                // activeThumbColor={colors.neutral[50]}
                ios_backgroundColor={colors.neutral[300]}
                onToggle={() => setValue('is_default', !isDefault)}
              />
            </Box>
          </Card>

          <SheetLoctions
            isOpen={showActionsheet}
            handleClose={handleClose}
            province={province}
            district={district}
            ward={ward}
            typeId={typeId}
            handleSelect={handleOptionSelect}
          />
        </VStack>
      </ScrollView>

      <Button
        size="md"
        onPress={handleSubmit(onSubmit)}
        variant="solid"
        action="primary"
      >
        <ButtonText>{translate('delivery_address.add_address')}</ButtonText>
      </Button>
    </KeyboardAvoidingView>
  );
};
