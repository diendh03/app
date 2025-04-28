import { ImageBackground } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={20}
      >
        <ImageBackground
          source={require('@/assets/images/png/login_bg.png')}
          resizeMode="cover"
          className="flex-1"
        >
          {children}
        </ImageBackground>
      </KeyboardAvoidingView>
    </>
  );
}
