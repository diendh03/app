import { UNIT_NAME_2_CODE } from '@/lib/constants';
import { type CartState } from '@/store/cart-slice';
import {
  type ProductCart,
  type PromotionSuggestData,
  type UserAuth,
} from '@/types';

export const formatDataRequestCreateOrder = (
  data: CartState,
  customerInfo: UserAuth
) => {
  const { products, shippingAddress, paymentMethod, dsShippingMethod } = data;

  return {
    orderSource: 'APP_BACSI',
    customerId: customerInfo?.customerId,
    customerCode: customerInfo?.profile?.customerCode,
    customerName: customerInfo?.profile?.fullName,
    businessTypeName: customerInfo?.profile?.businessTypeName,
    customerPhoneNumber: customerInfo?.profile?.mobilePhone,
    customerTaxCode: customerInfo?.profile?.taxNumber,
    customerShipAddressId: shippingAddress?.id,
    customerShipAddressCode: '',
    customerShipAddress: shippingAddress?.fullAddress,
    detailAddress: shippingAddress?.address,
    wardId: shippingAddress?.wardCode,
    wardName: shippingAddress?.wardName,
    districtId: shippingAddress?.districtCode,
    districtName: shippingAddress?.districtName,
    provinceId: shippingAddress?.provinceCode,
    provinceName: shippingAddress?.provinceName,
    customerBillAddressId: '',
    customerContactName: shippingAddress?.name,
    customerContactPhone: shippingAddress?.mobilePhone,
    paymentMethod: paymentMethod,
    dsShippingMethod: dsShippingMethod.code,
    orderLines: products.map((product) => ({
      productCode: product.sku,
      name: product.name,
      status: 'ACTIVE',
      unit: product.price?.measureUnitName,
      price:
        Number(product.discount?.discount) > 0
          ? product.discount?.finalPrice
          : product.price?.price,
      productType: 'NORMAL',
      quantity: product.quantity,
    })),
  };
};

export const transformDataRequestPromotionSuggest = (
  productCart: ProductCart,
  customerInfo: any,
  type?: 'dec' | 'inc' | 'text',
  text?: string
  // eslint-disable-next-line max-params
) => {
  const unitCode = UNIT_NAME_2_CODE.find(
    (unit) =>
      unit.name.toLowerCase() ===
      productCart.price?.measureUnitName.toLowerCase()
  );
  return {
    item: {
      itemCode: productCart.sku,
      unitCode: unitCode ? unitCode.id : 0,
      unitName: String(productCart.price?.measureUnitName),
      quantity:
        type === 'text'
          ? Number(text)
          : productCart.quantity + (type === 'inc' ? 1 : -1),
      whsType: '010',
      price: Number(productCart.price?.price),
    },
    channel: 'WebNhapThuoc',
    storeType: 'NhapThuoc',
    shopCode: '',
    provinceCode: customerInfo?.profile?.provinceCode || '',
    isVisitor: customerInfo?.profile?.isVisitor || false,
    businessType: customerInfo?.profile?.businessType || '',
  };
};

export const transformDataResponsePromotionSuggest = (
  data: PromotionSuggestData
) => {
  const promotion = data?.displayAreas?.[0]?.promotions?.[0].discounts?.[0];
  return {
    discount: promotion?.discountPrice ? promotion.discountPrice : 0,
    finalPrice: promotion?.finalPrice,
    timeExpired: data?.displayAreas?.[0]?.promotions?.[0].toDate,
    promotionCode: data?.displayAreas?.[0]?.promotions?.[0].promotionCode,
    itemCode: promotion?.itemCode,
    promotionTagText: data?.displayAreas?.[0]?.promotions?.[0].promotionTagText,
  };
};
