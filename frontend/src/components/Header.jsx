import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';

const headerStyles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px clamp(16px, 4vw, 48px)',
    maxWidth: '1280px',
    margin: '0 auto',
    flexWrap: 'wrap',
    rowGap: '12px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    letterSpacing: '-0.02em',
    color: '#064e3b',
  },
  navLinks: {
    display: 'flex',
    gap: 'clamp(16px, 4vw, 32px)',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: '#374151',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
  },
  authButtons: {
    display: 'flex',
    gap: '16px',
  },
  loginBtn: {
    background: 'none',
    border: 'none',
    color: '#064e3b',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '10px 20px',
  },
  signupBtn: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '99px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
  },
  burgerButton: {
    border: 'none',
    background: 'transparent',
    color: '#064e3b',
    fontSize: '1.4rem',
    padding: '4px 8px',
    cursor: 'pointer',
  },
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, role, isAuthenticated } = useAuth();
  const isLoggedInLayout =
    location.pathname.startsWith('/user') ||
    location.pathname.startsWith('/collector') ||
    location.pathname.startsWith('/admin');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoToDashboard = () => {
    if (role === 'user') navigate('/user');
    else if (role === 'worker') navigate('/collector');
    else if (role === 'admin') navigate('/admin');
  };

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return (
      <nav style={headerStyles.nav}>
        <div
          style={headerStyles.logoContainer}
          onClick={() => navigate('/')}
        >
          <div style={headerStyles.logoIcon}>
            <img src="/logo_circle.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          <span style={headerStyles.logoText}>E- Konek</span>
        </div>
        {!isAuthenticated && (
          <>
            <div style={headerStyles.navLinks}>
              <button style={headerStyles.navLink} onClick={() => navigate('/features')}>Features</button>
              <button style={headerStyles.navLink} onClick={() => navigate('/pricing')}>Pricing</button>
              <button style={headerStyles.navLink} onClick={() => navigate('/about')}>About</button>
              <button style={headerStyles.navLink} onClick={() => navigate('/contact')}>Contact</button>
              <button style={headerStyles.navLink} onClick={() => navigate('/barangay-dashboard')}> Dashboard</button>
            </div>
            <div style={headerStyles.authButtons}>
              <button style={headerStyles.loginBtn} onClick={() => navigate('/login')}>Sign In</button>
              <button style={headerStyles.signupBtn} onClick={() => navigate('/login')}>
                Get Started <FiArrowRight />
              </button>
            </div>
          </>
        )}
        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#374151', fontSize: '0.95rem' }}>
              Welcome, {user?.name} ({role})
            </span>
            <button
              style={{
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={handleGoToDashboard}
            >
              Dashboard
            </button>
            <button
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    );
  }

  return (
    <nav style={{ ...headerStyles.nav, flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div
          style={headerStyles.logoContainer}
          onClick={() => navigate('/')}
        >
          <div style={headerStyles.logoIcon}>
            <img src="/logo_circle.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '50%' }} />
          </div>
          <span style={headerStyles.logoText}>E- Konek</span>
        </div>
        {!isAuthenticated && (
          <button
            type="button"
            style={headerStyles.burgerButton}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
        {isAuthenticated && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#374151', fontSize: '0.8rem' }}>
              {user?.name}
            </span>
            <button
              style={{
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={handleGoToDashboard}
            >
              Dashboard
            </button>
            <button
              style={{
                backgroundColor: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {!isLoggedInLayout && menuOpen && (
        <div style={{ width: '100%', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ ...headerStyles.navLinks, flexDirection: 'column', gap: '8px' }}>
            <button
              style={headerStyles.navLink}
              onClick={() => {
                navigate('/features');
                setMenuOpen(false);
              }}
            >
              Features
            </button>
            <button style={headerStyles.navLink} onClick={() => { navigate('/pricing'); setMenuOpen(false); }}>Pricing</button>
            <button style={headerStyles.navLink} onClick={() => { navigate('/about'); setMenuOpen(false); }}>About</button>
            <button style={headerStyles.navLink} onClick={() => { navigate('/contact'); setMenuOpen(false); }}>Contact</button>
            <button style={headerStyles.navLink} onClick={() => { navigate('/barangay-dashboard'); setMenuOpen(false); }}>📊 Dashboard</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              style={{ ...headerStyles.loginBtn, padding: '10px 0' }}
              onClick={() => {
                navigate('/login');
                setMenuOpen(false);
              }}
            >
              Sign In
            </button>
            <button
              style={{ ...headerStyles.signupBtn, width: '100%', justifyContent: 'center' }}
              onClick={() => {
                navigate('/login');
                setMenuOpen(false);
              }}
            >
              Get Started <FiArrowRight />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
