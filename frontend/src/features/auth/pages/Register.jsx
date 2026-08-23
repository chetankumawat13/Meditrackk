import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import './Register.css';

const initialForm = {
  role: 'buyer',
  fullname: '',
  contact: '',
  email: '',
  password: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  storeName: '',
  storeLicenseNumber: '',
  storeContact: '',
  storeEmail: '',
  storeAddress: '',
};

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useAuth();
  const [form, setForm] = useState(initialForm);

  const isSeller = form.role === 'seller';

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const account = await handleRegister(form);
      navigate(account?.role === 'store' ? '/seller' : '/buyer');
    } catch {
      // error is already reflected in redux state and shown below
    }
  }

  return (
    <div className="register-screen">
      <div className="register-container">
        <Link to="/" className="register-back">
          &larr; Back to site
        </Link>

        <div className="register-header">
          <h1>MediTrack</h1>
          <p>Digital Medication History &amp; Safety Monitoring</p>
        </div>

        <div className="register-tabs">
          <Link to="/login" className="register-tab-btn">
            Login
          </Link>
          <span className="register-tab-btn active">Register</span>
        </div>

        <div className="register-role-selector" aria-label="Registration type">
          <label className={isSeller ? '' : 'selected'}>
            <input type="radio" name="registerRole" value="buyer" checked={!isSeller} onChange={() => updateField('role', 'buyer')} />
            Register as Patient
          </label>
          <label className={isSeller ? 'selected' : ''}>
            <input type="radio" name="registerRole" value="seller" checked={isSeller} onChange={() => updateField('role', 'seller')} />
            Register Medical Store
          </label>
        </div>

        {error && <div className="form-banner-error">{error}</div>}

        <form className="register-form" onSubmit={onSubmit}>
          {isSeller ? <>
          <div className="form-group">
            <label htmlFor="regStoreName">Store Name</label>
            <input type="text" id="regStoreName" placeholder="Medical store name" value={form.storeName} onChange={(e) => updateField('storeName', e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regLicense">Store License Number</label>
            <input type="text" id="regLicense" placeholder="License number" value={form.storeLicenseNumber} onChange={(e) => updateField('storeLicenseNumber', e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regStoreContact">Store Contact</label>
            <input type="text" id="regStoreContact" placeholder="Store mobile number" value={form.storeContact} onChange={(e) => updateField('storeContact', e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regStoreEmail">Store Email</label>
            <input type="email" id="regStoreEmail" placeholder="Store email" value={form.storeEmail} onChange={(e) => updateField('storeEmail', e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="regStoreAddress">Store Address</label>
            <textarea id="regStoreAddress" rows="3" placeholder="Street, city, state" value={form.storeAddress} onChange={(e) => updateField('storeAddress', e.target.value)} />
          </div>
          </> : <>
          <div className="form-group">
            <label htmlFor="regFullname">Full Name</label>
            <input
              type="text"
              id="regFullname"
              placeholder="Your full name"
              value={form.fullname}
              onChange={(e) => updateField('fullname', e.target.value)}
              required
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="regContact">Mobile Number</label>
              <input
                type="text"
                id="regContact"
                placeholder="10-digit mobile number"
                value={form.contact}
                onChange={(e) => updateField('contact', e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="regDob">Date of Birth</label>
              <input
                type="date"
                id="regDob"
                value={form.dateOfBirth}
                onChange={(e) => updateField('dateOfBirth', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <div className="role-selector">
              <label className="role-radio">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={form.gender === 'female'}
                  onChange={(e) => updateField('gender', e.target.value)}
                  required
                />
                <span>Female</span>
              </label>
              <label className="role-radio">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={form.gender === 'male'}
                  onChange={(e) => updateField('gender', e.target.value)}
                />
                <span>Male</span>
              </label>
              <label className="role-radio">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={form.gender === 'other'}
                  onChange={(e) => updateField('gender', e.target.value)}
                />
                <span>Other</span>
              </label>
            </div>
          </div>
          </>}

          {!isSeller && <div className="form-group">
            <label htmlFor="regAddress">Address</label>
            <textarea
              id="regAddress"
              rows="3"
              placeholder="Street, city, state"
              value={form.address}
              onChange={(e) => updateField('address', e.target.value)}
              required
            />
          </div>}

          <div className="form-group">
            <label htmlFor="regEmail">Email</label>
            <input
              type="email"
              id="regEmail"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="regPassword">Password</label>
            <input
              type="password"
              id="regPassword"
              placeholder="Create password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
