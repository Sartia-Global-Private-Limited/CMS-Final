// src/utils/axios.js

import axios from 'axios';
import {store} from '../redux/store';
import {setToken} from '../redux/slices/tokenAuthSlice';
import {apiBaseUrl} from '../../config';

const instance = axios.create({
  baseURL: apiBaseUrl,
  // your axios configuration
});

// Request interceptor
instance.interceptors.request.use(
  config => {
    const {token} = store.getState().tokenAuth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
instance.interceptors.response.use(
  response => {
    // handle successful responses
    return response;
  },
  error => {
    // handle errors
    return Promise.reject(error);
  },
);

export default instance;
