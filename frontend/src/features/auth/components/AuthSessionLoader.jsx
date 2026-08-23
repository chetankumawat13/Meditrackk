import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setUser } from '../state/auth.slice.js';
import { getCurrentStore } from '../../stores/api/store.api.js';
import { getCurrentUser } from '../../users/api/users.api.js';

export default function AuthSessionLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;
    dispatch(setLoading(true));

    async function restoreSession() {
      const [userResult, storeResult] = await Promise.allSettled([
        getCurrentUser(),
        getCurrentStore(),
      ]);
      if (cancelled) return;

      if (userResult.status === 'fulfilled' && userResult.value.user) {
        dispatch(setUser({ ...userResult.value.user, role: userResult.value.user.role || 'patient' }));
      } else if (storeResult.status === 'fulfilled' && storeResult.value.store) {
        dispatch(setUser({ ...storeResult.value.store, role: storeResult.value.store.role || 'store' }));
      }
      dispatch(setLoading(false));
    }

    restoreSession().catch(() => dispatch(setLoading(false)));
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return null;
}