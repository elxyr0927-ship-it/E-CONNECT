import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import usersData from '../users.json';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const userList = activeTab === 'user' ? usersData.users : usersData.workers;
    const user = userList.find(u => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      if (activeTab === 'worker') {
        localStorage.setItem('workerName', user.name);
      }
      navigate(activeTab === 'user' ? '/user' : '/collector');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
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
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <h2>{activeTab === 'user' ? 'User Login' : 'Worker Login'}</h2>
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
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
