import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Modal from '../../shared/components/Modal.jsx';
import { addPatient } from '../../shared/state/data.slice.js';

const CreatePatientModal = ({ open, onClose, onCreated }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  function onSubmit(e) {
    e.preventDefault();

    const newPatient = {
      id: 'P-' + Date.now(),
      name,
      mobile,
      email: `${name.replace(/\s/g, '').toLowerCase()}@patient.com`,
    };

    dispatch(addPatient(newPatient));
    setName('');
    setMobile('');
    onCreated?.(newPatient);
    onClose?.();
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2>Create New Patient</h2>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="newPatientName">Patient Name *</label>
          <input
            type="text"
            id="newPatientName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPatientMobile">Mobile Number *</label>
          <input
            type="text"
            id="newPatientMobile"
            placeholder="10-digit number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Create Patient
        </button>
      </form>
    </Modal>
  );
};

export default CreatePatientModal;
