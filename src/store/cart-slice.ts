import { type StateCreator } from 'zustand';

import {
  type Address,
  type CustomerCart,
  type PaymentMethodType,
  type ProductCart,
  type ProductSearch,
  type ShippingMethodType,
} from '@/types';

export type CartState = {
  customerCart: CustomerCart | null;
  shippingAddress: Address | null;
  paymentMethod: string;
  dsShippingMethod: ShippingMethodType;
  products: ProductCart[];
  total: number;
  savingMoney: number;
};

type CartActions = {
  addProduct: (product: ProductSearch) => void;
  removeProduct: (sku: string) => void;
  updateProduct: (sku: string, promotion: any) => void;
  incQty: (sku: string) => void;
  decQty: (sku: string) => void;
  enteredQty: (sku: string, qty: number) => void;
  reset: () => void;
  setCustomerCart: (profile: CustomerCart) => void;
  setShippingAddress: (address: Address) => void;
  setTotal: (total: number) => void;
  setSavingMoney: (savingMoney: number) => void;
  setPaymentMethod: (method: PaymentMethodType) => void;
  setShippingMethod: (method: ShippingMethodType) => void;
};

export type CartSlice = CartState & CartActions;

const initialState: CartState = {
  customerCart: null,
  shippingAddress: null,
  paymentMethod: 'TM',
  dsShippingMethod: {
    id: 1,
    code: 'Đơn hàng giao bình thường',
    value: 'Giao hàng tiêu chuẩn',
    price: 19980,
    description:
      'Thời gian nhận hàng dự kiến sau khi đặt từ 1-4 ngày tùy thuộc tỉnh thành, không tính ngày lễ, nghỉ.',
  },
  products: [],
  total: 0,
  savingMoney: 0,
};

export const createCartSlice: StateCreator<
  CartSlice,
  [['zustand/immer', never]],
  [],
  CartSlice
> = (set) => ({
  ...initialState,
  incQty: (sku) =>
    set((state) => {
      const foundProduct = state.products.find(
        (product: ProductCart) => product.sku === sku,
      );
      if (foundProduct) {
        if (foundProduct.quantity < foundProduct.availQty) {
          foundProduct.quantity += 1;
        }
      }
    }),
  decQty: (sku) =>
    set((state) => {
      const foundIndex = state.products.findIndex(
        (product: ProductCart) => product.sku === sku,
      );

      if (foundIndex !== -1) {
        if (state.products[foundIndex].quantity === 1) {
          state.products.splice(foundIndex, 1);
        } else {
          state.products[foundIndex].quantity -= 1;
        }
      }
    }),
  enteredQty: (sku, qty) =>
    set((state) => {
      const foundIndex = state.products.findIndex(
        (product: ProductCart) => product.sku === sku,
      );
      if (foundIndex !== -1) {
        if (qty === 0) state.products.splice(foundIndex, 1);
        else {
          const newQty =
            qty > state.products[foundIndex].availQty
              ? state.products[foundIndex].availQty
              : qty;
          state.products[foundIndex].quantity = newQty;
        }
      }
    }),
  addProduct: (product) =>
    set((state) => {
      state.products.push({
        ...product,
        quantity: 1,
        availQty: Number(product.price?.inventory || 0),
      });
    }),
  removeProduct: (sku) =>
    set((state) => {
      state.products = state.products.filter(
        (product: ProductCart) => product.sku !== sku,
      );
    }),
  updateProduct: (sku, promotion) =>
    set((state) => {
      const newPro = state.products.find(
        (product: ProductCart) => product.sku === sku,
      );
      if (newPro) {
        newPro.discount = promotion;
      }
    }),

  reset: () => set(() => initialState),
  setCustomerCart: (profile) => {
    set((state) => {
      state.customerCart = {
        ...profile,
      };
    });
  },
  setShippingAddress: (address) => {
    set((state) => {
      state.shippingAddress = {
        ...address,
      };
    });
  },
  setTotal: (total) =>
    set((state) => {
      state.total = total;
    }),
  setSavingMoney: (save) =>
    set((state) => {
      state.savingMoney = save;
    }),

  setPaymentMethod: (method) => {
    set((state) => {
      state.paymentMethod = method.code;
    });
  },
  setShippingMethod: (method) => {
    set((state) => {
      state.dsShippingMethod = method;
    });
  },
});
