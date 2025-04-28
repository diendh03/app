import { useEffect, useState } from 'react';

import { Box, HStack, Text } from '@/components/ui';
import { translate, type TxKeyPath } from '@/lib';

type CountdownProps = {
  expiredDate: string;
};

const calculateTimeLeft = (expiredDate: string) => {
  const now = new Date().getTime();
  const destinationTime = new Date(expiredDate).getTime();

  const diff = destinationTime - now;
  if (diff <= 0)
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    .toString()
    .padStart(2, '0');
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
    .toString()
    .padStart(2, '0');

  return { days, hours, minutes, seconds };
};

const Countdown = (props: CountdownProps) => {
  const { expiredDate } = props;
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiredDate));
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(expiredDate));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="mt-1 flex-row rounded-xl bg-orange-100  p-1">
      {['days', 'hours', 'minutes', 'seconds'].map((unit, index) => (
        <HStack key={unit} className="flex-row items-center">
          {index > 0 && (
            <Text className="font-manrope mx-1 text-xs font-semibold text-orange-600">
              :
            </Text>
          )}
          <HStack className="flex-col items-center justify-center gap-x-1">
            <Text className="w-max text-center text-xs font-semibold text-orange-600">
              {timeLeft[unit as keyof typeof timeLeft]}
            </Text>
            <Text className="w-max items-center justify-center text-center text-xs  font-normal text-orange-600">
              {translate(`common.${unit}` as TxKeyPath)}
            </Text>
          </HStack>
        </HStack>
      ))}
    </Box>
  );
};

export default Countdown;
