export {};

export type Installment = {
  creditCard: boolean;
  financier: boolean;
  interestRateZeroPercent: boolean;
};

type Display = {
  displayArea: number;
  priority: number;
  urlImage: string;
  urlPage: string;
  nameOnline: string | null;
  description: string;
  allowShowOnline: boolean;
};

type Discount = {
  itemCode: string;
  unitCode: number;
  discountQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  price: number;
  finalPrice: number;
  discountPrice: number;
  totalAmount: number;
  totalFinalAmount: number;
  totalDiscountAmount: number;
  maxDiscountAmount: number;
  whsType: string;
};

type Promotion = {
  promotionCode: string;
  promotionName: string;
  promotionDisplayName: string;
  promotionTagText: string;
  promotionType: string;
  programType: string;
  fromDate: string;
  toDate: string;
  fromHour: string;
  toHour: string;
  display: Display;
  matching: boolean;
  installment: Installment;
  verifyScheme: any;
  excluded: any[];
  discounts?: Discount[];
  paymentMethods: any[];
  buyMoreItems: any[];
  discountOutputConfigs: any[];
};

type DisplayArea = {
  DisplayArea: number;
  Promotions: Promotion[];
  promotions: Promotion[];
  displayArea: number;
};

type Item = {
  itemCode: string;
  unitCode: number;
  quantity: number;
  price: number;
  whsType: string;
};

export type PromotionSuggestData = {
  storeType: string;
  channel: string;
  shopCode: string;
  item: Item;
  displayAreas: DisplayArea[];
};
