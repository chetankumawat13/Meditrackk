import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, setError, clearAuthError, logout } from '../state/auth.slice.js';
import { register, login, logout as logoutRequest } from '../api/auth.api.js';
import { clearSellerData } from '../../seller/state/seller.slice.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.authReducer);

  async function handleRegister({
    role = 'buyer',
    fullname,
    contact,
    email,
    password,
    dateOfBirth,
    gender,
    address,
    storeName,
    storeLicenseNumber,
    storeContact,
    storeEmail,
    storeAddress,
  }) {
    dispatch(setLoading(true));
    dispatch(clearAuthError());
    try {
      const data = await register({
        role,
        fullname,
        contact,
        email,
        password,
        dateOfBirth,
        gender,
        address,
        storeName,
        storeLicenseNumber,
        storeContact,
        storeEmail,
        storeAddress,
      });
      const user = data.user || data.store;
      dispatch(setUser(user));
      return user;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password, role }) {
    dispatch(setLoading(true));
    dispatch(clearAuthError());
    try {
      const data = await login({ email, password, role });
      const user = data.user || data.store;
      dispatch(setUser(user));
      return user;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Invalid email or password.';
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      await logoutRequest();
    } finally {
      dispatch(logout());
      dispatch(clearSellerData());
    }
  }

  return {
    user,
    loading,
    error,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};
