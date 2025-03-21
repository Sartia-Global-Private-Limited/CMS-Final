import rootReducer from './slices';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generalApi } from '../services/generalapi';
import { tokenErrorToast } from '../../config';

const persistConfig = {
  key: 'cms-super-admin',
  storage: AsyncStorage,
  whitelist: ['getDarkMode', 'auth', 'tokenAuth', 'getLanguage'], //reducer to persist
  // blacklist: ['tokenAuth'], //reducer not to persist
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
