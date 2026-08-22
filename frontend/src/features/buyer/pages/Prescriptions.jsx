import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import '../layout/BuyerLayout.css';
import './Prescriptions.css';

const Prescriptions = () => {
  const patient = usePatient();
  const { purchases, medicines } = useSelector((state) => state.dataReducer);

  const prescriptionItems = useMemo(() => {
    const items = [];
    purchases
      .filter((p) => p.patientID === patient.id)
      .forEach((purchase) => {
        purchase.items.forEach((item) => {
          const medicine = medicines.find((m) => m.id === item.medicineID);
          if (medicine && medicine.prescriptionRequired) {
            items.push({
              medicineName: item.medicineName,
              date: purchase.date,
              receiptID: purchase.id,
            });
          }
        });
      });
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [purchases, medicines, patient.id]);

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>Prescriptions</h1>
      </div>

      {prescriptionItems.length === 0 ? (
        <p className="buyer-empty-state">No prescriptions in your history</p>
      ) : (
        <div className="prescriptions-list">
          {prescriptionItems.map((item, idx) => (
            <div className="prescription-item" key={idx}>
              <div className="prescription-name">✓ {item.medicineName}</div>
              <div className="prescription-meta">
                {new Date(item.date).toLocaleDateString()} • Receipt #{item.receiptID}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Prescriptions;
