import { isEmpty as _isEmpty } from 'lodash';
import moment from 'moment';
import { Linking } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

import {
  type LocationType,
  type PaymentMethodType,
  type ShippingMethodType,
  type Tax,
} from '@/types';

import { DATE_FORMAT } from './constants';

export const openLinkInBrowser = (url: string) => {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export const formatPriceVND = (price?: number | string) => {
  try {
    if (!price) {
      return '0đ';
    }

    price = parseInt(price.toString());

    if (!price || price <= 0) {
      return '0đ';
    }

    return `${price.toLocaleString('vi-VN')}đ`;
  } catch (error) {
    return '0đ';
  }
};

export const getVAT = (exportTax?: Tax) =>
  Number(exportTax?.code?.match(/\d+/)?.[0]);

export const getPriceIncludeVAT = (vat: number = 0, price: number = 0) =>
  Math.round(price + price * (vat / 100));

export const formatDataLocation = (locations?: LocationType[]) => {
  return locations?.map((item) => ({
    label: item.sourceName,
    value: item.sourceId,
  }));
};

enum VATCodeEnums {
  OPVAT_0 = 'OPVAT-0',
  OPVAT_5 = 'OPVAT-5',
  OPVAT_10 = 'OPVAT-10',
  OPVAT_15 = 'OPVAT-15',
  OPVAT_KCT = 'OPVAT-KCT',
  OPVAT_8 = 'OPVAT-8',
}

export const formatDataVATPrice = (codeVAT: string) => {
  switch (codeVAT) {
    case VATCodeEnums.OPVAT_5:
      return 5;
    case VATCodeEnums.OPVAT_8:
      return 8;
    case VATCodeEnums.OPVAT_10:
      return 10;
    case VATCodeEnums.OPVAT_15:
      return 15;
    default:
      return 0;
  }
};

export const formatDataPaymentMethod = (
  options: PaymentMethodType[],
  value: string
) => {
  const foundObject = options.find((item) => item.code === value);
  return foundObject ? foundObject.value : null;
};

export const formatDataShippingMethod = (
  options: ShippingMethodType[],
  value: string
) => {
  const foundObject = options.find((item) => item.code === value);
  return foundObject ? foundObject : null;
};

export const formatDate = (
  date: Date | moment.Moment | string,
  format = DATE_FORMAT.INPUT
) => {
  if (_isEmpty(date)) return undefined;
  if (moment.isMoment(date)) {
    if (date.isValid()) {
      return date.format(format);
    }
    return undefined;
  }
  if (moment.isDate(date)) {
    return moment(date).format(format);
  }
  if (typeof date === 'string') {
    const dateObj = moment(date, format);
    if (dateObj.isValid()) {
      return dateObj.format(format);
    }
  }
  return date;
};

export const formatDateV2 = ({
  date,
  formatInput = DATE_FORMAT.INPUT,
  formatOutput = DATE_FORMAT.INPUT,
}: {
  date: string;
  formatInput?: string;
  formatOutput?: string;
}) => {
  if (!date) return undefined;
  if (moment.isMoment(date)) {
    return date.isValid() ? date.format(formatOutput) : 'Invalid Date';
  }
  if (moment.isDate(date)) {
    return moment(date).format(formatOutput);
  }
  if (typeof date === 'string') {
    const dateObj = date?.includes('/')
      ? moment(date, DATE_FORMAT.SHORT)
      : moment(date, formatInput);

    return dateObj.isValid() ? dateObj.format(formatOutput) : 'Invalid Date';
  }
  return date;
};

export const viSlugify = (str: string) => {
  const a =
    'àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;';
  const b =
    'aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------';
  const p = new RegExp(a.split('').join('|'), 'g');
  return str
    .toLowerCase()
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/\s+/g, '-')
    .replace(p, (c) => b.charAt(a.indexOf(c)))
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const transformDataCustomerType = (isPkt?: boolean) => {
  return isPkt ? 2 : 1;
};
