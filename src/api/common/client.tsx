import { Env } from '@env';
import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { log } from '@/lib';
import {
  clearSessionExpired,
  getToken,
  isAccessTokenExpired,
  isRefreshTokenExpired,
  requestRefreshToken,
} from '@/lib/auth/utils';

const client = axios.create({
  baseURL: Env.API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Do something before request is sent

    if (isAccessTokenExpired() && !isRefreshTokenExpired()) {
      // refresh token
      await requestRefreshToken();
    }

    const token = getToken();
    if (token?.accessToken) {
      config.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    log.error(error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
client.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status === 401) clearSessionExpired();
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error.status === 401) clearSessionExpired();
    log.error(error);

    return Promise.reject(error);
  }
);

export { client };
