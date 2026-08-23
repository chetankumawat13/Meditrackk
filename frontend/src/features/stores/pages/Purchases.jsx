import React from 'react';
import { Link } from 'react-router';

const purchases = [
  { id: 'TXN-1024', patient: 'Rahul Verma', total: 1280, date: '2026-08-21', status: 'Completed' },
  { id: 'TXN-1021', patient: 'Mona Shah', total: 840, date: '2026-08-20', status: 'Completed' },
  { id: 'TXN-1018', patient: 'Karan Singh', total: 920, date: '2026-08-18', status: 'Pending' },
];

const PurchasesPage = () => (
  <div style={styles.page}>
    <div style={styles.topbar}>
      <div>
        <p style={styles.eyebrow}>Transactions</p>
        <h1 style={styles.title}>Purchases</h1>
      </div>
      <Link to="/dashboard" style={styles.linkBtn}>Back to dashboard</Link>
    </div>

    <div style={styles.list}>
      {purchases.map((sale) => (
        <div key={sale.id} style={styles.card}>
          <div style={styles.row}>
            <strong>{sale.id}</strong>
            <span style={{ ...styles.badge, background: sale.status === 'Completed' ? '#eaffa8' : '#fff0cf' }}>{sale.status}</span>
          </div>
          <div style={styles.meta}>Patient: {sale.patient}</div>
          <div style={styles.meta}>Date: {sale.date}</div>
          <div style={styles.amount}>₹ {sale.total}</div>
        </div>
      ))}
    </div>
  </div>
);

const styles = {
  page: { padding: '2rem', maxWidth: 1100, margin: '0 auto', fontFamily: 'sans-serif' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  eyebrow: { margin: 0, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6b7280', fontSize: 12 },
  title: { margin: '0.2rem 0 0', fontSize: '2rem' },
  linkBtn: { color: '#111827', textDecoration: 'none', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 14px', background: '#fff' },
  list: { display: 'grid', gap: '1rem' },
  card: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '1rem 1.1rem', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  meta: { color: '#4b5563', marginBottom: 6 },
  amount: { fontSize: '1.5rem', fontWeight: 700, marginTop: 8 },
  badge: { display: 'inline-block', padding: '6px 10px', borderRadius: 999, fontWeight: 700, fontSize: 12, border: '1px solid rgba(17,24,39,0.2)' },
};

export default PurchasesPage;
