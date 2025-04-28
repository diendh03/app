import { ChevronRightIcon } from 'lucide-react-native';
import React from 'react';
import { type ViewProps } from 'react-native';

import {
  Box,
  Card,
  Heading,
  HStack,
  Icon,
  Pressable,
  VStack,
} from '@/components/ui';
import { translate, type TxKeyPath } from '@/lib';

type Props = ViewProps & {
  text: TxKeyPath;
  value?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  icon?: React.ElementType;
  isLoaded?: boolean;
};

export const CustomerCard = ({
  text,
  icon,
  children,
  onPress,
  isLoaded = false,
  className,
}: Props) => {
  const isPressable = onPress !== undefined;
  return (
    <Card
      size="md"
      variant="outline"
      className={` bg-background-0 ${className}`}
    >
      <Pressable
        onPress={onPress}
        pointerEvents={isPressable ? 'auto' : 'none'}
      >
        <Box className="flex-row items-center justify-between">
          <HStack className="items-center">
            <Icon as={icon} size="md" className="mr-2" />

            <Heading className="">{translate(text)}</Heading>
          </HStack>

          {isPressable && isLoaded && <Icon as={ChevronRightIcon} size="sm" />}
        </Box>
        <VStack className="mt-1" space="sm">
          {children}
        </VStack>
      </Pressable>
    </Card>
  );
};
