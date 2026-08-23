import React from 'react';
import { Link } from 'react-router';

const medicines = [
  { name: 'Amlodipine', stock: 84, price: 120, expiry: '2026-11-20', status: 'Healthy' },
  { name: 'Metformin', stock: 12, price: 75, expiry: '2026-09-14', status: 'Low stock' },
  { name: 'Paracetamol', stock: 210, price: 32, expiry: '2027-02-02', status: 'Healthy' },
  { name: 'Cough Syrup', stock: 8, price: 95, expiry: '2026-08-30', status: 'Low stock' },
];

const InventoryPage = () => {
  return (
    <div style={styles.page}>
      <div style={styles.topbar}>
        <div>
          <p style={styles.eyebrow}>Store operations</p>
          <h1 style={styles.title}>Inventory</h1>
        </div>
        <div style={styles.actions}>
          <Link to="/dashboard" style={styles.linkBtn}>Back to dashboard</Link>
          <button style={styles.primaryBtn}>+ Add medicine</button>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Medicine</th>
              <th style={styles.th}>Stock</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Expiry</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((item) => (
              <tr key={item.name}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{item.stock}</td>
                <td style={styles.td}>₹ {item.price}</td>
                <td style={styles.td}>{item.expiry}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    background: item.status === 'Low stock' ? '#fff0cf' : '#eaffa8',
                  }}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '2rem', fontFamily: 'sans-serif', maxWidth: 1100, margin: '0 auto' },
  topbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  eyebrow: { margin: 0, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.12em', fontSize: 12 },
  title: { margin: '0.2rem 0 0', fontSize: '2rem' },
  actions: { display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' },
  linkBtn: { color: '#111827', textDecoration: 'none', border: '1px solid #d1d5db', borderRadius: 10, padding: '10px 14px', background: '#fff' },
  primaryBtn: { border: 'none', borderRadius: 10, background: '#D6FF3F', color: '#111827', fontWeight: 700, padding: '10px 16px', cursor: 'pointer' },
  tableWrap: { background: '#fff', border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 18px rgba(15, 23, 42, 0.04)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', background: '#f3f4f6', padding: '14px 16px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#374151' },
  td: { padding: '14px 16px', borderTop: '1px solid #e5e7eb', fontSize: 14 },
  badge: { display: 'inline-block', padding: '6px 10px', borderRadius: 999, fontWeight: 700, fontSize: 12, border: '1px solid rgba(17,24,39,0.2)' },
};

export default InventoryPage;
