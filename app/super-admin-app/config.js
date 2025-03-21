import axios from 'axios';
export const apiBaseUrl = 'http://api.cmsithub.com:8090';
// export const apiBaseUrl = 'http://apicms.thewingshield.com:8091';
// export const apiBaseUrl = 'http://192.168.1.26:8090';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout} from './src/redux/slices/authSlice';
import {store} from './src/redux/store';
import {isRejectedWithValue} from '@reduxjs/toolkit';
import Toast from 'react-native-toast-message';

const customApi = axios.create({
  baseURL: apiBaseUrl,
});

customApi.interceptors.request.use(async config => {  
  try {
    let token = await AsyncStorage.getItem('cms-sa-token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    // Handle AsyncStorage error
    console.log('error aaya', error);
  }
});

export {customApi};

export const tokenErrorToast = api => next => action => {
  if (isRejectedWithValue(action)) {
    Toast.show({
      type: 'error',
      text1: 'Authentication Error !!',
      text2:
        action.payload?.data?.message ||
        'Your session has expired, please login again...',
      position: 'bottom',
    });

    store.dispatch(logout());
    AsyncStorage.removeItem('cms-sa-token');
  }
  return next(action);
};
