import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import screenReducer from './slice/screenSlice';
import userReducer from './slice/userSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userData'],
};

const rootReducer = combineReducers({
  userData: userReducer,
  screen: screenReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
});
const persister = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export { store, persister };
