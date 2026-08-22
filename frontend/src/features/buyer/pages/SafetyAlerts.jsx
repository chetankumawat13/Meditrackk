import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { usePatient } from '../hooks/usePatient.js';
import { getSafetyAlerts } from '../hooks/useSafetyAlerts.js';
import '../layout/BuyerLayout.css';
import './SafetyAlerts.css';

const SafetyAlerts = () => {
  const patient = usePatient();
  const purchases = useSelector((state) => state.dataReducer.purchases);

  const alerts = useMemo(() => {
    const patientPurchases = purchases.filter((p) => p.patientID === patient.id);
    return getSafetyAlerts(patientPurchases);
  }, [purchases, patient.id]);

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>AI Safety Alerts</h1>
      </div>

      {alerts.length === 0 ? (
        <p className="buyer-empty-state">No safety alerts at this time</p>
      ) : (
        <div className="alerts-container">
          {alerts.map((alert, idx) => (
            <div className={`alert-card alert-${alert.type}`} key={idx}>
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
