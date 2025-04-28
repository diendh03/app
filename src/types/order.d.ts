export {};

export type HistoryOrderResponse = {
  orders: Order[];
  tabCode: number;
  tabName: string;
  totalCount: number;
  skipCount: number;
  maxResultCount: number;
};

export type Order = {
  orderId: string;
  orderCode: string;
  orderCodeDisplay: string;
  allowReOrder: boolean;
  canCancel: boolean;
  canRebuy: boolean;
  delivery: Delivery;
  isRepayment: boolean;
  notes: string | null;
  orderDate: string;
  orderInformation: OrderInformation;
  orderName: string;
  orderPrice: OrderPrice;
  orderProducts: OrderProduct[];
  orderSplit: any;
  shipment: Shipment;
  status: Status;
  totalProduct: number;
};

type Delivery = {
  estimatedDeliveryDate: string;
};

type OrderInformation = {
  customerName: string;
  phoneNumber: string;
  customerReceiverName?: string;
  customerReceiverPhone?: string;
  einvoice?: string;
  fsellPoint?: number;
  gender?: string;
  intendTime?: string;
  paymentMethodDefault?: number[];
  paymentStatus?: number;
  paymentStatusLabel?: string;
  planning?: any[];
  receiverAddress?: string;
  receiverFullAddress?: string;
  shopCode?: string;
};

type OrderPrice = {
  totalPrice: number;
  promotion: number;
  deliveryFee: number;
  finalPrice: number;
};

type OrderProduct = {
  sku: string;
  quantity: number;
  title: string;
  total: number;
  discount?: number;
  discountPromotion?: number;
  image?: string;
  price?: number;
  priceAfterDiscount?: number;
  totalAfterDiscount?: number;
  unit?: number;
  unitLabel?: string;
  url?: string;
};

type Shipment = {
  statusShipment: string;
  shipmentMethod: number;
  isShowTimeline: boolean;
  timeline: any[];
};

type Status = {
  code: number;
  statusLabel: string;
};

export type DetailOrder = {
  allowReOrder: boolean;
  canCancel: boolean;
  canRebuy: boolean;
  delivery: Delivery;
  isRepayment: boolean;
  notes: string | null;
  orderCode: string;
  orderCodeDisplay: string;
  orderDate: string;
  orderId: string;
  orderInformation: OrderInformation;
  orderName: string;
  orderPrice: OrderPrice;
  orderProducts: OrderProduct[];
  orderSplit: any;
  shipment: Shipment;
  status: Status;
  totalProduct: number;
};
