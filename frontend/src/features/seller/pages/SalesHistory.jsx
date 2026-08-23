import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStore } from '../hooks/useStore.js';
import ReceiptModal from '../../shared/components/ReceiptModal.jsx';
import '../layout/SellerLayout.css';
import './SalesHistory.css';

const SalesHistory = () => {
  const store = useStore();
  const { purchases, patients } = useSelector((state) => state.dataReducer);
  const [search, setSearch] = useState('');
  const [receiptId, setReceiptId] = useState(null);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return purchases
      .filter((p) => p.storeID === store.id)
      .filter((p) => {
        const patient = patients.find((pa) => pa.id === p.patientID);
        return (patient && patient.name.toLowerCase().includes(term)) || p.id.toLowerCase().includes(term);
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [purchases, patients, store.id, search]);

  const selectedReceipt = purchases.find((p) => p.id === receiptId);

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Sales History</h1>
        <div className="seller-section-controls">
          <input
            type="text"
            placeholder="Search by patient or receipt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="seller-empty-state">No sales found</p>
      ) : (
        <div className="sales-history-list">
          {filtered.map((purchase) => {
            const patient = patients.find((p) => p.id === purchase.patientID);
            return (
              <div className="sales-history-item" key={purchase.id}>
                <div className="sales-history-info">
                  <div className="sales-history-title">{patient ? patient.name : 'Unknown'}</div>
                  <div className="sales-history-meta">
                    {purchase.id} • {new Date(purchase.date).toLocaleString()}
                  </div>
                  <div className="sales-history-meta">
                    {purchase.items.map((i) => i.medicineName).join(', ')}
                  </div>
                </div>
                <div className="sales-history-amount">₹{purchase.total.toFixed(2)}</div>
                <button className="btn btn-small" onClick={() => setReceiptId(purchase.id)}>
                  Receipt
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ReceiptModal open={!!selectedReceipt} onClose={() => setReceiptId(null)} purchase={selectedReceipt} />
    </section>
  );
};

export default SalesHistory;
