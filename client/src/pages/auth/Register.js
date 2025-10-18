import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import heroImage from '../../assets/images/hero.png';
import '../../assets/styles/Login.css';
 // Optional: reuse if needed

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    department: '',
    year_of_study: '',
    study_style: '',
    availability: '',
    profile_picture: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profile_picture') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      for (const key in formData) {
        data.append(key, formData[key]);
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      setSuccess(result.message);
      setError('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="header">
        <div className="logo">📘 StudyBuddy</div>
        <nav className="nav-links">
          <a href="/#features">Features</a>
          <a href="/#how">How It Works</a>
          <a href="/#contact">Contact</a>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="btn login">Login</Link>
          <Link to="/register" className="btn register">Register</Link>
        </div>
      </header>

      {/* Register Form */}
      <main className="auth-container">
        <h2>Create an Account</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input type="text" name="full_name" placeholder="Full Name" required onChange={handleChange} />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <input type="text" name="department" placeholder="Department" onChange={handleChange} />
          <input type="number" name="year_of_study" placeholder="Year of Study" onChange={handleChange} />
          
          <select name="study_style" required onChange={handleChange}>
            <option value="">Select Study Style</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="visual">Visual</option>
            <option value="auditory">Auditory</option>
            <option value="reading/writing">Reading/Writing</option>
          </select>

          <input type="text" name="availability" placeholder="Availability (e.g., Weekdays 6–9pm)" onChange={handleChange} />
          <input type="file" name="profile_picture" accept="image/*" onChange={handleChange} />

          <button type="submit" className="btn primary">Register</button>
        </form>

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </main>

      {/* Footer */}
      <footer className="footer">
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

export default Register;
