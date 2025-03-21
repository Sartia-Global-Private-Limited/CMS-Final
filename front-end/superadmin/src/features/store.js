import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./auth/authSlice";
import notiReducer from "./notifications/notificationSlice";
import msgReducer from "./messages/messagesSlice";

const persistConfig = {
  key: "cms-super-admin",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  notification: notiReducer,
  message: msgReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export let persistor = persistStore(store);
export default store;

// const store = configureStore({
//     // reducer: rootReducer,
// })

// export default store
