import { useSelector } from 'react-redux';
import Modal from './Modal.jsx';
import './ReceiptModal.css';

const formatDateTime = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const money = (value) => Number(value || 0).toFixed(2);

const ReceiptModal = ({ open, onClose, purchase }) => {
  const { patients, stores } = useSelector((state) => state.dataReducer);

  if (!open || !purchase) return null;

  const patient = patients.find((p) => p.id === purchase.patientID);
  const store = stores.find((s) => s.id === purchase.storeID);

  return (
    <Modal open={open} onClose={onClose} contentClassName="receipt-content">
      <div className="receipt">
        <div className="receipt-header">
          <h1>Digital Receipt</h1>
          <p>{formatDateTime(purchase.date)}</p>
        </div>

        <table className="receipt-table">
          <tbody>
            <tr>
              <td><strong>Receipt ID</strong></td>
              <td>{purchase.id}</td>
            </tr>
            <tr>
              <td><strong>Patient</strong></td>
              <td>{patient ? patient.name : 'Unknown'}</td>
            </tr>
            <tr>
              <td><strong>Patient ID</strong></td>
              <td>{purchase.patientID}</td>
            </tr>
            <tr>
              <td><strong>Store</strong></td>
              <td>{store ? store.storeName : 'Unknown Store'}</td>
            </tr>
          </tbody>
        </table>

        <h3>Medicines</h3>
        <div className="receipt-items">
          {purchase.items.map((item, idx) => {
            const quantity = Number(item.quantity || 0);
            const price = Number(item.price || 0);
            const discount = Number(item.discount || 0);
            const itemTotal = (quantity * price * (100 - discount)) / 100;
            return (
              <div className="receipt-item" key={idx}>
                <div>{item.medicineName}</div>
                <div>{quantity}</div>
                <div>₹{money(quantity * price)}</div>
                <div>₹{money(itemTotal)}</div>
              </div>
            );
          })}
        </div>

        <table className="receipt-table receipt-totals">
          <tbody>
            <tr>
              <td>Subtotal</td>
              <td>₹{money(purchase.subtotal)}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>₹{money(purchase.discount)}</td>
            </tr>
            <tr className="receipt-total">
              <td><strong>Total</strong></td>
              <td>₹{money(purchase.total)}</td>
            </tr>
            <tr>
              <td>Paid</td>
              <td>₹{money(purchase.paid)}</td>
            </tr>
            <tr>
              <td>Due</td>
              <td>₹{money(purchase.due)}</td>
            </tr>
          </tbody>
        </table>

        <button className="btn btn-secondary" onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
