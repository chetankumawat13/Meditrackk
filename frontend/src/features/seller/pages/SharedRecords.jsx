import { useState } from 'react';
import { redeemShareCode } from '../../shared/api/records.api.js';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/SellerLayout.css';
import './SharedRecords.css';

const SharedRecords = () => {
  const [accessCode, setAccessCode] = useState('');
  const [sharedRecords, setSharedRecords] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  async function onRedeem(event) {
    event.preventDefault();
    if (!accessCode.trim()) return;

    try {
      const data = await redeemShareCode(accessCode.trim().toUpperCase());
      setSharedRecords(data);
      setToastMessage('Shared information loaded');
    } catch (error) {
      setSharedRecords(null);
      setToastMessage(error?.response?.data?.message || 'Unable to access shared information');
    }
  }

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Get Shared Information</h1>
        <p>Enter a patient share code to view the information they approved</p>
      </div>

      <div className="seller-shared-layout">
        <div className="seller-shared-panel">
          <h2>Access Shared Records</h2>
          <p>Use the temporary code provided by the patient.</p>
          <form className="seller-access-form" onSubmit={onRedeem}>
            <label htmlFor="seller-share-code">Share code</label>
            <input
              id="seller-share-code"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
              placeholder="MED-XXXXXXXXXX"
              autoComplete="off"
            />
            <button className="btn btn-primary" type="submit">View Information</button>
          </form>
        </div>

        {sharedRecords && (
          <div className="seller-shared-panel seller-shared-results" aria-live="polite">
            <h2>Approved Information</h2>
            <p className="shared-owner">
              Shared by <strong>{sharedRecords.patient?.name || 'Patient'}</strong>
            </p>

            {sharedRecords.patient && (
              <div className="shared-info-section">
                <strong>Contact details</strong>
                <span>Phone: {sharedRecords.patient.contact}</span>
                {sharedRecords.patient.address?.city && (
                  <span>City: {sharedRecords.patient.address.city}</span>
                )}
              </div>
            )}

            {sharedRecords.medicalRecords?.purchases && (
              <div className="shared-info-section">
                <strong>Medicine history</strong>
                {sharedRecords.medicalRecords.purchases.length === 0 ? (
                  <span>No medicine purchases shared</span>
                ) : (
                  sharedRecords.medicalRecords.purchases.map((purchase) => (
                    <span key={purchase._id}>
                      {purchase.medicines.map((medicine) => `${medicine.medicineName} x${medicine.quantity}`).join(', ')}
                    </span>
                  ))
                )}
              </div>
            )}

            {sharedRecords.medicalRecords?.reports && (
              <div className="shared-info-section">
                <strong>Reports</strong>
                <span>{sharedRecords.medicalRecords.reports.length} report(s) shared</span>
              </div>
            )}
          </div>
        )}
      </div>

      <Toast title="MediTrack" message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  );
};

export default SharedRecords;