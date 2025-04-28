import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { getPriceIncludeVAT, getVAT, transformDataCustomerType } from '@/lib';
import { getUserInfo } from '@/lib/auth/utils';
import { type ProductDetail, type ProductSearch } from '@/types';

import { client } from '../common';

type SearchListVariables = {
  limit: number;
  searchQuery: string;
  filters?: Record<string, string>;
};

type SearchListResponse = {
  skipCount: number;
  maxResultCount: number;
  totalCount: number;
  items: ProductSearch[];
};

export const useSearchProducts = (variables: SearchListVariables) => {
  return useInfiniteQuery({
    queryKey: ['products.search', variables],
    queryFn: async ({ pageParam = 0, queryKey = [] }) => {
      const [_, searchParams] = queryKey;
      const { limit, searchQuery } = searchParams as {
        limit: number;
        searchQuery: string;
      };
      const customerInfo = getUserInfo();

      return await client
        .post<SearchListResponse>('/nt-app-bacsi/products/search/list-v2', {
          skipCount: pageParam,
          maxResultCount: limit,
          searchQuery: searchQuery,
          customerType:
            transformDataCustomerType(customerInfo?.profile?.isPkt) || null,
        })
        .then((resp) => {
          const items = resp.data.items?.map((product) => {
            const vat = getVAT(product?.exportTax);
            const priceIncludeVAT = getPriceIncludeVAT(
              vat,
              product?.price?.price
            );
            return {
              ...product,
              priceIncludeVAT: priceIncludeVAT,
              isColdStorage: product?.isColdStorage ?? false,
              isExpireDateControl: product?.isExpireDateControl ?? false,
              isQuotaLimit: product?.isQuotaLimit ?? false,
              isSpecialControl: product?.specialControls?.[0] ? true : false,
            };
          });
          return { ...resp.data, items: items };
        })
        .catch(() => {
          return { items: [], totalCount: 0, skipCount: 0, maxResultCount: 0 };
        });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const limit = lastPage.maxResultCount;
      const skip = lastPage.skipCount;
      const nextSkip = skip + limit;

      return nextSkip < lastPage.totalCount ? nextSkip : undefined;
    },
    gcTime: 30000,
    // enabled: !!variables.searchQuery,
  });
};

export const useProductSlug = (slug: string) => {
  return useQuery({
    queryKey: ['product.detail', slug],
    queryFn: async () => {
      return await client
        .get<ProductDetail>(`/nt-app-bacsi/products/detail/slug`, {
          params: { slug },
        })
        .then((resp) => {
          const vat = getVAT(resp.data?.exportTax);
          const priceIncludeVAT = getPriceIncludeVAT(
            vat,
            resp.data?.price?.price
          );

          return {
            ...resp.data,
            isColdStorage: resp.data?.isColdStorage ?? false,
            isExpireDateControl: resp.data?.isExpireDateControl ?? false,
            isQuotaLimit: resp.data?.isQuotaLimit ?? false,
            isSpecialControl: resp.data?.specialControls?.[0] ? true : false,
            priceIncludeVAT: priceIncludeVAT,
          };
        });
    },
    gcTime: 30000,
  });
};

type PromotionProductRequestDto = {
  itemCode: string;
  unitCode: number;
  unitName: string;
  quantity: number;
  whsType: string;
  price: number;
};

type PromotionProductsRequestDto = {
  items: PromotionProductRequestDto[];
  channel: string;
  storeType: string;
  shopCode: string;
  businessType?: string;
  provinceCode: string;
  isVisitor: boolean;
};

export const useGetPromotionProducts = () => {
  const mutation = useMutation({
    mutationKey: ['promotion.products'],
    mutationFn: async (bodyData: PromotionProductsRequestDto) => {
      return await client
        .post('/nt-app-bacsi/products/promotion/discount', {
          ...bodyData,
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (res) => {
      return res.data;
    },
    onError: (res) => {
      return res;
    },
  });

  return mutation;
};

type PromotionSuggestRequestDto = {
  item: PromotionProductRequestDto;
  channel: string;
  storeType: string;
  shopCode: string;
  businessType?: string;
  provinceCode: string;
  isVisitor: boolean;
};

export const useGetPromotionSuggest = () => {
  const mutation = useMutation({
    mutationKey: ['promotion.suggest'],
    mutationFn: async (bodyData: PromotionSuggestRequestDto) => {
      return await client
        .post('/nt-app-bacsi/products/promotion/suggest', {
          ...bodyData,
        })
        .then((res) => {
          return res.data;
        });
    },
    onSuccess: (res) => {
      return res.data;
    },
    onError: (res) => {
      return res;
    },
  });

  return mutation;
};
