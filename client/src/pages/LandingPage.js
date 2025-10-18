import React from 'react';
import heroImage from '../assets/images/hero.png';
import { Link } from 'react-router-dom';
import '../assets/styles/Landing.css';
 // Replace with actual image

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">📘 StudyBuddy</div>
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="auth-buttons">
  <Link to="/login" className="btn login">Login</Link>
  <Link to="/register" className="btn register">Register</Link>
</div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Find Your Perfect Study Group — Anytime, Anywhere.</h1>
          <p>Connect with students, plan sessions, and study smarter together.</p>
          <div className="hero-buttons">
            <button className="btn primary">Join Now — It’s Free</button>
            <button className="btn secondary">See How It Works</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Students studying" />
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <h2>What You Can Do</h2>
        <div className="feature-cards">
          <div className="card">👩‍🎓<h3>Find Study Groups</h3><p>Match with students taking the same course</p></div>
          <div className="card">🗓️<h3>Plan Study Sessions</h3><p>Schedule and get reminders</p></div>
          <div className="card">💬<h3>Chat Instantly</h3><p>Discuss topics with your group</p></div>
          <div className="card">🔔<h3>Smart Notifications</h3><p>Stay updated with group activities</p></div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" id="how">
        <h2>How It Works</h2>
        <div className="steps">
          <div>📝 <strong>Create a Profile</strong></div>
          <div>🔍 <strong>Join or Create a Study Group</strong></div>
          <div>🎯 <strong>Study, Chat & Succeed</strong></div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-banner">
        <h2>Ready to Study Smarter?</h2>
        <Link to="/register" className="btn cta">Sign Up Free</Link>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <p>StudyBuddy © 2025</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms</a> | <a href="#">Contact</a>
        </div>
        <div className="social-icons">
          <a href="#">📸</a>
          <a href="#">🐦</a>
          <a href="#">💼</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
