import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import ReportIssueModal from '../components/ReportIssueModal.jsx';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/BuyerLayout.css';
import './Reports.css';

const statusClass = (status) => `status-${status.toLowerCase().replace(/\s+/g, '-')}`;

const Reports = () => {
  const patient = usePatient();
  const { reports, purchases } = useSelector((state) => state.dataReducer);
  const [modalReceiptId, setModalReceiptId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const patientReports = useMemo(
    () => reports.filter((r) => r.patientID === patient.id).sort((a, b) => new Date(b.submitted) - new Date(a.submitted)),
    [reports, patient.id]
  );

  const patientPurchases = useMemo(
    () => purchases.filter((p) => p.patientID === patient.id),
    [purchases, patient.id]
  );

  function onCreateNew() {
    // Default to the most recent purchase if the patient has any
    const latest = [...patientPurchases].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
    setModalReceiptId(latest ? latest.id : null);
  }

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>Report an Issue</h1>
      </div>

      <div className="reports-container">
        <button className="btn btn-primary" onClick={onCreateNew} disabled={patientPurchases.length === 0}>
          Create New Report
        </button>

        {patientReports.length === 0 ? (
          <p className="buyer-empty-state">No reports yet</p>
        ) : (
          <div className="reports-list">
            {patientReports.map((report) => (
              <div className="report-item" key={report.id}>
                <div className="report-header">
                  <div className="report-id">Report #{report.id}</div>
                  <span className={`report-status ${statusClass(report.status)}`}>{report.status}</span>
                </div>
                <div className="report-details">
                  <p><strong>Receipt:</strong> {report.receiptID}</p>
                  <p><strong>Medicine:</strong> {report.medicine}</p>
                  <p><strong>Issue Type:</strong> {report.issueType}</p>
                  <p><strong>Description:</strong> {report.description}</p>
                  <p className="report-submitted">Submitted: {new Date(report.submitted).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReportIssueModal
        open={modalReceiptId !== null}
        receiptId={modalReceiptId}
        onClose={() => setModalReceiptId(null)}
        onSubmitted={() => setToastMessage('Report submitted successfully')}
      />
      <Toast title="MediTrack" message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  );
};

export default Reports;
