import { isRejectedWithValue } from '@reduxjs/toolkit';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from './store';
import { apiBaseUrl } from '../../config';

export const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders: async header => {
    const token = await AsyncStorage.getItem('cms-client-token');
    if (token) {
      header.set('Authorization', `Bearer ${token}`);
    }
    return header;
  },
});

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
    console.log('Message', action);
    store.dispatch(logout());
    AsyncStorage.removeItem('token');
  }
  return next(action);
};
