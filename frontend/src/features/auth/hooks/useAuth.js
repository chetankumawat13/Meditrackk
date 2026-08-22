import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser, setError, clearAuthError, logout } from '../state/auth.slice.js';
import { register, login } from '../api/auth.api.js';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.authReducer);

  async function handleRegister({
    fullname,
    contact,
    email,
    password,
    dateOfBirth,
    gender,
    address,
  }) {
    dispatch(setLoading(true));
    dispatch(clearAuthError());
    try {
      const data = await register({
        fullname,
        contact,
        email,
        password,
        dateOfBirth,
        gender,
        address,
      });
      dispatch(setUser(data.user));
      return data.user;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Registration failed. Please try again.';
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    dispatch(setLoading(true));
    dispatch(clearAuthError());
    try {
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      return data.user;
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || 'Invalid email or password.';
      dispatch(setError(message));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleLogout() {
    dispatch(logout());
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
