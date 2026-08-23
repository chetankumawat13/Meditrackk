import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import { getSafetyAlerts } from '../hooks/useSafetyAlerts.js';
import { fetchAIMedicationAlerts, triggerAIMedicationCheck } from '../api/buyer.api.js';
import '../layout/BuyerLayout.css';
import './SafetyAlerts.css';

const SafetyAlerts = () => {
  const patient = usePatient();
  const purchases = useSelector((state) => state.dataReducer.purchases);
  const [aiAlerts, setAiAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  async function loadAlerts() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAIMedicationAlerts();
      setAiAlerts(data.alerts || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load notification alerts');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    loadAlerts().catch(() => {
      if (active) setError('Unable to load notification alerts');
    });
    return () => { active = false; };
  }, []);

  const localAlerts = useMemo(() => {
    const patientPurchases = purchases.filter((p) => p.patientID === patient.id);
    return getSafetyAlerts(patientPurchases);
  }, [purchases, patient.id]);

  const medicineIds = useMemo(() => (
    [...new Set(purchases
      .filter((purchase) => purchase.patientID === patient.id)
      .flatMap((purchase) => purchase.items.map((item) => item.medicineID)))]
  ), [purchases, patient.id]);

  async function checkAllMedicines() {
    if (medicineIds.length === 0) return;
    setChecking(true);
    setError('');
    try {
      await Promise.all(medicineIds.map((medicineId) => triggerAIMedicationCheck(medicineId)));
      await loadAlerts();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to run medication checks');
    } finally {
      setChecking(false);
    }
  }

  const alerts = [
    ...aiAlerts.map((alert) => ({
      type: alert.severity === 'high' ? 'danger' : 'warning',
      icon: alert.severity === 'high' ? '!' : 'i',
      title: alert.title,
      description: alert.message,
    })),
    ...localAlerts,
  ];

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>AI Safety Alerts</h1>
        <div className="buyer-section-controls">
          <button className="btn btn-small" onClick={loadAlerts} disabled={loading || checking}>
            Refresh Alerts
          </button>
          <button className="btn btn-small" onClick={checkAllMedicines} disabled={!medicineIds.length || loading || checking}>
            {checking ? 'Checking Medicines...' : 'Check All Medicines'}
          </button>
        </div>
      </div>

      {error && <p className="buyer-error-state">{error}</p>}
      {loading ? (
        <p className="buyer-empty-state">Loading notification alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="buyer-empty-state">No safety alerts at this time</p>
      ) : (
        <div className="alerts-container">
          {alerts.map((alert, idx) => (
            <div className={`alert-card alert-${alert.type}`} key={alert.id || `${alert.title}-${idx}`}>
              <div className="alert-icon">{alert.icon}</div>
              <div className="alert-content">
                <h3>{alert.title}</h3>
                <p>{alert.description}</p>
                <p className="alert-disclaimer">
                  This is an informational alert. Please consult with a healthcare professional for medical advice.
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default SafetyAlerts;
