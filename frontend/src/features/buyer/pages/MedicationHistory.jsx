import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import ReceiptModal from '../../shared/components/ReceiptModal.jsx';
import ReportIssueModal from '../components/ReportIssueModal.jsx';
import Toast from '../../shared/components/Toast.jsx';
import { triggerAIMedicationCheck } from '../api/buyer.api.js';
import '../layout/BuyerLayout.css';
import './MedicationHistory.css';

const MedicationHistory = () => {
  const patient = usePatient();
  const purchases = useSelector((state) => state.dataReducer.purchases);
  const [search, setSearch] = useState('');
  const [receiptId, setReceiptId] = useState(null);
  const [reportReceiptId, setReportReceiptId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [checkingMedicineId, setCheckingMedicineId] = useState(null);

  const history = useMemo(() => {
    return purchases
      .filter((p) => p.patientID === patient.id)
      .filter((p) => p.items.some((i) => i.medicineName.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [purchases, patient.id, search]);

  const selectedReceipt = purchases.find((p) => p.id === receiptId);

  async function runAICheck(medicineId) {
    setCheckingMedicineId(medicineId);
    try {
      const result = await triggerAIMedicationCheck(medicineId);
      setToastMessage(result.message || 'AI medication check completed');
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Unable to run AI medication check');
    } finally {
      setCheckingMedicineId(null);
    }
  }

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>Medication History</h1>
        <div className="buyer-section-controls">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {history.length === 0 ? (
        <p className="buyer-empty-state">
          {search ? 'No medicines found' : 'No medication history yet. Your medicines will appear here when purchased.'}
        </p>
      ) : (
        <div className="history-timeline">
          {history.map((purchase) => (
            <div className="history-timeline-item" key={purchase.id}>
              <div className="history-date">
                {new Date(purchase.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="history-content">
                {purchase.items.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <div className="history-medicine-name">{item.medicineName}</div>
                    <div className="history-details">
                      <div className="history-detail">
                        <div className="history-detail-label">Quantity</div>
                        <div className="history-detail-value">{item.quantity} tablets</div>
                      </div>
                      <div className="history-detail">
                        <div className="history-detail-label">Price</div>
                        <div className="history-detail-value">₹{item.price}</div>
                      </div>
                      <div className="history-detail">
                        <div className="history-detail-label">Amount</div>
                        <div className="history-detail-value">
                          ₹{((item.quantity * item.price * (100 - item.discount)) / 100).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-small"
                      disabled={checkingMedicineId === item.medicineID}
                      onClick={() => runAICheck(item.medicineID)}
                    >
                      {checkingMedicineId === item.medicineID ? 'Checking...' : 'Run AI Check'}
                    </button>
                  </React.Fragment>
                ))}
                <div className="history-actions">
                  <button className="btn btn-small" onClick={() => setReceiptId(purchase.id)}>
                    View Receipt
                  </button>
                  <button className="btn btn-small" onClick={() => setReportReceiptId(purchase.id)}>
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReceiptModal open={!!selectedReceipt} onClose={() => setReceiptId(null)} purchase={selectedReceipt} />
      <ReportIssueModal
        open={!!reportReceiptId}
        receiptId={reportReceiptId}
        onClose={() => setReportReceiptId(null)}
        onSubmitted={() => setToastMessage('Report submitted successfully')}
      />
      <Toast title="MediTrack" message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  );
};

export default MedicationHistory;
