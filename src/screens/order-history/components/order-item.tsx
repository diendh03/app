import { Link } from 'expo-router';
import React from 'react';

import { colors, HStack, Pressable, Text, VStack } from '@/components/ui';
import { formatDateV2, formatPriceVND } from '@/lib';
import { DATE_FORMAT } from '@/lib/constants';
import { type Order } from '@/types/order';

interface OrderItemProps {
  order: Order;
}

const OrderItem = (props: OrderItemProps) => {
  const { order } = props;

  return (
    <Link href={`/order/${order?.orderCode}`} asChild>
      <Pressable className="m-2 flex-1 rounded-lg border border-gray-300 bg-background-0 px-2 py-4">
        <HStack space="lg">
          <VStack className="flex-1">
            <HStack className="justify-between">
              <HStack>
                <Text>Mã -</Text>

                <Text className="ml-1 font-bold">{order.orderCode}</Text>
              </HStack>

              <Text
                style={{
                  borderColor: colors.danger[300],
                  backgroundColor: colors.danger[50],
                }}
                className="rounded-full border-2 p-1 px-2 font-medium text-red-500"
              >
                {order.status.statusLabel}
              </Text>
            </HStack>

            <HStack>
              <Text size="sm" className="">
                Ngày tạo đơn:{' '}
                {formatDateV2({
                  date: order?.orderDate,
                  formatInput: DATE_FORMAT.INPUT,
                  formatOutput: DATE_FORMAT.ID4,
                })}
              </Text>
            </HStack>

            <Text className="mt-1 font-medium text-red-500">
              Tổng giá trị hóa đơn:{' '}
              {formatPriceVND(order?.orderPrice?.finalPrice)}
            </Text>
          </VStack>
        </HStack>
      </Pressable>
    </Link>
  );
};

export default OrderItem;
