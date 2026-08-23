import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import { getSafetyAlerts } from '../hooks/useSafetyAlerts.js';
import ReceiptModal from '../../shared/components/ReceiptModal.jsx';
import Skeleton from '../../shared/components/Skeleton.jsx';
import '../layout/BuyerLayout.css';
import './Dashboard.css';

const Dashboard = () => {
  const patient = usePatient();
  const purchases = useSelector((state) => state.dataReducer.purchases);
  const dataStatus = useSelector((state) => state.dataReducer.status);
  const [receiptId, setReceiptId] = useState(null);

  const patientPurchases = useMemo(
    () => purchases.filter((p) => p.patientID === patient.id),
    [purchases, patient.id]
  );

  const recentPurchases = useMemo(
    () => [...patientPurchases].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [patientPurchases]
  );

  const currentMedications = useMemo(() => {
    const meds = {};
    patientPurchases.forEach((purchase) => {
      purchase.items.forEach((item) => {
        if (!meds[item.medicineID]) meds[item.medicineID] = { name: item.medicineName, count: 0 };
        meds[item.medicineID].count++;
      });
    });
    return Object.values(meds);
  }, [patientPurchases]);

  const activeAlertCount = useMemo(() => getSafetyAlerts(patientPurchases).length, [patientPurchases]);
  const selectedReceipt = patientPurchases.find((p) => p.id === receiptId);
  const isLoading = dataStatus === 'idle' || dataStatus === 'loading';

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>
          Welcome, <span>{patient.name}</span>
        </h1>
        <p>Your digital medication history at a glance</p>
      </div>

      <div className="dash-info-cards">
        <div className="dash-info-card">
          {isLoading ? <Skeleton className="skeleton-icon" /> : <div className="dash-card-icon">👤</div>}
          <div className="dash-card-content">
            <h3>Patient ID</h3>
            <p className="dash-card-value">{isLoading ? <Skeleton className="skeleton-text" /> : patient.id}</p>
          </div>
        </div>
        <div className="dash-info-card">
          {isLoading ? <Skeleton className="skeleton-icon" /> : <div className="dash-card-icon">📱</div>}
          <div className="dash-card-content">
            <h3>Mobile</h3>
            <p className="dash-card-value">{isLoading ? <Skeleton className="skeleton-text" /> : patient.mobile}</p>
          </div>
        </div>
        <div className="dash-info-card">
          {isLoading ? <Skeleton className="skeleton-icon" /> : <div className="dash-card-icon">💊</div>}
          <div className="dash-card-content">
            <h3>Recent Medicines</h3>
            <p className="dash-card-value">{isLoading ? <Skeleton className="skeleton-text" /> : patientPurchases.length}</p>
          </div>
        </div>
        <div className="dash-info-card">
          {isLoading ? <Skeleton className="skeleton-icon" /> : <div className="dash-card-icon">⚠️</div>}
          <div className="dash-card-content">
            <h3>Active Alerts</h3>
            <p className="dash-card-value">{isLoading ? <Skeleton className="skeleton-text" /> : activeAlertCount}</p>
          </div>
        </div>
      </div>

      <div className="dash-grid">
        <div className="dash-panel">
          <h2>Recent Medicines</h2>
          {isLoading ? <BuyerPanelSkeleton /> : recentPurchases.length === 0 ? (
            <p className="buyer-empty-state">No medicines in your history yet</p>
          ) : (
            <div className="dash-medicines-list">
              {recentPurchases.map((purchase) => (
                <div className="dash-medicine-item" key={purchase.id}>
                  <div>
                    <div className="dash-medicine-name">
                      {purchase.items.map((i) => i.medicineName).join(', ')}
                    </div>
                    <div className="dash-medicine-meta">
                      {new Date(purchase.date).toLocaleDateString()} • Receipt #{purchase.id}
                    </div>
                  </div>
                  <button className="btn btn-small" onClick={() => setReceiptId(purchase.id)}>
                    View Receipt
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dash-panel">
          <h2>Current Medications</h2>
          {isLoading ? <BuyerPanelSkeleton /> : currentMedications.length === 0 ? (
            <p className="buyer-empty-state">No active medications</p>
          ) : (
            <div className="dash-medicines-list">
              {currentMedications.map((med) => (
                <div className="dash-medicine-item" key={med.name}>
                  <div>
                    <div className="dash-medicine-name">{med.name}</div>
                    <div className="dash-medicine-meta">{med.count} purchase(s)</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReceiptModal open={!!selectedReceipt} onClose={() => setReceiptId(null)} purchase={selectedReceipt} />
    </section>
  );
};

function BuyerPanelSkeleton() {
  return <div className="buyer-skeleton-list"><Skeleton className="skeleton-row" /><Skeleton className="skeleton-row" /><Skeleton className="skeleton-row" /></div>;
}

export default Dashboard;
