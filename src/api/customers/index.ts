import { Env } from '@env';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { handleSignInSuccess } from '@/lib/auth/utils';
import {
  type Address,
  type ICustomerDeliveryAddress,
  type ILocation,
} from '@/types';

import { client } from '../common';

const axiosClient = axios.create({
  baseURL: Env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useCheckPhoneNumberExists = (variables: {
  phoneNumber: string;
}) => {
  return useQuery<boolean>({
    queryKey: ['customer.search', variables],
    queryFn: async () =>
      await axiosClient
        .post('nt-app-bacsi/auth/check-phone-number-exists', {
          phoneNumber: variables.phoneNumber,
        })
        .then((resp) => resp.data),
    enabled: !!variables.phoneNumber,
    retry: false,
  });
};

export const useRequestOTP = () => {
  return useMutation({
    mutationFn: (variables: { phoneNumber: string; requestId: string }) =>
      axiosClient
        .post('nt-app-bacsi/auth/get-otp', {
          phoneNumber: variables.phoneNumber,
          requestId: variables.requestId,
        })
        .then((resp) => resp.data),
    onSuccess: () => {},
    onError: () => {},
    retry: false,
  });
};

export const useVerifyWithOTP = () => {
  return useMutation<any, AxiosError<any>, any>({
    mutationFn: (variables: {
      phoneNumber: string;
      otp: string;
      requestId: string;
    }) =>
      axiosClient
        .post('nt-app-bacsi/auth/verify-otp', {
          phoneNumber: variables.phoneNumber,
          otp: variables.otp,
          requestId: variables.requestId,
        })
        .then((resp) => resp.data),
    onSuccess: async (data) => {
      if (data?.accessToken) {
        await handleSignInSuccess(data);
      }
    },
    onError: () => {},
    retry: false,
  });
};

export const useVerifyWithPassword = () => {
  return useMutation<any, AxiosError<any>, any>({
    mutationFn: (variables: { username: string; password: string }) =>
      axiosClient
        .post('nt-app-bacsi/auth/login-with-pass', {
          username: variables.username,
          password: variables.password,
        })
        .then((resp) => resp.data),
    onSuccess: async (data) => {
      if (data?.accessToken) {
        await handleSignInSuccess(data);
      }
    },
    onError: () => {},
    retry: false,
  });
};

export const useGetListAddressV2 = (customerId?: number) => {
  return useQuery({
    queryKey: ['customer.address', customerId],
    queryFn: async () => {
      return await client
        .get<Address[]>(`/nt-app-bacsi/customers/${customerId}/address`)
        .then((res) => res.data);
    },
    enabled: !!customerId,
    retry: false,
  });
};

export const useCreateDeliveryAddress = () => {
  return useMutation({
    mutationFn: ({ customerCode, ...formData }: ICustomerDeliveryAddress) =>
      client
        .post(
          `/nt-app-bacsi/customers/shipping-address?customerCode=${customerCode}`,
          formData
        )
        .then((res) => res.data),
  });
};

type VarsLoc = {
  typeId: string | null;
  parentId: string | null;
};

type RespLoc = {
  totalCount: number;
  items: ILocation[];
};

export const useLocations = createQuery<RespLoc, VarsLoc, AxiosError>({
  queryKey: ['locations'],
  fetcher: async (variables) => {
    return await client
      .get('/nt-app-bacsi/customers/get-location', {
        params: {
          TypeId: variables.typeId,
          ParentId: variables.parentId,
        },
      })
      .then((resp) => resp.data);
  },
});
