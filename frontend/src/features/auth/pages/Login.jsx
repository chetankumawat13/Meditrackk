import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useAuth();

  const [role, setRole] = useState('buyer');
  const [form, setForm] = useState({ email: '', password: '' });

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await handleLogin({ email: form.email, password: form.password });
      navigate('/');
    } catch {
      // error is already reflected in redux state and shown below
    }
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <Link to="/" className="login-back">
          &larr; Back to site
        </Link>

        <div className="login-header">
          <h1>MediTrack</h1>
          <p>Digital Medication History &amp; Safety Monitoring</p>
        </div>

        <div className="login-tabs">
          <span className="login-tab-btn active">Login</span>
          <Link to="/register" className="login-tab-btn">
            Register
          </Link>
        </div>

        <div className="role-selector">
          <label className="role-radio">
            <input
              type="radio"
              name="loginRole"
              value="buyer"
              checked={role === 'buyer'}
              onChange={() => setRole('buyer')}
            />
            <span>Patient / Buyer</span>
          </label>
          <label className="role-radio">
            <input
              type="radio"
              name="loginRole"
              value="seller"
              checked={role === 'seller'}
              onChange={() => setRole('seller')}
            />
            <span>Medical Store / Seller</span>
          </label>
        </div>

        {error && <div className="form-banner-error">{error}</div>}

        <form className="login-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="loginEmail">Email or Mobile Number</label>
            <input
              type="text"
              id="loginEmail"
              placeholder="Enter email or mobile"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-demo-credentials">
          <p>
            <strong>Demo Accounts:</strong>
          </p>
          <p>
            <strong>Buyer:</strong> rahul@example.com / password
          </p>
          <p>
            <strong>Seller:</strong> pharmacy@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
