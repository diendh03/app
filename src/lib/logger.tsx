import axios from 'axios';
import { Platform } from 'react-native';
import {
  consoleTransport,
  logger,
  type transportFunctionType,
} from 'react-native-logs';

import { type TokenType, type UserAuth } from '@/types';

import { BASE_AUTH } from './constants';
import { Env } from './env';
import { getItem } from './storage';

const apiTransport: transportFunctionType<{}> = async (props) => {
  try {
    const { level, msg } = props;
    const token = getItem<TokenType>(BASE_AUTH.TOKEN);
    const userInfo = getItem<UserAuth>(BASE_AUTH.USER_INFO);

    const data = {
      level: JSON.stringify(level),
      message: msg,
      meta: JSON.stringify({
        user: {
          name: userInfo?.profile.mobilePhone,
          email: userInfo?.profile.email,
        },
        os: Platform.OS,
        osVersion: Platform.Version,
      }),
    };

    if (token?.accessToken) {
      await axios.post(`${Env.API_URL}/nt-app-tdv/logs`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.accessToken}`,
        },
      });
    }
  } catch (error) {
    console.error('Failed to send log to API:', error);
  }
};

export const log = logger.createLogger({
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transport: __DEV__ ? consoleTransport : apiTransport,
  transportOptions: {
    colors: {
      info: 'blueBright',
      warn: 'yellowBright',
      error: 'redBright',
      debug: 'white',
    },
    extensionColors: {
      root: 'magenta',
      home: 'green',
    },
  },
});
