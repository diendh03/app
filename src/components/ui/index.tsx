import { Image as NImage } from 'expo-image';
import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

// export * from './button';
// export * from './checkbox';
// export { default as colors } from './colors';
// export * from './focus-aware-status-bar';
// export * from './input';
// export * from './list';
// export * from './modal';
// export * from './progress-bar';
// export * from './select';
// export * from './text';
// export * from './utils';

// export * from './access-control';
export * from './accordion';
export * from './actionsheet';
export * from './alert';
export * from './alert-dialog';
export * from './avatar';
export * from './badge';
export * from './box';
export * from './button';
export * from './card';
export * from './center';
export * from './checkbox';
export { default as colors } from './colors';
export * from './divider';
export * from './drawer';
export * from './fab';
export * from './focus-aware-status-bar';
export * from './form-control';
export * from './gluestack-ui-provider';
export * from './heading';
export * from './hstack';
export * from './icon';
export * from './image';
export * from './input';
export * from './link';
export * from './menu';
export * from './modal';
export * from './popover';
export * from './portal';
export * from './pressable';
export * from './progress';
export * from './radio';
export * from './select';
export * from './skeleton';
export * from './slider';
export * from './spinner';
export * from './switch';
export * from './table';
export * from './text';
export * from './textarea';
export * from './toast';
export * from './tooltip';
export * from './utils';
export * from './vstack';

// export base components from react-native
export {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { KeyboardAvoidingView } from 'react-native-keyboard-controller';
export { SafeAreaView } from 'react-native-safe-area-context';

export const preloadImages = (sources: string[]) => {
  NImage.prefetch(sources);
};

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
