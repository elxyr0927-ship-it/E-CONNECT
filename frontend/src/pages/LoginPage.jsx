import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const role = activeTab === 'user' ? 'user' : activeTab === 'worker' ? 'worker' : 'admin';

    try {


      await login({ role, username, password });
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate(role === 'user' ? '/user' : '/collector');
      }
    } catch (error) {
      alert(error.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-hero">
          <div className="login-logo-circle">E</div>
          <h1 className="login-title">E-Konek</h1>
          <p className="login-subtitle">
            Sign in to track collections, manage pickups, and keep your community clean.
          </p>
        </div>
        <div className="login-box">
          <button
            type="button"
            className="login-back-button"
            onClick={() => navigate('/')}
          >
            ← Back to landing
          </button>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'user' ? 'active' : ''}`}
              onClick={() => setActiveTab('user')}
            >
              User Login
            </button>
            <button
              className={`tab ${activeTab === 'worker' ? 'active' : ''}`}
              onClick={() => setActiveTab('worker')}
            >
              Worker Login
            </button>
            <button
              className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveTab('admin')}
            >
              Admin Login
            </button>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            <h2 className="login-form-title">
              {activeTab === 'user' ? 'User Login' : activeTab === 'worker' ? 'Worker Login' : 'Admin Login'}
            </h2>
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
            <button type="submit" className="login-button">Login</button>
            <p className="login-hint">
              <strong>Demo Credentials:</strong><br />
              User: <code>user / password</code><br />
              Freelancer: <code>worker / password</code><br />
              Gov Driver: <code>gov_driver / password</code><br />
              Admin: <code>admin / password</code>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
