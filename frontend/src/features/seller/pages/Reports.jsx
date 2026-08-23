import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useStore } from '../hooks/useStore.js';
import '../layout/SellerLayout.css';
import './Reports.css';

const statusClass = (status) => `status-${status.toLowerCase().replace(/\s+/g, '-')}`;

const Reports = () => {
  const store = useStore();
  const { reports, purchases } = useSelector((state) => state.dataReducer);

  const storeReports = useMemo(() => {
    const storeReceiptIDs = new Set(
      purchases.filter((p) => p.storeID === store.id).map((p) => p.id)
    );
    return reports
      .filter((r) => storeReceiptIDs.has(r.receiptID))
      .sort((a, b) => new Date(b.submitted) - new Date(a.submitted));
  }, [reports, purchases, store.id]);

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Customer Reports</h1>
      </div>

      {storeReports.length === 0 ? (
        <p className="seller-empty-state">No reports submitted</p>
      ) : (
        <div className="seller-reports-list">
          {storeReports.map((report) => (
            <div className="seller-report-item" key={report.id}>
              <div className="seller-report-header">
                <div className="seller-report-id">Report #{report.id}</div>
                <span className={`seller-report-status ${statusClass(report.status)}`}>{report.status}</span>
              </div>
              <div className="seller-report-details">
                <p><strong>Patient ID:</strong> {report.patientID}</p>
                <p><strong>Receipt:</strong> {report.receiptID}</p>
                <p><strong>Medicine:</strong> {report.medicine}</p>
                <p><strong>Issue:</strong> {report.issueType}</p>
                <p><strong>Description:</strong> {report.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Reports;
