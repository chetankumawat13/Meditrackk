import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStoreDashboard,
  fetchStoreProfile,
  updateStoreProfileRequest,
} from '../api/seller.api.js';
import {
  sellerRequestFailed,
  sellerRequestStarted,
  setSellerDashboard,
  setSellerProfile,
} from '../state/seller.slice.js';

const errorMessage = (error, fallback) => error?.response?.data?.message || error?.message || fallback;

export function useSeller() {
  const dispatch = useDispatch();
  const seller = useSelector((state) => state.sellerReducer);

  async function loadDashboard() {
    dispatch(sellerRequestStarted());
    try {
      const data = await fetchStoreDashboard();
      dispatch(setSellerDashboard(data.dashboard));
      return data.dashboard;
    } catch (error) {
      dispatch(sellerRequestFailed(errorMessage(error, 'Unable to load store dashboard')));
      throw error;
    }
  }

  async function loadProfile() {
    dispatch(sellerRequestStarted());
    try {
      const data = await fetchStoreProfile();
      dispatch(setSellerProfile(data.store));
      return data.store;
    } catch (error) {
      dispatch(sellerRequestFailed(errorMessage(error, 'Unable to load store profile')));
      throw error;
    }
  }

  async function updateProfile(profile) {
    dispatch(sellerRequestStarted());
    try {
      const data = await updateStoreProfileRequest(profile);
      dispatch(setSellerProfile(data.store));
      return data.store;
    } catch (error) {
      dispatch(sellerRequestFailed(errorMessage(error, 'Unable to update store profile')));
      throw error;
    }
  }

  return { ...seller, loadDashboard, loadProfile, updateProfile };
}