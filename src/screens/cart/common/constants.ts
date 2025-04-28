export const listPaymentMethod = [
  {
    id: 1,
    code: 'TM',
    value: 'Tiền mặt',
  },
  {
    id: 2,
    code: 'CK',
    value: 'Chuyển khoản',
  },
];

export const listShippingMethod = [
  {
    id: 1,
    code: 'Đơn hàng giao bình thường',
    value: 'Giao hàng tiêu chuẩn',
    price: 19980,
    description:
      'Thời gian nhận hàng dự kiến sau khi đặt từ 1-4 ngày tùy thuộc tỉnh thành, không tính ngày lễ, nghỉ.',
  },
  {
    id: 2,
    code: 'Đơn hàng giao nhanh',
    value: 'Giao hàng siêu tốc',
    price: 29970,
    description:
      'Áp dụng cho đơn dưới 10 triệu và hàng bảo quản lạnh. Đặt hàng sau 14h, nhận vào trước 12h ngày hôm sau.',
  },
];
