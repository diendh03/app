// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { hydrateAuth, loadSelectedTheme } from '@/lib';
import { useThemeConfig } from '@/lib/use-theme-config';

export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.hideAsync();

const Providers = ({ children }: { children: React.ReactNode }) => {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
      className={theme.dark ? 'dark' : undefined}
    >
      <KeyboardProvider
        statusBarTranslucent={true}
        navigationBarTranslucent={true}
      >
        <ThemeProvider value={theme}>
          <GluestackUIProvider mode={theme.dark ? 'dark' : 'light'}>
            <APIProvider>
              <BottomSheetModalProvider>
                {children}
                <FlashMessage position="top" />
              </BottomSheetModalProvider>
            </APIProvider>
          </GluestackUIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
};

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen
          name="(app)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/verify-otp" options={{ headerShown: false }} />
        <Stack.Screen
          name="auth/verify-password"
          options={{ headerShown: false }}
        />
      </Stack>
    </Providers>
  );
}
