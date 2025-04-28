export {};

export type TokenType = {
  accessToken: string;
  refreshToken: string;
  accessExpiresIn: number;
  refreshExpiresIn: number;
};

export type LocationType = {
  parentId: string;
  parentSourceTypeId: string;
  sourceId: string;
  sourceName: string;
};

export type UserAuth = {
  customerId: number;
  profile: {
    businessType: number;
    businessTypeName: string;
    customerCode: string;
    customerOracleCode: string;
    customerType: number;
    customerTypeName: string;
    email?: string;
    fullName?: string;
    genderName?: string;
    isActive: boolean;
    isAgreeProtectionTerms: boolean;
    isPkt: boolean;
    mobilePhone: string;
    profileImage?: string;
    status: string;
    taxNumber: string;
    referralCode: string;
    specialControl?: SpecialControl[];
    representer: string;
    customerAddress: string;
    wardCode: string;
    wardName: string;
    districtCode: string;
    districtName: string;
    provinceCode: string;
    provinceName: string;
  };
};

interface SpecialControl {
  customerId: number;
  effective: boolean;
  id: number;
  specialControlId: number;
  specialControlName: string;
}

export type PaymentMethodType = {
  id: number;
  code: string;
  value: string;
};

export type ShippingMethodType = {
  id: number;
  code: string;
  value: string;
  description: string;
  price: number;
};

export interface Address {
  address?: string;
  addressType?: string;
  creationTime?: string;
  customerId: number;
  districtCode: string;
  districtName: string;
  fullAddress?: string;
  id: number;
  isPrimary: boolean;
  isValid?: boolean;
  lastModificationTime?: string;
  mobilePhone?: string;
  name?: string;
  note?: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
}

export interface ICustomerDeliveryAddress {
  customerCode: string;
  authorityFullName: string;
  authorityPhoneNumber: string;
  detailAddress: string;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  fullAddress: string;
  isPrimary: boolean;
}

export interface ILocation {
  parentId?: string;
  sourceId: string;
  sourceName?: string;
}
