import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dataRequestFailed, dataRequestStarted, replaceData } from '../state/data.slice.js';
import { getAllStores, getCurrentStore } from '../../stores/api/store.api.js';
import { getCurrentUser } from '../../users/api/users.api.js';
import {
  fetchMedicines,
  fetchPatients,
  fetchPurchases,
  fetchReports,
  fetchShareCodes,
  fetchAccessLogs,
  normalizeMedicine,
  normalizePatient,
  normalizePurchase,
  normalizeReport,
} from '../api/records.api.js';

export default function ApiDataLoader() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.authReducer.user?.role);

  useEffect(() => {
    if (!role) return undefined;
    let cancelled = false;

    async function load() {
      dispatch(dataRequestStarted());
      const store = role === 'store';
      const requests = [
        fetchMedicines({ inventory: store }),
        fetchPurchases({ store }),
        fetchReports({ store }),
      ];
      if (store) requests.push(fetchPatients());
      else requests.push(getCurrentUser(), fetchShareCodes(), fetchAccessLogs(), getAllStores());

      const results = await Promise.all(requests);
      if (cancelled) return;
      const medicineData = results[0];
      const purchaseData = results[1];
      const reportData = results[2];
      const data = {
        medicines: (medicineData.medicines || []).map(normalizeMedicine),
        purchases: (purchaseData.purchases || []).map(normalizePurchase),
        reports: (reportData.reports || []).map(normalizeReport),
      };
      if (store) {
        const patientData = results[3];
        const storeData = await getCurrentStore();
        data.patients = (patientData.patients || []).map(normalizePatient);
        data.stores = storeData.store ? [{
          ...storeData.store,
          id: storeData.store.id || storeData.store._id,
          email: storeData.store.email || storeData.store.storeEmail,
          license: storeData.store.license || storeData.store.storeLicenseNumber,
        }] : [];
      } else {
        const userData = results[3];
        const shareData = results[4];
        const logsData = results[5];
        const storesData = results[6];
        data.patients = userData.user ? [{ ...userData.user, id: userData.user.id || userData.user._id, name: userData.user.fullname, mobile: userData.user.contact }] : [];
        const patientId = data.patients[0]?.id;
        data.shareCodes = { [patientId]: (shareData.shares || []).map((share) => ({ code: share.shareCode, created: share.createdAt, expires: share.expiresAt })) };
        data.accessLogs = { [patientId]: (logsData.logs || []).map((log) => ({ accessedBy: log.accessedBy, timestamp: log.accessedAt })) };
        data.stores = (storesData.stores || []).map((store) => ({
          ...store,
          id: store._id || store.id,
          email: store.email || store.storeEmail,
          license: store.license || store.storeLicenseNumber,
        }));
      }
      dispatch(replaceData(data));
    }

    load().catch((error) => {
      if (!cancelled) dispatch(dataRequestFailed(error?.response?.data?.message || 'Unable to load application data'));
    });
    return () => { cancelled = true; };
  }, [dispatch, role]);

  return null;
}