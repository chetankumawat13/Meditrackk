import { useState } from 'react';
import { readPrescription } from '../api/prescription.api.js';
import './PrescriptionReader.css';

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

export default function PrescriptionReader({ medicines, onMedicineSelect }) {
  const [reading, setReading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  async function onFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, WEBP, HEIC, or HEIF image.');
      return;
    }
    if (file.size > 7 * 1024 * 1024) {
      setError('Please choose an image smaller than 7 MB.');
      return;
    }

    setReading(true);
    setError('');
    setResult(null);
    try {
      const data = await readPrescription(file);
      const medicinesRead = (data.medicines || []).map((item) => {
        const match = medicines.find((medicine) =>
          medicine.name.toLowerCase().includes(item.name.toLowerCase()) ||
          item.name.toLowerCase().includes(medicine.name.toLowerCase())
        );
        return { ...item, match };
      });
      setResult({ ...data, medicines: medicinesRead });
    } catch (requestError) {
      setError(requestError?.response?.data?.message || requestError.message || 'Unable to read the note.');
    } finally {
      setReading(false);
    }
  }

  return (
    <div className="prescription-reader">
      <div className="prescription-reader-heading">
        <div>
          <h3>Read Handwritten Note</h3>
          <p>Upload a clear prescription image to find medicines in your inventory.</p>
        </div>
        <label className="btn btn-secondary prescription-upload-button">
          {reading ? 'Reading...' : 'Upload Image'}
          <input type="file" accept="image/*" onChange={onFileChange} disabled={reading} />
        </label>
      </div>

      {error && <p className="prescription-reader-error">{error}</p>}
      {result && (
        <div className="prescription-reader-result">
          <div className="prescription-reader-result-meta">
            <strong>Detected medicines</strong>
            <span>Confidence: {result.confidence}</span>
          </div>
          {result.medicines.length === 0 ? (
            <p className="prescription-reader-muted">No medicine names were detected.</p>
          ) : (
            result.medicines.map((item, index) => (
              <div className="prescription-reader-item" key={`${item.name}-${index}`}>
                <span>{item.name}{item.quantity ? ` × ${item.quantity}` : ''}</span>
                {item.match ? (
                  <button type="button" className="action-btn" onClick={() => onMedicineSelect(item.match.id)}>
                    Select {item.match.name}
                  </button>
                ) : <small>Not in inventory</small>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}