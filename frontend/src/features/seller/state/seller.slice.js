import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  dashboard: null,
  profile: null,
  status: 'idle',
  error: null,
};

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {
    sellerRequestStarted: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    sellerRequestFailed: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    setSellerDashboard: (state, action) => {
      state.dashboard = action.payload;
      state.status = 'succeeded';
    },
    setSellerProfile: (state, action) => {
      state.profile = action.payload;
      state.status = 'succeeded';
    },
    clearSellerData: () => initialState,
  },
});

export const {
  sellerRequestStarted,
  sellerRequestFailed,
  setSellerDashboard,
  setSellerProfile,
  clearSellerData,
} = sellerSlice.actions;

export default sellerSlice.reducer;