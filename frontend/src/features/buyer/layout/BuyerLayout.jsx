import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth.js';
import ApiDataLoader from '../../shared/components/ApiDataLoader.jsx';
import './BuyerLayout.css';

const links = [
  { to: '/buyer', label: 'Dashboard', end: true },
  { to: '/buyer/history', label: 'Medication History' },
  { to: '/buyer/alerts', label: 'Safety Alerts' },
  { to: '/buyer/prescriptions', label: 'Prescriptions' },
  { to: '/buyer/share', label: 'Share History' },
  { to: '/buyer/reports', label: 'Reports' },
  { to: '/buyer/profile', label: 'Profile' },
];

const BuyerLayout = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  function onLogout() {
    handleLogout();
    setNavOpen(false);
    navigate('/');
  }

  return (
    <div className="buyer-screen">
      <ApiDataLoader />
      <nav className="buyer-navbar">
        <div className="buyer-navbar-brand">MediTrack</div>
        <button
          className="buyer-navbar-toggle"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((open) => !open)}
        >
          &#9776;
        </button>
        <div className={`buyer-navbar-menu ${navOpen ? 'nav-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `buyer-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="buyer-nav-btn logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default BuyerLayout;
