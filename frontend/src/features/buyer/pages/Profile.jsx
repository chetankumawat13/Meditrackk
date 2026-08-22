import React from 'react';
import { usePatient } from '../hooks/usePatient.js';
import '../layout/BuyerLayout.css';
import './Profile.css';

const Profile = () => {
  const patient = usePatient();

  return (
    <section className="buyer-container">
      <div className="buyer-page-header">
        <h1>Your Profile</h1>
      </div>

      <div className="profile-panel">
        <h2>Personal Information</h2>
        <div className="profile-info-row">
          <span>Name:</span>
          <span>{patient.name}</span>
        </div>
        <div className="profile-info-row">
          <span>Patient ID:</span>
          <span>{patient.id}</span>
        </div>
        <div className="profile-info-row">
          <span>Mobile:</span>
          <span>{patient.mobile}</span>
        </div>
        <div className="profile-info-row">
          <span>Email:</span>
          <span>{patient.email}</span>
        </div>
      </div>
    </section>
  );
};

export default Profile;
