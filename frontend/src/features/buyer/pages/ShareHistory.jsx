import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import { addShareCode, revokeShareCode } from '../../shared/state/data.slice.js';
import { createShareCode, redeemShareCode, revokeShareCodeRequest } from '../../shared/api/records.api.js';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/BuyerLayout.css';
import './ShareHistory.css';

const ShareHistory = () => {
  const dispatch = useDispatch();
  const patient = usePatient();
  const { shareCodes, accessLogs } = useSelector((state) => state.dataReducer);

  const [lastGenerated, setLastGenerated] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [shareOptions, setShareOptions] = useState(['contact', 'medicines']);
  const [expiresIn, setExpiresIn] = useState('7');
  const [accessCode, setAccessCode] = useState('');
  const [sharedRecords, setSharedRecords] = useState(null);

  const patientCodes = shareCodes[patient.id] || [];
  const patientLogs = accessLogs[patient.id] || [];

  async function onGenerate() {
    try {
      const data = await createShareCode({ dataType: shareOptions, expiresIn: Number(expiresIn) });
      const code = data.shareCode;
      dispatch(addShareCode({ patientID: patient.id, code, created: new Date().toISOString(), expires: data.expiresAt }));
      setLastGenerated(code);
      setToastMessage(`Share code generated: ${code}`);
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to generate share code');
    }
  }

  function toggleShareOption(option) {
    setShareOptions((current) => current.includes(option)
      ? current.filter((value) => value !== option)
      : [...current, option]);
  }

  async function onRedeem(event) {
    event.preventDefault();
    if (!accessCode.trim()) return;
    try {
      const data = await redeemShareCode(accessCode.trim().toUpperCase());
      setSharedRecords(data);
      setToastMessage('Shared records loaded');
    } catch (error) {
      setSharedRecords(null);
      setToastMessage(error?.response?.data?.message || 'Unable to access shared records');
    }
  }

  function onCopy(code) {
    navigator.clipboard?.writeText(code).then(() => setToastMessage('Share code copied to clipboard'));
  }

  async function onRevoke(code) {
    try {
      await revokeShareCodeRequest(patient.id, code);
      dispatch(revokeShareCode({ patientID: patient.id, code }));
      setToastMessage('Share code revoked');
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to revoke share code');
    }
  }

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>Share Your Medication History</h1>
        <p>Share your medical records with trusted doctors or other medical stores</p>
      </div>

      <div className="share-panel">
        <div className="share-control">
          <h2>Generate Share Code</h2>
          <p>Create a temporary code for another Meditrack user</p>
          <div className="share-options">
            <span className="share-label">Share:</span>
            {[
              ['contact', 'Contact details'],
              ['medicines', 'Medicine history'],
              ['reports', 'Reports'],
            ].map(([value, label]) => (
              <label className="share-option" key={value}>
                <input
                  type="checkbox"
                  checked={shareOptions.includes(value)}
                  onChange={() => toggleShareOption(value)}
                />
                {label}
              </label>
            ))}
          </div>
          <label className="share-expiry">
            Expires after
            <select value={expiresIn} onChange={(event) => setExpiresIn(event.target.value)}>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </label>
          <button className="btn btn-primary" onClick={onGenerate}>
            Generate Access Code
          </button>

          {lastGenerated && (
            <div className="share-code-display">
              <p>Your access code (valid for {expiresIn} days):</p>
              <div className="share-code-box">
                <code>{lastGenerated}</code>
                <button className="btn btn-small" onClick={() => onCopy(lastGenerated)}>
                  Copy
                </button>
              </div>
              <p className="text-secondary">
                Share this code with a doctor or medical store to access your history
              </p>
            </div>
          )}
        </div>

        <div className="share-control">
          <h2>Access Shared Records</h2>
          <p>Enter a code shared with you by another Meditrack user</p>
          <form className="access-code-form" onSubmit={onRedeem}>
            <input
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value.toUpperCase())}
              placeholder="MED-XXXXXXXXXX"
              aria-label="Share code"
              autoComplete="off"
            />
            <button className="btn btn-primary" type="submit">View Records</button>
          </form>
          {sharedRecords && (
            <div className="shared-records" aria-live="polite">
              <h3>Shared by {sharedRecords.patient?.name || 'another user'}</h3>
              {sharedRecords.patient && (
                <div className="shared-record-section">
                  <strong>Contact details</strong>
                  <span>{sharedRecords.patient.contact}</span>
                  <span>{sharedRecords.patient.address?.city || 'Address not shared'}</span>
                </div>
              )}
              {sharedRecords.medicalRecords?.purchases && (
                <div className="shared-record-section">
                  <strong>Medicine history</strong>
                  {sharedRecords.medicalRecords.purchases.map((purchase) => (
                    <span key={purchase._id}>
                      {purchase.medicines.map((medicine) => `${medicine.medicineName} x${medicine.quantity}`).join(', ')}
                    </span>
                  ))}
                </div>
              )}
              {sharedRecords.medicalRecords?.reports && (
                <div className="shared-record-section">
                  <strong>Reports</strong>
                  <span>{sharedRecords.medicalRecords.reports.length} report(s) shared</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="share-control">
          <h2>Active Share Codes</h2>
          {patientCodes.length === 0 ? (
            <p className="buyer-empty-state">No active share codes</p>
          ) : (
            <div className="share-codes-list">
              {patientCodes.map((c) => (
                <div className="share-code-item" key={c.code}>
                  <div>
                    <strong>Code:</strong> {c.code}
                  </div>
                  <div>
                    <strong>Created:</strong> {new Date(c.created).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Expires:</strong> {new Date(c.expires).toLocaleDateString()}
                  </div>
                  <button className="btn btn-small btn-danger" onClick={() => onRevoke(c.code)}>
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="share-control">
          <h2>Shared History Access Logs</h2>
          {patientLogs.length === 0 ? (
            <p className="buyer-empty-state">No access logs yet</p>
          ) : (
            <div className="access-logs">
              {patientLogs.map((log, idx) => (
                <div className="access-log-item" key={idx}>
                  <strong>{log.accessedBy}</strong> accessed your medication history on{' '}
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Toast title="MediTrack" message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  );
};

export default ShareHistory;
