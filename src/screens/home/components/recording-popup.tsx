import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Modal, ModalBackdrop, ModalContent } from '@/components/ui';

const dotAnimations = Array.from({ length: 11 }).map(
  () => new Animated.Value(1)
);

type Props = {
  barColor?: string;
  visible: boolean;
  onClose?: () => void;
};

export const AnimatedSoundBars = ({
  barColor = 'gray',
  visible = true,
  onClose,
}: Props) => {
  const insets = useSafeAreaInsets();
  const loopAnimation = (node: any) => {
    const keyframes = [1.7, 0.5, 1];

    const loop = Animated.sequence(
      keyframes.map((toValue) =>
        Animated.timing(node, {
          toValue,
          easing: Easing.ease,
          useNativeDriver: true,
        })
      )
    );

    return loop;
  };

  const loadAnimation = (nodes: any) =>
    Animated.loop(Animated.stagger(200, nodes.map(loopAnimation))).start();

  React.useEffect(() => {
    loadAnimation(dotAnimations);
  }, [visible]);

  return (
    <>
      <Modal
        className="justify-end"
        isOpen={visible}
        onClose={onClose}
        size="md"
      >
        <ModalBackdrop className="bg-black" />

        <ModalContent
          className="h-[30px] w-[100px] justify-center rounded-full border-0 p-1"
          style={[{ marginBottom: insets.bottom + 5 }]}
        >
          <View className="w-[90px] flex-row p-1 ">
            {dotAnimations.map((animation, index) => {
              return (
                <Animated.View
                  key={`${index}`}
                  className="mx-[2px] h-[10px] w-[4px] rounded-[2px]"
                  style={[
                    { backgroundColor: barColor },
                    {
                      transform: [
                        {
                          scale: animation,
                        },
                      ],
                    },
                  ]}
                />
              );
            })}
          </View>
        </ModalContent>
      </Modal>
    </>
  );
};
