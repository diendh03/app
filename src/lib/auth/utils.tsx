import { Env } from '@env';
import axios from 'axios';
import { router } from 'expo-router';
import { Platform } from 'react-native';

import { BASE_AUTH } from '@/lib/constants';
import { getItem, removeItem, setItem } from '@/lib/storage';
import { type TokenType, type UserAuth } from '@/types';

export const getToken = () => getItem<TokenType>(BASE_AUTH.TOKEN);
export const removeToken = () => removeItem(BASE_AUTH.TOKEN);
export const setToken = (value: TokenType) =>
  setItem<TokenType>(BASE_AUTH.TOKEN, value);

export const getUserInfo = () => getItem<UserAuth>(BASE_AUTH.USER_INFO);
export const removeUserInfo = () => removeItem(BASE_AUTH.USER_INFO);
export const setUserInfo = (value: UserAuth) =>
  setItem<UserAuth>(BASE_AUTH.USER_INFO, value);

export const isAccessTokenExpired = () => {
  const token = getItem<TokenType>(BASE_AUTH.TOKEN);
  return !token || new Date().getTime() / 1000 > token.accessExpiresIn;
};

export const isRefreshTokenExpired = () => {
  const token = getItem<TokenType>(BASE_AUTH.TOKEN);
  return !token || new Date().getTime() / 1000 > token.refreshExpiresIn;
};

export const redirectToLogin = () =>
  router.replace({
    pathname: '/auth/login',
    params: {
      alert: 1,
    },
  });

export const clearSessionExpired = (loginRedirect: boolean = true) => {
  removeToken();
  removeUserInfo();
  if (loginRedirect) redirectToLogin();
};

export const handleSignInSuccess = async (token: {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}) => {
  const { accessToken, refreshToken, expiresIn, refreshExpiresIn } = token;

  const time = new Date().getTime();
  setToken({
    accessToken,
    accessExpiresIn: (time + expiresIn * 1000) / 1000,
    refreshToken,
    refreshExpiresIn: (time + refreshExpiresIn * 1000) / 1000,
  });

  await requestUserInfo({ accessToken });
};

export const requestRefreshToken = async () => {
  const token = getToken();

  await axios
    .post(
      BASE_AUTH.REFRESH_TOKEN_ENDPOINT,
      { refreshToken: token?.refreshToken },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(async (resp) => {
      if (resp.data?.accessToken) {
        await handleSignInSuccess(resp?.data);
      }
    })
    .catch(() => {
      clearSessionExpired();
    });
};

export const requestUserInfo = async ({
  accessToken,
}: {
  accessToken: string;
}) => {
  await axios
    .get(BASE_AUTH.USERINFO_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    })
    .then((resp) => {
      if (resp?.data?.customerId) {
        setUserInfo(resp?.data);
      }
    });
};

const getVersion = () => {
  return Env.VERSION;
};

export const checkNeedsUpdate = async () => {
  const currentVersion = getVersion();

  return await axios
    .post<{
      needsUpdate: boolean;
      updateType: string;
      notice: string;
      linkQR: string;
    }>(
      `${Env.API_URL}nt-app-bacsi/check-update`,
      { version: currentVersion, platform: Platform.OS },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then(async (resp) => resp.data)
    .catch(() => null);
};
