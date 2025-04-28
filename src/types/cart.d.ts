import { type ProductSearch } from './product';

export {};

export type ProductOrder = {
  productCode: string;
  image: string;
  name: string;
  status: string;
  unit: string;
  price: number;
  productType: string;
};

export type ProductCart = ProductSearch & {
  quantity: number;
  availQty: number;
};

export type CustomerCart = any & {
  paymentMethod?: string;
  dsShippingMethod?: string;
  orderSource?: string;
};
