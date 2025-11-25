import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState('user');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    const role = accountType === 'user' ? 'user' : 'worker';

    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role,
          username,
          password,
          name: fullName,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok || !data) {
        const message = data && data.message ? data.message : 'Sign up failed. Please try again.';
        alert(message);
        return;
      }

      const user = data.user;

      localStorage.setItem('isLoggedIn', 'true');
      if (role === 'worker') {
        localStorage.setItem('workerName', user.name);
        navigate('/collector');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/user');
      }
    } catch (error) {
      alert('Unable to sign up. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-hero">
          <div className="login-logo-circle">E</div>
          <h1 className="login-title">Join E-Konek</h1>
          <p className="login-subtitle">
            Create an account to start tracking pickups, earning rewards, and keeping your city clean.
          </p>
        </div>
        <div className="login-box">
          <button
            type="button"
            className="login-back-button"
            onClick={() => navigate('/')}
          >
            Back to landing
          </button>
          <div className="tabs">
            <button
              type="button"
              className={`tab ${accountType === 'user' ? 'active' : ''}`}
              onClick={() => setAccountType('user')}
            >
              User account
            </button>
            <button
              type="button"
              className={`tab ${accountType === 'worker' ? 'active' : ''}`}
              onClick={() => setAccountType('worker')}
            >
              Worker account
            </button>
          </div>
          <form onSubmit={handleSignup} className="login-form">
            <h2 className="login-form-title">
              {accountType === 'user' ? 'Create your user account' : 'Create your worker account'}
            </h2>
            <div className="input-group">
              <label htmlFor="fullName">Full name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-button">Sign up</button>
            <p className="login-hint">
              Already have an account?{' '}
              <span
                style={{ color: '#047857', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => navigate('/login')}
              >
                Log in
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
