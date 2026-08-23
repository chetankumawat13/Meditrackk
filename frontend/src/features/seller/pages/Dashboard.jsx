import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStore } from '../hooks/useStore.js';
import ReceiptModal from '../../shared/components/ReceiptModal.jsx';
import '../layout/SellerLayout.css';
import './Dashboard.css';

const LOW_STOCK_THRESHOLD = 20;
const EXPIRY_WINDOW_DAYS = 30;

const Dashboard = () => {
  const store = useStore();
  const { medicines, purchases, patients } = useSelector((state) => state.dataReducer);
  const [receiptId, setReceiptId] = useState(null);

  const storePurchases = useMemo(
    () => purchases.filter((p) => p.storeID === store.id),
    [purchases, store.id]
  );

  const recentSales = useMemo(
    () => [...storePurchases].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5),
    [storePurchases]
  );

  const lowStockMedicines = useMemo(
    () => medicines.filter((m) => m.stock < LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock),
    [medicines]
  );

  const expiringMedicines = useMemo(() => {
    const today = new Date();
    const windowEnd = new Date(today.getTime() + EXPIRY_WINDOW_DAYS * 24 * 60 * 60 * 1000);
    return medicines.filter((m) => {
      const expiry = new Date(m.expiry);
      return expiry <= windowEnd && expiry >= today;
    });
  }, [medicines]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    return {
      totalMedicines: medicines.length,
      totalStock: medicines.reduce((sum, m) => sum + m.stock, 0),
      lowStock: lowStockMedicines.length,
      todaysSales: storePurchases.filter((p) => new Date(p.date).toDateString() === today).length,
      pendingPayments: storePurchases.filter((p) => p.paymentStatus === 'due').length,
      totalPatients: new Set(storePurchases.map((p) => p.patientID)).size,
    };
  }, [medicines, lowStockMedicines, storePurchases]);

  const selectedReceipt = storePurchases.find((p) => p.id === receiptId);

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Store Dashboard</h1>
        <p>{store.storeName}</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-number">{stats.totalMedicines}</div>
          <div className="stat-label">Total Medicines</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalStock}</div>
          <div className="stat-label">Total Stock</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.lowStock}</div>
          <div className="stat-label">Low Stock Medicines</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.todaysSales}</div>
          <div className="stat-label">Today's Sales</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingPayments}</div>
          <div className="stat-label">Pending Payments</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPatients}</div>
          <div className="stat-label">Total Patients</div>
        </div>
      </div>

      <div className="seller-dash-grid">
        <div className="seller-dash-panel">
          <h2>Recent Sales</h2>
          {recentSales.length === 0 ? (
            <p className="seller-empty-state">No sales yet</p>
          ) : (
            <div className="seller-dash-list">
              {recentSales.map((purchase) => {
                const patient = patients.find((p) => p.id === purchase.patientID);
                return (
                  <div className="seller-sales-item" key={purchase.id}>
                    <div className="seller-sales-item-info">
                      <div className="seller-sales-item-name">{patient ? patient.name : 'Unknown'}</div>
                      <div className="seller-sales-item-details">
                        {purchase.id} • {new Date(purchase.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div
                      className="seller-sales-item-amount"
                      onClick={() => setReceiptId(purchase.id)}
                      role="button"
                    >
                      ₹{purchase.total.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="seller-dash-panel">
          <h2>Low Stock Alerts</h2>
          {lowStockMedicines.length === 0 ? (
            <p className="seller-empty-state">All medicines in stock</p>
          ) : (
            <div className="seller-dash-alerts">
              {lowStockMedicines.map((medicine) => (
                <div className="seller-alert seller-alert-warning" key={medicine.id}>
                  <div className="seller-alert-icon">⚠️</div>
                  <div className="seller-alert-content">
                    <h3>{medicine.name}</h3>
                    <p>Only {medicine.stock} units remaining</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="seller-dash-panel">
          <h2>Expiring Soon</h2>
          {expiringMedicines.length === 0 ? (
            <p className="seller-empty-state">No medicines expiring soon</p>
          ) : (
            <div className="seller-dash-alerts">
              {expiringMedicines.map((medicine) => (
                <div className="seller-alert seller-alert-danger" key={medicine.id}>
                  <div className="seller-alert-icon">🔴</div>
                  <div className="seller-alert-content">
                    <h3>{medicine.name}</h3>
                    <p>Expires on {new Date(medicine.expiry).toLocaleDateString()}</p>
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

export default Dashboard;
