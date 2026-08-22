import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import { addShareCode, revokeShareCode } from '../../shared/state/data.slice.js';
import { createShareCode, revokeShareCodeRequest } from '../../shared/api/records.api.js';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/BuyerLayout.css';
import './ShareHistory.css';

const ShareHistory = () => {
  const dispatch = useDispatch();
  const patient = usePatient();
  const { shareCodes, accessLogs } = useSelector((state) => state.dataReducer);

  const [lastGenerated, setLastGenerated] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const patientCodes = shareCodes[patient.id] || [];
  const patientLogs = accessLogs[patient.id] || [];

  async function onGenerate() {
    try {
      const data = await createShareCode(patient.id);
      const code = data.shareCode;
      dispatch(addShareCode({ patientID: patient.id, code, created: new Date().toISOString(), expires: data.expiresAt }));
      setLastGenerated(code);
      setToastMessage(`Share code generated: ${code}`);
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to generate share code');
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
          <p>Create a temporary access code to share your medication history</p>
          <button className="btn btn-primary" onClick={onGenerate}>
            Generate Access Code
          </button>

          {lastGenerated && (
            <div className="share-code-display">
              <p>Your access code (valid for 7 days):</p>
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
