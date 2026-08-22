import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/state/auth.slice.js';

const store = configureStore({
  reducer: {
    authReducer,
  },
});

export default store;
