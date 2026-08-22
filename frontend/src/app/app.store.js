import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice.js';
import dataReducer from '../features/shared/state/data.slice.js';

const store = configureStore({
  reducer: {
    authReducer,
    dataReducer,
  },
});

export default store;
