import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addMedicine } from '../../shared/state/data.slice.js';
import { createMedicine } from '../api/seller.api.js';
import { normalizeMedicine } from '../../shared/api/records.api.js';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/SellerLayout.css';
import './AddMedicine.css';

const initialForm = {
  name: '',
  generic: '',
  category: '',
  manufacturer: '',
  price: '',
  stock: '',
  expiry: '',
  prescriptionRequired: 'false',
  description: '',
};

const AddMedicine = () => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [toastMessage, setToastMessage] = useState('');

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();

    const medicine = {
      name: form.name,
      genericName: form.generic,
      category: form.category,
      manufacturer: form.manufacturer,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      expiryDate: form.expiry,
      requiresPrescription: form.prescriptionRequired === 'true',
      description: form.description,
    };

    try {
      const data = await createMedicine(medicine);
      dispatch(addMedicine(normalizeMedicine(data.medicine)));
      setToastMessage(`Medicine "${medicine.name}" added successfully`);
      setForm(initialForm);
    } catch (error) {
      setToastMessage(error?.response?.data?.message || 'Unable to add medicine');
    }
  }

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Add New Medicine</h1>
      </div>

      <form className="medicine-form" onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="medicineName">Medicine Name *</label>
            <input
              type="text"
              id="medicineName"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="genericName">Generic Name</label>
            <input
              type="text"
              id="genericName"
              value={form.generic}
              onChange={(e) => updateField('generic', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="medicineCategory">Category *</label>
            <select
              id="medicineCategory"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="BP">BP/Heart</option>
              <option value="Antibiotics">Antibiotics</option>
              <option value="Pain Relief">Pain Relief</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Cold">Cold &amp; Cough</option>
              <option value="Vitamin">Vitamins</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="manufacturer">Manufacturer</label>
            <input
              type="text"
              id="manufacturer"
              value={form.manufacturer}
              onChange={(e) => updateField('manufacturer', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="medicinePrice">Price (₹) *</label>
            <input
              type="number"
              id="medicinePrice"
              step="0.01"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="medicineStock">Stock Quantity *</label>
            <input
              type="number"
              id="medicineStock"
              value={form.stock}
              onChange={(e) => updateField('stock', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="medicineExpiry">Expiry Date *</label>
            <input
              type="date"
              id="medicineExpiry"
              value={form.expiry}
              onChange={(e) => updateField('expiry', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="prescriptionRequired">Prescription Required</label>
            <select
              id="prescriptionRequired"
              value={form.prescriptionRequired}
              onChange={(e) => updateField('prescriptionRequired', e.target.value)}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="medicineDescription">Description</label>
          <textarea
            id="medicineDescription"
            rows="4"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Medicine
        </button>
      </form>

      <Toast title="MediTrack" message={toastMessage} onClose={() => setToastMessage('')} />
    </section>
  );
};

export default AddMedicine;
