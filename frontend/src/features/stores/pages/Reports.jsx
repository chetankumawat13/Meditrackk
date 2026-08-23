import React from 'react';
import { Link } from 'react-router';

const reports = [
  { id: 'RPT-9001', medicine: 'Metformin', issue: 'Repeated use alert', status: 'Pending', severity: 'High' },
  { id: 'RPT-8998', medicine: 'Amlodipine', issue: 'Low stock check', status: 'Resolved', severity: 'Medium' },
];

const ReportsPage = () => (
  <div style={styles.page}>
    <div style={styles.topbar}>
      <div>
        <p style={styles.eyebrow}>Safety</p>
        <h1 style={styles.title}>Reports</h1>
      </div>
      <Link to="/dashboard" style={styles.linkBtn}>Back to dashboard</Link>
    </div>

    <div style={styles.list}>
      {reports.map((report) => (
        <div key={report.id} style={styles.card}>
          <div style={styles.headerRow}>
            <strong>{report.id}</strong>
            <span style={{ ...styles.badge, background: report.status === 'Pending' ? '#fff0cf' : '#eaffa8' }}>{report.status}</span>
          </div>
          <div style={styles.meta}>Medicine: {report.medicine}</div>
          <div style={styles.meta}>Issue: {report.issue}</div>
          <div style={styles.meta}>Severity: {report.severity}</div>
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
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  meta: { color: '#4b5563', marginBottom: 6 },
  badge: { display: 'inline-block', padding: '6px 10px', borderRadius: 999, fontWeight: 700, fontSize: 12, border: '1px solid rgba(17,24,39,0.2)' },
};

export default ReportsPage;
