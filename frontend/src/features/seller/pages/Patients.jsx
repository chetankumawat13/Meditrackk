import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useStore } from '../hooks/useStore.js';
import '../layout/SellerLayout.css';
import './Patients.css';

const Patients = () => {
  const store = useStore();
  const { purchases, patients } = useSelector((state) => state.dataReducer);
  const [search, setSearch] = useState('');

  const storePurchases = useMemo(
    () => purchases.filter((p) => p.storeID === store.id),
    [purchases, store.id]
  );

  const storePatients = useMemo(() => {
    const patientIDs = new Set(storePurchases.map((p) => p.patientID));
    return patients.filter((p) => patientIDs.has(p.id));
  }, [storePurchases, patients]);

  const filtered = storePatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="seller-container">
      <div className="seller-page-header">
        <h1>Patients</h1>
        <div className="seller-section-controls">
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="seller-empty-state">No patients yet</p>
      ) : (
        <div className="patients-list">
          {filtered.map((patient) => {
            const count = storePurchases.filter((p) => p.patientID === patient.id).length;
            return (
              <div className="patient-card-item" key={patient.id}>
                <div className="patient-card-name">{patient.name}</div>
                <div className="patient-card-detail">
                  <span>Patient ID:</span>
                  <span>{patient.id}</span>
                </div>
                <div className="patient-card-detail">
                  <span>Mobile:</span>
                  <span>{patient.mobile}</span>
                </div>
                <div className="patient-card-detail">
                  <span>Purchases:</span>
                  <span>{count}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Patients;
