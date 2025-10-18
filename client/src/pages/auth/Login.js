import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../../assets/styles/Login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const text = await response.text();  // 👈 fallback to text
      throw new Error(text || 'Login failed');
    }

    const data = await response.json(); // Only parse JSON if response is OK

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    setSuccess('Login successful!');
    setError('');

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);

  } catch (err) {
    console.error('Login error:', err);
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

      {/* Login Form */}
      <main className="auth-container">
        <h2>Login to Your Account</h2>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <button type="submit" className="btn primary">Login</button>
        </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
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

export default Login;
