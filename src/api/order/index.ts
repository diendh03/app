import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { client } from '@/api';
import { getUserInfo } from '@/lib/auth/utils';
import { type DetailOrder, type HistoryOrderResponse } from '@/types/order';

export const useCreateOrderPharma = () => {
  const mutation = useMutation({
    mutationKey: ['create.order'],
    mutationFn: async (bodyData: any) => {
      return await client
        .post('/nt-app-bacsi/order/create-order', {
          ...bodyData,
        })
        .then((res) => {
          return res;
        });
    },
    onSuccess: (res) => {
      return res;
    },
    onError: (res) => {
      return res;
    },
  });

  return mutation;
};
type SearchListOrder = {
  limit: number;
  search: string;
  tabCode?: string;
};

export const useGetListHistoryOrder = (variables: SearchListOrder) => {
  return useInfiniteQuery({
    queryKey: ['get.listHistoryOrder', variables],
    queryFn: async ({ pageParam = 0 }) => {
      const userInfo = getUserInfo();
      return await client
        .get<HistoryOrderResponse>(`/nt-app-bacsi/order/history/filter`, {
          params: {
            maxResultCount: variables.limit,
            skipCount: pageParam,
            tabCode: Number(variables?.tabCode) || 0,
            customerCode: userInfo?.profile?.customerCode,
            search: variables.search,
          },
        })
        .then((res) => {
          return res.data;
        })
        .catch(() => {
          return {
            orders: [],
            totalCount: 0,
            skipCount: 0,
            maxResultCount: 0,
            tabCode: 0,
            tabName: '',
          };
        });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const limit = lastPage.maxResultCount;
      const skip = lastPage.skipCount;
      const nextSkip = skip + limit;

      return nextSkip < lastPage.totalCount ? nextSkip : undefined;
    },
    gcTime: 5000,
  });
};

export const useGetDetailOrder = (orderNo: string) => {
  return useQuery({
    queryKey: ['get.detailOrder', orderNo],
    queryFn: async () => {
      return await client
        .get<DetailOrder>(`/nt-app-bacsi/order/${orderNo}`)
        .then((res) => {
          return res.data;
        });
    },
  });
};

type BodyDataCancelOrder = {
  orderNo: string;
  reason: string;
};

export const useCancelOrder = () => {
  const mutation = useMutation({
    mutationKey: ['cancel.order'],
    mutationFn: async (bodyData: BodyDataCancelOrder) => {
      return await client
        .post('/nt-app-bacsi/order/cancel', {
          ...bodyData,
        })
        .then((res) => {
          return res;
        });
    },
    onSuccess: (res) => {
      return res;
    },
    onError: (res) => {
      return res;
    },
  });

  return mutation;
};
