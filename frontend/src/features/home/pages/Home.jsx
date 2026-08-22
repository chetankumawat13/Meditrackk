import React, { useState } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import './Home.css';

const Home = () => {
  const [navOpen, setNavOpen] = useState(false);
  const { user } = useSelector((state) => state.authReducer);

  return (
    <div className="home-screen">
      <nav className="home-navbar">
        <div className="home-nav-brand">
          <span className="home-dot"></span>MEDITRACK
        </div>
        <button
          className="home-nav-toggle"
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((open) => !open)}
        >
          &#9776;
        </button>
        <div className={`home-nav-menu ${navOpen ? 'nav-open' : ''}`}>
          <a className="home-nav-link active" href="#home">
            Home
          </a>
          <a className="home-nav-link" href="#features">
            Features
          </a>
          <a className="home-nav-link" href="#how">
            How It Works
          </a>
          <a className="home-nav-link" href="#about">
            About
          </a>
          <div className="home-nav-auth">
            {user ? (
              <span className="home-nav-greeting">Hi, {user.fullname || user.name}</span>
            ) : (
              <>
                <Link className="btn btn-small" to="/login">
                  Login
                </Link>
                <Link className="btn btn-small btn-primary" to="/register">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <header className="home-hero" id="home">
        <div className="home-hero-content">
          <span className="home-eyebrow">Digital Health &middot; Medication Safety</span>
          <h1>
            YOUR MEDICINE HISTORY,
            <br />
            FINALLY IN ONE PLACE.
          </h1>
          <p className="home-hero-sub">
            MediTrack connects patients and medical stores so every purchase is recorded
            automatically. No more lost bills, no more forgetting what you took last month
            &mdash; and an AI safety net quietly watching for patterns worth a doctor&rsquo;s
            attention.
          </p>
          <div className="home-hero-cta">
            <Link className="btn btn-primary btn-large" to="/register">
              Get Started Free
            </Link>
            <a className="btn btn-large" href="#how">
              See How It Works
            </a>
          </div>
          <div className="home-trust-chips">
            <span className="home-chip">🤖 AI Monitored</span>
            <span className="home-chip">🔒 Privacy-First Sharing</span>
            <span className="home-chip">📵 Works Without a Smartphone</span>
          </div>
        </div>

        <div className="home-hero-visual">
          <div className="home-mockup-card">
            <div className="home-mockup-card-head">
              <span className="home-mockup-dot"></span> Medication History
            </div>
            <div className="home-mockup-row">
              <strong>Amlodipine</strong>
              <span>30 tabs</span>
            </div>
            <div className="home-mockup-row muted">RX10003 &middot; 10 days ago</div>
            <div className="home-mockup-row">
              <strong>Metformin</strong>
              <span>60 tabs</span>
            </div>
            <div className="home-mockup-row muted">RX10002 &middot; 30 days ago</div>
          </div>
          <div className="home-mockup-alert">
            <span>⚠️</span>
            <div>
              <strong>Long-term usage detected</strong>
              <p>Consult your doctor for a review.</p>
            </div>
          </div>
        </div>
      </header>

      <section className="home-split-section">
        <div className="home-page-header">
          <h2>BUILT FOR BOTH SIDES OF THE COUNTER</h2>
          <p>One platform, two experiences &mdash; kept perfectly in sync.</p>
        </div>
        <div className="home-split-cards">
          <div className="home-split-card home-split-lime">
            <div className="home-split-icon">🧑‍⚕️</div>
            <h3>For Patients</h3>
            <ul>
              <li>Automatic digital medication timeline</li>
              <li>Printable receipts for every purchase</li>
              <li>AI safety alerts on your patterns</li>
              <li>Share history with a doctor via a code</li>
            </ul>
            <Link className="btn btn-primary" to="/register">
              Join as a Patient
            </Link>
          </div>
          <div className="home-split-card home-split-pink">
            <div className="home-split-icon">🏪</div>
            <h3>For Medical Stores</h3>
            <ul>
              <li>Full inventory &amp; stock tracking</li>
              <li>Fast checkout with instant receipts</li>
              <li>Patient search by ID or mobile</li>
              <li>Low-stock &amp; expiry alerts</li>
            </ul>
            <Link className="btn btn-secondary" to="/register">
              Register a Store
            </Link>
          </div>
        </div>
      </section>

      <section className="home-why-section" id="features">
        <div className="home-page-header">
          <h2>WHY IT MATTERS</h2>
        </div>
        <div className="home-why-grid">
          <div className="home-why-card">
            <div className="home-why-icon">🩺</div>
            <h3>Continuity of Care</h3>
            <p>Show any doctor or pharmacy your full history instantly &mdash; no old bills, no guessing.</p>
          </div>
          <div className="home-why-card">
            <div className="home-why-icon">🛡️</div>
            <h3>An AI Safety Net</h3>
            <p>
              Patterns like long-term or repeated usage get flagged for a professional to review
              &mdash; never diagnosed, never prescribed.
            </p>
          </div>
          <div className="home-why-card">
            <div className="home-why-icon">📶</div>
            <h3>No Phone? No Problem</h3>
            <p>Stores can create a record from just a mobile number, so nobody&rsquo;s history is lost.</p>
          </div>
        </div>
      </section>

      <section className="home-cta-banner" id="how">
        <h2>READY TO SEE IT IN ACTION?</h2>
        <p>Create an account and start building your medication history today.</p>
        <div className="home-hero-cta center">
          <Link className="btn btn-primary btn-large" to="/register">
            Get Started Free
          </Link>
          <Link className="btn btn-large" to="/login">
            I Already Have an Account
          </Link>
        </div>
      </section>

      <footer className="home-footer" id="about">
        <div className="home-footer-top">
          <div className="home-nav-brand home-footer-brand">
            <span className="home-dot"></span>MEDITRACK
          </div>
          <div className="home-footer-links">
            <a className="home-nav-link" href="#home">
              Home
            </a>
            <a className="home-nav-link" href="#features">
              Features
            </a>
            <a className="home-nav-link" href="#how">
              How It Works
            </a>
          </div>
          <div className="home-hero-cta">
            <Link className="btn btn-small" to="/login">
              Login
            </Link>
            <Link className="btn btn-small btn-primary" to="/register">
              Get Started
            </Link>
          </div>
        </div>
        <p className="home-footer-fine">
          Frontend prototype &middot; not a substitute for professional medical advice.
        </p>
      </footer>
    </div>
  );
};

export default Home;
