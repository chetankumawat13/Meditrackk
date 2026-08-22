import { useSelector } from 'react-redux';

/**
 * Returns the current store record, merging whatever the auth backend
 * gave us (once it exists) with the shared mock data store so every
 * seller page has a consistent id/storeName/license/email to work with.
 */
export function useStore() {
  const authUser = useSelector((state) => state.authReducer.user);
  const stores = useSelector((state) => state.dataReducer.stores);

  const matched = authUser ? stores.find((s) => s.id === authUser.id) : null;
  const fallback = stores[0];

  const store = matched || {
    id: authUser?.id || fallback?.id,
    storeName: authUser?.storeName || fallback?.storeName,
    license: authUser?.license || fallback?.license,
    email: authUser?.email || fallback?.email,
  };

  return store;
}
