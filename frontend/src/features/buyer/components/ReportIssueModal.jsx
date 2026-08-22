import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../shared/components/Modal.jsx';
import { addReport } from '../../shared/state/data.slice.js';
import { createReport } from '../../shared/api/records.api.js';
import { normalizeReport } from '../../shared/api/records.api.js';
import { usePatient } from '../hooks/usePatient.js';

const issueTypes = [
  { value: 'defective', label: 'Defective/Damaged' },
  { value: 'expired', label: 'Expired' },
  { value: 'incorrect', label: 'Incorrect Medicine' },
  { value: 'quantity', label: 'Quantity Mismatch' },
  { value: 'other', label: 'Other' },
];

const ReportIssueModal = ({ open, onClose, receiptId, onSubmitted }) => {
  const dispatch = useDispatch();
  const patient = usePatient();
  const purchases = useSelector((state) => state.dataReducer.purchases);
  const purchase = purchases.find((p) => p.id === receiptId);

  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open) {
      setIssueType('');
      setDescription('');
    }
  }, [open, receiptId]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!purchase) return;

    try {
      const data = await createReport({
        purchaseId: purchase.id,
        medicineId: purchase.items[0]?.medicineID,
        medicineName: purchase.items[0]?.medicineName || 'Unknown',
        issueType,
        description,
      });
      dispatch(addReport(normalizeReport(data.report)));
      onSubmitted?.();
      onClose?.();
    } catch {
      onSubmitted?.('Unable to submit report');
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Report an Issue</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Receipt</label>
          <input type="text" value={purchase ? purchase.id : ''} readOnly />
        </div>
        <div className="form-group">
          <label>Medicine</label>
          <input type="text" value={purchase?.items[0]?.medicineName || ''} readOnly />
        </div>
        <div className="form-group">
          <label htmlFor="reportIssueType">Issue Type</label>
          <select
            id="reportIssueType"
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            required
          >
            <option value="">Select issue type</option>
            {issueTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="reportDescription">Description</label>
          <textarea
            id="reportDescription"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Report
        </button>
      </form>
    </Modal>
  );
};

export default ReportIssueModal;
