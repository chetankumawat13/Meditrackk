import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const PatientDashboard = () => {
  const { user } = useSelector((state) => state.authReducer);

  const meds = [
    { name: 'Amlodipine', dosage: '5mg', frequency: 'Daily' },
    { name: 'Metformin', dosage: '500mg', frequency: 'Twice a day' },
    { name: 'Vitamin D', dosage: '60k', frequency: 'Weekly' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Patient overview</p>
          <h1 style={styles.title}>My health dashboard</h1>
        </div>
        <Link to="/" style={styles.linkBtn}>Home</Link>
      </div>

      <div style={styles.cards}>
        <div style={styles.card}><h3>Recent medicines</h3><div style={styles.value}>08</div></div>
        <div style={styles.card}><h3>Active alerts</h3><div style={styles.value}>02</div></div>
        <div style={styles.card}><h3>Total purchases</h3><div style={styles.value}>12</div></div>
      </div>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <h2>Current medications</h2>
          <ul style={styles.list}>
            {meds.map((med) => (
              <li key={med.name} style={styles.listItem}>
                <div>
                  <strong>{med.name}</strong>
                  <p style={styles.meta}>{med.dosage} · {med.frequency}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.panel}>
          <h2>Profile</h2>
          <div style={styles.profileRow}><span>Name</span><strong>{user?.fullname || 'Patient'}</strong></div>
          <div style={styles.profileRow}><span>Patient ID</span><strong>{user?.patientId || 'P-0001'}</strong></div>
          <div style={styles.profileRow}><span>Email</span><strong>{user?.email || 'not provided'}</strong></div>
          <div style={styles.profileRow}><span>Phone</span><strong>{user?.contact || 'not provided'}</strong></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  eyebrow: { margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', fontSize: 12 },
  title: { margin: '0.2rem 0 0', fontSize: '2rem' },
  linkBtn: { color: '#111827', textDecoration: 'none', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 14px', background: '#fff' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '1rem', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)' },
  value: { fontSize: '2rem', fontWeight: 700, marginTop: 10 },
  grid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' },
  panel: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '1rem', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)' },
  list: { listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '0.75rem' },
  listItem: { border: '1px solid #e5e7eb', borderRadius: 10, padding: '0.9rem 1rem', background: '#f9fafb' },
  meta: { margin: '6px 0 0', color: '#4b5563' },
  profileRow: { display: 'flex', justifyContent: 'space-between', gap: '0.8rem', padding: '10px 0', borderBottom: '1px dashed #d1d5db' },
};

export default PatientDashboard;
