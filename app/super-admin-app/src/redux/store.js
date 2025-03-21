import rootReducer from './slices';
import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {tokenErrorToast} from './BaseQuery';
import {generalApi} from '../services/generalApi';

const persistConfig = {
  key: 'cms-super-admin',
  storage: AsyncStorage,
  whitelist: ['getDarkMode', 'auth', 'tokenAuth', 'getLanguage'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([tokenErrorToast, generalApi.middleware]),
});

export const persistor = persistStore(store);
