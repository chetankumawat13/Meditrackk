import { useSelector } from 'react-redux';

/**
 * Returns the current patient record, merging whatever the auth backend
 * gave us (once it exists) with the shared mock data store so every
 * buyer page has a consistent id/name/mobile/email to work with.
 */
export function usePatient() {
  const authUser = useSelector((state) => state.authReducer.user);
  const patients = useSelector((state) => state.dataReducer.patients);

  const matched = authUser ? patients.find((p) => p.id === authUser.id) : null;
  const fallback = patients[0];

  const patient = matched || {
    id: authUser?.id || fallback?.id,
    name: authUser?.fullname || authUser?.name || fallback?.name,
    mobile: authUser?.contact || authUser?.mobile || fallback?.mobile,
    email: authUser?.email || fallback?.email,
  };

  return patient;
}
