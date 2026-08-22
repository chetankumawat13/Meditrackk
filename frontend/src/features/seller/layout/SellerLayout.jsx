import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth.js';
import ApiDataLoader from '../../shared/components/ApiDataLoader.jsx';
import './SellerLayout.css';

const links = [
  { to: '/seller', label: 'Dashboard', end: true },
  { to: '/seller/inventory', label: 'Inventory' },
  { to: '/seller/add-medicine', label: 'Add Medicine' },
  { to: '/seller/new-sale', label: 'New Sale' },
  { to: '/seller/patients', label: 'Patients' },
  { to: '/seller/sales', label: 'Sales History' },
  { to: '/seller/reports', label: 'Reports' },
];

const SellerLayout = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();
  const { handleLogout } = useAuth();

  function onLogout() {
    handleLogout();
    setNavOpen(false);
    navigate('/');
  }

  return (
    <div className="seller-screen">
      <ApiDataLoader />
      <nav className="seller-navbar">
        <div className="seller-navbar-brand">MediTrack - Store</div>
        <button
          className="seller-navbar-toggle"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((open) => !open)}
        >
          &#9776;
        </button>
        <div className={`seller-navbar-menu ${navOpen ? 'nav-open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `seller-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setNavOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <button className="seller-nav-btn logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default SellerLayout;
