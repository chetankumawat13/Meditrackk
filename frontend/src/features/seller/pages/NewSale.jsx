import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPurchase } from '../../shared/state/data.slice.js';
import { createPurchase } from '../api/seller.api.js';
import { fetchPatients, normalizePatient, normalizePurchase } from '../../shared/api/records.api.js';
import CreatePatientModal from '../components/CreatePatientModal.jsx';
import Toast from '../../shared/components/Toast.jsx';
import '../layout/SellerLayout.css';
import './NewSale.css';

const NewSale = () => {
  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state.dataReducer);

  const [patientSearch, setPatientSearch] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [createPatientOpen, setCreatePatientOpen] = useState(false);

  const [selectedMedicineId, setSelectedMedicineId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  const [paymentStatus, setPaymentStatus] = useState('paid');
  const [prescriptionID, setPrescriptionID] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);

  const selectedMedicine = medicines.find((m) => m.id === selectedMedicineId);

  async function onSearchPatient() {
    const term = patientSearch.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      return;
    }
    setPatientSearchLoading(true);
    try {
      const data = await fetchPatients(term);
      let results = (data.patients || []).map(normalizePatient);

      if (results.length === 0 && /^\d+$/.test(term)) {
        const allPatients = await fetchPatients();
        results = (allPatients.patients || [])
          .map(normalizePatient)
          .filter((patient) => patient.mobile.replace(/\D/g, '').includes(term));
      }

      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
      setSmsMessage(error?.response?.data?.message || 'Unable to search patients');
    } finally {
      setPatientSearchLoading(false);
    }
  }

  function onSelectPatient(patient) {
    setSelectedPatient(patient);
    setSearchResults(null);
    setCartItems([]);
  }

  function onPatientCreated(patient) {
    onSelectPatient(patient);
  }

  function onAddMedicineToCart() {
    if (!selectedMedicineId) {
      window.alert('Please select a medicine');
      return;
    }
    if (selectedMedicine.stock < quantity) {
      window.alert('Not enough stock available');
      return;
    }

    setCartItems((prev) => [
      ...prev,
      {
        medicineID: selectedMedicine.id,
        medicineName: selectedMedicine.name,
        quantity: Number(quantity),
        price: selectedMedicine.price,
        discount: Number(discount),
        requiresPrescription: selectedMedicine.prescriptionRequired,
      },
    ]);
    setSelectedMedicineId('');
    setQuantity(1);
    setDiscount(0);
  }

  function onRemoveCartItem(index) {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const totalDiscount = cartItems.reduce(
    (sum, item) => sum + (item.quantity * item.price * item.discount) / 100,
    0
  );
  const finalAmount = subtotal - totalDiscount;
  const requiresPrescription = cartItems.some((item) => item.requiresPrescription);

  function resetForm() {
    setSelectedPatient(null);
    setPatientSearch('');
    setSearchResults(null);
    setCartItems([]);
    setPaymentStatus('paid');
    setPrescriptionID('');
  }

  async function onCompleteSale() {
    if (!selectedPatient || cartItems.length === 0) {
      window.alert('Please select a patient and add medicines');
      return;
    }

    const purchaseRequest = {
      medicines: cartItems.map((item) => ({ medicineId: item.medicineID, quantity: item.quantity })),
      paymentMethod: 'cash',
      status: paymentStatus === 'paid' ? 'completed' : 'pending',
      patientId: selectedPatient.id,
      patientContact: selectedPatient.mobile || selectedPatient.contact,
      notes: prescriptionID,
    };

    try {
      const data = await createPurchase(purchaseRequest, { byStore: true });
      const purchase = normalizePurchase(data.purchase);
      dispatch(addPurchase(purchase));

      setSmsMessage(
        `Purchase completed successfully. Receipt ID: ${purchase.id}, Patient ID: ${selectedPatient.id}`
      );
      resetForm();
    } catch (error) {
      setSmsMessage(error?.response?.data?.message || 'Unable to complete purchase');
    }
  }

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Create Medicine Purchase</h1>
      </div>

      <div className="sale-form-container">
        <div className="sale-form-panel">
          <h2>Step 1: Select Patient</h2>
          <div className="search-patient">
            <div className="form-group">
              <label htmlFor="patientSearchInput">Patient ID or Mobile Number</label>
              <input
                type="text"
                id="patientSearchInput"
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>
            <button type="button" className="btn btn-secondary" onClick={onSearchPatient}>
              {patientSearchLoading ? 'Searching...' : 'Search'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCreatePatientOpen(true)}
            >
              Create New Patient
            </button>
          </div>

          {searchResults && (
            <div className="patient-search-results">
              <h3>Search Results</h3>
              {searchResults.length === 0 ? (
                <p className="seller-empty-state">No patients found</p>
              ) : (
                <div className="patient-results-list">
                  {searchResults.map((patient) => (
                    <div
                      className="sale-patient-item"
                      key={patient.id}
                      onClick={() => onSelectPatient(patient)}
                    >
                      <div className="sale-patient-item-name">{patient.name}</div>
                      <div className="sale-patient-item-detail">
                        <span>ID:</span>
                        <span>{patient.id}</span>
                      </div>
                      <div className="sale-patient-item-detail">
                        <span>Mobile:</span>
                        <span>{patient.mobile}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedPatient && (
            <div className="selected-patient-card">
              <h3>Selected Patient</h3>
              <div className="profile-info-row">
                <span>Name:</span>
                <span>{selectedPatient.name}</span>
              </div>
              <div className="profile-info-row">
                <span>Patient ID:</span>
                <span>{selectedPatient.id}</span>
              </div>
              <div className="profile-info-row">
                <span>Mobile:</span>
                <span>{selectedPatient.mobile}</span>
              </div>
            </div>
          )}
        </div>

        <div className="sale-form-panel">
          <h2>Step 2: Add Medicines</h2>
          {selectedPatient && (
            <div className="medicine-selector">
              <div className="form-group">
                <label htmlFor="medicineSelect">Select Medicine</label>
                <select
                  id="medicineSelect"
                  value={selectedMedicineId}
                  onChange={(e) => setSelectedMedicineId(e.target.value)}
                >
                  <option value="">Choose a medicine...</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.price})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="saleQuantity">Quantity</label>
                  <input
                    type="number"
                    id="saleQuantity"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="saleUnitPrice">Unit Price (₹)</label>
                  <input type="number" id="saleUnitPrice" value={selectedMedicine?.price || ''} readOnly />
                </div>
                <div className="form-group">
                  <label htmlFor="saleDiscount">Discount (%)</label>
                  <input
                    type="number"
                    id="saleDiscount"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                  />
                </div>
              </div>
              <button type="button" className="btn btn-secondary" onClick={onAddMedicineToCart}>
                Add Medicine
              </button>
            </div>
          )}

          <div className="sale-items-list">
            {cartItems.length === 0 ? (
              <p className="seller-empty-state">No medicines added yet</p>
            ) : (
              cartItems.map((item, index) => {
                const total = (item.quantity * item.price * (100 - item.discount)) / 100;
                return (
                  <div className="sale-item" key={index}>
                    <div className="sale-item-details">
                      <div className="sale-item-label">Medicine</div>
                      <div>{item.medicineName}</div>
                    </div>
                    <div className="sale-item-details">
                      <div className="sale-item-label">Qty</div>
                      <div>{item.quantity}</div>
                    </div>
                    <div className="sale-item-details">
                      <div className="sale-item-label">Price</div>
                      <div>₹{item.price}</div>
                    </div>
                    <div className="sale-item-details">
                      <div className="sale-item-label">Discount</div>
                      <div>{item.discount}%</div>
                    </div>
                    <div className="sale-item-details">
                      <div className="sale-item-label">Total</div>
                      <div>₹{total.toFixed(2)}</div>
                    </div>
                    <button className="action-btn" onClick={() => onRemoveCartItem(index)}>
                      Remove
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="sale-form-panel">
          <h2>Step 3: Review &amp; Complete</h2>
          {cartItems.length === 0 || !selectedPatient ? (
            <p className="seller-empty-state">Select a patient and add medicines to continue</p>
          ) : (
            <div className="sale-summary">
              <table>
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="amount">₹{subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Total Discount</td>
                    <td className="amount">₹{totalDiscount.toFixed(2)}</td>
                  </tr>
                  <tr className="summary-total">
                    <td>Final Amount</td>
                    <td className="amount">₹{finalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="payment-status">
                <label>
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="paid"
                    checked={paymentStatus === 'paid'}
                    onChange={() => setPaymentStatus('paid')}
                  />
                  <span>Payment Completed</span>
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentStatus"
                    value="due"
                    checked={paymentStatus === 'due'}
                    onChange={() => setPaymentStatus('due')}
                  />
                  <span>Payment Due</span>
                </label>
              </div>

              {requiresPrescription && (
                <div className="prescription-section">
                  <h3>Prescription Information</h3>
                  <p>A prescription is required for this medicine</p>
                  <div className="form-group">
                    <label htmlFor="prescriptionID">Prescription ID (Optional)</label>
                    <input
                      type="text"
                      id="prescriptionID"
                      placeholder="Enter prescription ID or leave blank"
                      value={prescriptionID}
                      onChange={(e) => setPrescriptionID(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <button type="button" className="btn btn-primary" onClick={onCompleteSale}>
                Complete Purchase
              </button>
            </div>
          )}
        </div>
      </div>

      <CreatePatientModal
        open={createPatientOpen}
        onClose={() => setCreatePatientOpen(false)}
        onCreated={onPatientCreated}
      />
      <Toast title="SMS Notification" message={smsMessage} onClose={() => setSmsMessage('')} duration={5000} />
    </section>
  );
};

export default NewSale;
