import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import DUMAGUETE_BARANGAYS from '../data/barangays';

const SignupPage = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [barangay, setBarangay] = useState('');
  const [isWorker, setIsWorker] = useState(false);
  const [workerType, setWorkerType] = useState('freelancer');
  const [idFile, setIdFile] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (isWorker && !idFile) {
      alert('Please upload a valid ID to join as an Eco-Warrior.');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          name: fullName,
          barangay: barangay || 'Poblacion 1', // Default if not selected
          role: isWorker ? 'worker' : 'user',
          workerType: isWorker ? workerType : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Account created! ${isWorker ? 'Your application as an Eco-Warrior is pending review.' : 'Welcome to E-Konek!'}`);
        navigate('/login');
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('An error occurred during signup.');
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
            ← Back to landing
          </button>
          <form onSubmit={handleSignup} className="login-form">
            <h2 className="login-form-title">Create your account</h2>

            {/* Worker Toggle */}
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isWorker}
                  onChange={(e) => setIsWorker(e.target.checked)}
                  style={{ width: '20px', height: '20px' }}
                />
                <span style={{ fontWeight: '600', color: '#166534' }}>Join as Eco-Warrior (Freelancer)</span>
              </label>

              {isWorker && (
                <div style={{ marginTop: '12px', padding: '0 8px' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>Worker Type:</p>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="workerType"
                        value="freelancer"
                        checked={workerType === 'freelancer'}
                        onChange={(e) => setWorkerType(e.target.value)}
                      />
                      <span style={{ fontSize: '0.9rem', color: '#15803d' }}>Freelancer (Eco-Warrior)</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="workerType"
                        value="government"
                        checked={workerType === 'government'}
                        onChange={(e) => setWorkerType(e.target.value)}
                      />
                      <span style={{ fontSize: '0.9rem', color: '#15803d' }}>Government (LGU)</span>
                    </label>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                    {workerType === 'freelancer'
                      ? 'Earn money by collecting bulk waste and recyclables.'
                      : 'Official government collector for scheduled routes.'}
                  </p>
                </div>
              )}
            </div>

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

            {/* Barangay Selector - Only for regular users */}
            {!isWorker && (
              <div className="input-group">
                <label htmlFor="barangay">Barangay</label>
                <select
                  id="barangay"
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select your barangay...</option>
                  {DUMAGUETE_BARANGAYS.map((brgy) => (
                    <option key={brgy} value={brgy}>
                      {brgy}
                    </option>
                  ))}
                </select>
              </div>
            )}

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

            {/* ID Upload for Workers */}
            {isWorker && (
              <div className="input-group">
                <label htmlFor="idUpload">Upload Valid ID (License/National ID)</label>
                <input
                  type="file"
                  id="idUpload"
                  accept="image/*"
                  onChange={(e) => setIdFile(e.target.files[0])}
                  style={{ padding: '8px 0' }}
                />
              </div>
            )}

            <button type="submit" className="login-button">
              {isWorker ? 'Submit Application' : 'Sign up'}
            </button>
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
      </div >
    </div >
  );
};

export default SignupPage;
