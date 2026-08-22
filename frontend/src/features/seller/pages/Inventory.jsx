import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMedicine } from '../../shared/state/data.slice.js';
import { deleteMedicineRequest } from '../api/seller.api.js';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/SellerLayout.css';
import './Inventory.css';

const categories = ['BP', 'Antibiotics', 'Pain Relief', 'Diabetes', 'Cold', 'Vitamin'];
const EXPIRY_WARNING_DAYS = 30;

const Inventory = () => {
  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.dataReducer.medicines);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const filtered = useMemo(() => {
    return medicines.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) &&
        (category === '' || m.category === category)
    );
  }, [medicines, search, category]);

  function isExpiringSoon(expiry) {
    const daysUntil = Math.ceil((new Date(expiry) - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntil < EXPIRY_WARNING_DAYS;
  }

  async function onDelete(medicine) {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await deleteMedicineRequest(medicine.id);
      dispatch(deleteMedicine(medicine.id));
      setToastMessage(`"${medicine.name}" deleted successfully`);
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to delete medicine');
    }
  }

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Medicine Inventory</h1>
        <div className="seller-section-controls">
          <input
            type="text"
            placeholder="Search medicines..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'Cold' ? 'Cold & Cough' : c === 'BP' ? 'BP/Heart' : c === 'Vitamin' ? 'Vitamins' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="seller-empty-state">No medicines found</p>
      ) : (
        <div className="inventory-table">
          <div className="inventory-header">
            <div>Medicine Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Expiry</div>
            <div>Rx Req.</div>
            <div>Actions</div>
          </div>
          {filtered.map((medicine) => (
            <div
              className="inventory-row"
              key={medicine.id}
              style={isExpiringSoon(medicine.expiry) ? { backgroundColor: '#fff3cd' } : undefined}
            >
              <div>{medicine.name}</div>
              <div>{medicine.category}</div>
              <div>₹{medicine.price}</div>
              <div>{medicine.stock}</div>
              <div>{new Date(medicine.expiry).toLocaleDateString()}</div>
              <div>{medicine.prescriptionRequired ? 'Yes' : 'No'}</div>
              <div className="inventory-actions">
                <button className="action-btn" onClick={() => setToastMessage('Editing is coming soon')}>
                  Edit
                </button>
                <button className="action-btn" onClick={() => onDelete(medicine)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast title="MediTrack" message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  );
};

export default Inventory;
