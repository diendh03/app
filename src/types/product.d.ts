export {};

export type ProductSearch = {
  applyForChannel?: { name: string }[];
  brand: string;
  category: Category[];
  importTax: Tax;
  exportTax: Tax;
  image?: string;
  isColdStorage: boolean;
  isExpireDateControl: boolean;
  isQuotaLimit: boolean;
  isSpecialControl: boolean;
  name?: string;
  price: Price;
  priceIncludeVAT: number;
  sku: string;
  slug: string;
  specialControls?: { code: string; name: string }[];
  specification?: string;
  webName?: string;
  discount?: PromotionProduct;
};

type Category = {
  id: number;
  isActive: boolean;
  level: number;
  name: string;
  parentName: string;
  slug: string;
};

export type Tax = {
  id: number;
  code: string;
  value: string;
};

type Price = {
  id?: number;
  measureUnitCode?: number;
  measureUnitName: string;
  isSellDefault: boolean;
  price: number;
  currencySymbol: string;
  isDefault: boolean;
  inventory: number;
};

export type ProductDetail = {
  adverseEffect?: string;
  ageUse?: string[];
  applyForChannel?: { name: string }[];
  brand: string;
  careful?: string;
  categories: Category[];
  composition?: Composition[];
  contraindication?: string;
  dosage?: string;
  dosageForm?: string;
  exportTax: Tax;
  importTax: Tax;
  indications?: { name: string; slug?: string }[];
  ingredient?: { name: string; shortDescription?: string; slug?: string }[];
  isColdStorage: boolean;
  isExpireDateControl: boolean;
  isQuotaLimit: boolean;
  isSpecialControl: boolean;
  manufactor?: string;
  name?: string;
  objectUse?: string[];
  prescription?: boolean;
  preservation?: string;
  price: Price;
  priceIncludeVAT: number;
  primaryImage?: string;
  producer?: string;
  productType: string;
  referenceSource?: string;
  registNum?: string;
  secondaryImages?: string[];
  shortDescription?: string;
  shortName?: string;
  sku: string;
  slug: string;
  specialControls?: { code: string; name: string }[];
  specialFeatures?: string[];
  specification?: string;
  usage?: string;
  warrantyPeriod?: string;
  webIngredient?: string;
  webName?: string;
};

export type PromotionProduct = {
  discount: number;
  finalPrice: number;
  timeExpired: string | null;
  promotionCode: string | null;
  itemCode: string;
  promotionTagText: string;
};

export type PromotionProductsResponse = {
  businessType: string | null;
  channel: string;
  isVisitor: boolean | null;
  items: PromotionProduct[];
  provinceCode: string | null;
  shopCode: string;
  storeType: string;
};
