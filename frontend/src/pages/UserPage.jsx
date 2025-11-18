import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FiActivity, FiGift, FiHome, FiLogOut, FiUser } from 'react-icons/fi';
import { SocketContext } from '../context/socket';
import truckIconUrl from '../assets/truck.png';
import userIconUrl from '../assets/user.png';
import { getUserData, getPickupHistory } from '../services/apiService';

const center = [9.3068, 123.3054]; // Dumaguete City

const TruckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40],
});

const UserIcon = new L.Icon({
  iconUrl: userIconUrl,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const LocationMarker = ({ position, icon }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [map, position]);

  return position === null ? null : <Marker position={position} icon={icon} />;
};

const ManualLocationSelector = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      if (onSelect) {
        onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};


const FALLBACK_USER = {
  name: 'Juan Dela Cruz',
  points: 3250,
  completedPickups: 14,
  scheduledPickups: 3,
  weeklyPoints: 120,
  membership: 'Eco Citizen Pro',
  district: 'Barangay Bantayan',
};

const FALLBACK_ACTIVITIES = [
  { id: 1, title: 'Plastic recycling pickup', date: 'Nov 18, 2025', points: 50, icon: '♻️', location: 'Barangay 3' },
  { id: 2, title: 'Paper recycling pickup', date: 'Nov 17, 2025', points: 30, icon: '📄', location: 'Barangay Bantayan' },
  { id: 3, title: 'Glass recycling pickup', date: 'Nov 15, 2025', points: 40, icon: '🍶', location: 'Barangay Daro' },
];

const FALLBACK_REWARDS = [
  { id: 1, name: 'Compostable Bags', points: 500, description: 'Set of 10 compostable bags' },
  { id: 2, name: 'Ride Credits', points: 1000, description: '₱100 transportation credits' },
  { id: 3, name: 'Eco-friendly Bottle', points: 1500, description: 'Stainless steel water bottle' },
];


const UserPage = () => {
  const socket = useContext(SocketContext);
  const [truckPosition, setTruckPosition] = useState(center);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [pickupPosition, setPickupPosition] = useState(null);
  const [pickupStatus, setPickupStatus] = useState(null);
  const [collectorName, setCollectorName] = useState('');
  const [pickupPoints, setPickupPoints] = useState(0);
  const [userData, setUserData] = useState(FALLBACK_USER);
  const [activityHistory, setActivityHistory] = useState(FALLBACK_ACTIVITIES);
  const [rewards, setRewards] = useState(FALLBACK_REWARDS);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const notificationTimers = useRef([]);
  const [notifications, setNotifications] = useState([]);

  const notificationColors = {
    success: '#16a34a',
    warning: '#f97316',
    error: '#dc2626',
  };

  const addNotification = useCallback((message, tone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setNotifications((prev) => [...prev, { id, message, tone }]);
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.filter((note) => note.id !== id));
    }, 4000);
    notificationTimers.current.push(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    addNotification('Logging you out…', 'warning');
    setTimeout(() => {
      window.location.href = '/login';
    }, 600);
  };

  const handleRedeem = (rewardId) => {
    const reward = rewards.find((item) => item.id === rewardId);
    if (!reward) return;
    if (userData.points < reward.points) {
      addNotification('You need more eco points to redeem this reward.', 'warning');
      return;
    }

    setUserData((prev) => ({ ...prev, points: prev.points - reward.points }));
    setRedeemedRewards((prev) => [...prev, reward]);
    setActivityHistory((prev) => [
      {
        id: Date.now(),
        title: `Redeemed ${reward.name}`,
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        points: reward.points * -1,
        icon: '🎁',
        location: 'Rewards Center',
      },
      ...prev,
    ]);
    addNotification(`Successfully redeemed ${reward.name}!`, 'success');
  };

  useEffect(() => () => {
    notificationTimers.current.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.id = 'user-page-responsive';
    styleElement.textContent = `
      @keyframes userPageSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @media (max-width: 768px) {
        .user-page__hero { grid-template-columns: 1fr !important; }
        .user-page__hero-stats { grid-template-columns: 1fr !important; }
        .user-page__grid { grid-template-columns: 1fr !important; }
        .user-page__map-card { padding: 16px !important; }
        .user-page__map { height: 320px !important; }
        .user-page__activity-item { flex-direction: column !important; align-items: flex-start !important; }
        .user-page__nav { flex-wrap: wrap; gap: 12px; height: auto; padding: 12px 16px; }
      }
    `;
    document.head.appendChild(styleElement);
    return () => {
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const hasApi = Boolean(import.meta.env.VITE_API_BASE_URL);
        if (hasApi) {
          const [loadedUser, history] = await Promise.all([
            getUserData('demo-user'),
            getPickupHistory('demo-user'),
          ]);
          if (!isMounted) return;
          if (loadedUser) {
            setUserData((prev) => ({ ...prev, ...loadedUser }));
          }
          if (history?.activities?.length) {
            setActivityHistory(history.activities);
          }
        }
      } catch (error) {
        if (isMounted) {
          addNotification('Using cached data while we reconnect…', 'warning');
        }
      }

      // Load persisted data
      const storedRedeemed = localStorage.getItem('redeemedRewards');
      if (storedRedeemed) {
        setRedeemedRewards(JSON.parse(storedRedeemed));
      }
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
      const storedActivity = localStorage.getItem('activityHistory');
      if (storedActivity) {
        setActivityHistory(JSON.parse(storedActivity));
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadData();
    return () => {
      isMounted = false;
    };
  }, [addNotification]);

  useEffect(() => {
    const handleTruckUpdate = (data) => {
      setTruckPosition(data);
    };
    socket.on('newTruckLocation', handleTruckUpdate);

    socket.on('requestAccepted', () => {
      setPickupRequested(true);
    });

    return () => {
      socket.off('newTruckLocation', handleTruckUpdate);
      socket.off('requestAccepted');
    };
  }, [socket]);

  useEffect(() => {
    const handleInitialData = (data) => {
      if (!data) return;
      if (data.truckPosition) {
        setTruckPosition(data.truckPosition);
      }
      if (Array.isArray(data.pickupRequests) && socket.id) {
        const myRequest = data.pickupRequests.find((req) => req.id === socket.id);
        if (myRequest) {
          setPickupRequested(true);
          setPickupPosition({ lat: myRequest.lat, lng: myRequest.lng });
          if (myRequest.status) {
            setPickupStatus(myRequest.status);
          }
          if (typeof myRequest.points === 'number') {
            setPickupPoints(myRequest.points);
            if (myRequest.status === 'success') {
              setUserData((prev) => ({ ...prev, points: prev.points + myRequest.points }));
            }
          }
          if (myRequest.collectorName) {
            setCollectorName(myRequest.collectorName);
          }
        }
      }
    };

    const handlePickupStatus = (data) => {
      if (!data) return;
      setPickupRequested(true);
      setPickupStatus(data.status);
      if (typeof data.points === 'number') {
        setPickupPoints(data.points);
        if (data.status === 'success') {
          setUserData((prev) => ({ ...prev, points: prev.points + data.points, completedPickups: prev.completedPickups + 1 }));
          setActivityHistory((prev) => [
            {
              id: Date.now(),
              title: 'Recycling pickup completed',
              date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }),
              points: data.points,
              icon: '♻️',
              location: 'Pickup Location',
            },
            ...prev,
          ]);
          addNotification('Pickup completed! Points added to your wallet.', 'success');
        }
      }
      if (data.collectorName) {
        setCollectorName(data.collectorName);
      }
    };

    socket.on('initialData', handleInitialData);
    socket.on('pickupStatus', handlePickupStatus);

    return () => {
      socket.off('initialData', handleInitialData);
      socket.off('pickupStatus', handlePickupStatus);
    };
  }, [socket]);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('activityHistory', JSON.stringify(activityHistory));
  }, [activityHistory]);

  useEffect(() => {
    localStorage.setItem('redeemedRewards', JSON.stringify(redeemedRewards));
  }, [redeemedRewards]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPosition(coords);
        setPickupPosition((prev) => prev || coords);
      },
      (err) => {
        setLocationError('Unable to fetch your location. Please allow location access.');
        console.error(err);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditData({ ...userData });
  };

  const handleSaveProfile = () => {
    setUserData(editData);
    setIsEditingProfile(false);
    addNotification('Profile updated successfully!', 'success');
  };

  const handleRequestPickup = () => {
    if (!pickupPosition) {
      addNotification('Please set a pickup location first.', 'warning');
      return;
    }
    socket.emit('requestPickup', {
      id: socket.id,
      ...pickupPosition,
    });
    setPickupRequested(true);
    setPickupStatus(null);
    setCollectorName('');
    addNotification('Pickup requested! Waiting for a collector...', 'success');
  };

  const handleUseCurrentLocation = () => {
    if (userPosition) {
      setPickupPosition({ ...userPosition });
      addNotification('Using your current location', 'success');
    }
  };

  const pickupCoordinates = pickupPosition || userPosition;
  const collectorLabel = collectorName || 'Your assigned collector';
  const statusMessage = pickupRequested
    ? pickupStatus
      ? pickupStatus === 'success'
        ? `${collectorLabel} completed the pickup. You earned ${pickupPoints} points.`
        : `${collectorLabel} reported that the pickup was not completed.`
      : truckPosition
        ? `${collectorLabel} is on the way. Watch the truck move on the map.`
        : 'Waiting for the truck to start the route.'
    : 'Set your pin and request a pickup to begin.';
  const greetingName = userData?.name?.split(' ')[0] || 'Eco hero';

  return (
    <div style={styles.page}>
      <div style={styles.notificationContainer}>
        {(notifications || []).map((notification) => (
          <div
            key={notification.id}
            style={{
              ...styles.notification,
              borderLeftColor: notificationColors[notification.tone] || notificationColors.success,
            }}
          >
            {notification.message}
          </div>
        ))}
      </div>

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner} />
          <p>Loading your dashboard…</p>
        </div>
      )}

      <header style={styles.hero} className="user-page__hero">
        <div>
          <p style={styles.heroBadge}>{userData.membership || 'Eco Citizen'}</p>
          <h1 style={styles.heroTitle}>Hi {greetingName}, keep the city clean.</h1>
          <p style={styles.heroSubtitle}>
            Earn rewards every time you recycle. Drop your pin, request a pickup, and follow the truck in real time.
            Serving <strong>{userData.district || 'Dumaguete City'}</strong>.
          </p>
          <div style={styles.heroMeta}>
            <div style={styles.heroMetaChip}>
              <span style={styles.heroMetaChipLabel}>District</span>
              <strong>{userData.district || 'Dumaguete City'}</strong>
            </div>
            <div style={styles.heroMetaChip}>
              <span style={styles.heroMetaChipLabel}>Membership</span>
              <strong>{userData.membership || 'Eco Citizen'}</strong>
            </div>
          </div>
          <div style={styles.heroActions}>
            <button
              style={{ ...styles.ctaButton, opacity: pickupRequested ? 0.6 : 1 }}
              onClick={handleRequestPickup}
              disabled={pickupRequested || (!pickupPosition && !userPosition)}
            >
              {pickupRequested ? 'Pickup in progress' : 'Request Pickup'}
            </button>
            <button style={styles.secondaryGhost} onClick={() => handleTabChange('activity')}>
              View activity
            </button>
          </div>
        </div>
        <div style={styles.heroStats} className="user-page__hero-stats">
          <div style={styles.heroStatCard}>
            <p style={styles.heroStatLabel}>Eco Points</p>
            <h3 style={styles.heroStatValue}>{userData.points.toLocaleString()}</h3>
            <p style={styles.heroStatFoot}>+{userData.weeklyPoints} this week</p>
          </div>
          <div style={styles.heroStatCard}>
            <p style={styles.heroStatLabel}>Completed Pickups</p>
            <h3 style={styles.heroStatValue}>{userData.completedPickups}</h3>
            <p style={styles.heroStatFoot}>{userData.scheduledPickups} scheduled</p>
          </div>
          <div style={styles.heroStatCard}>
            <p style={styles.heroStatLabel}>Current status</p>
            <h3 style={styles.heroStatValue}>{pickupRequested ? 'Live' : 'Idle'}</h3>
            <p style={styles.heroStatFoot}>{pickupRequested ? statusMessage : 'Ready for your next pickup'}</p>
          </div>
        </div>
      </header>

      <section style={styles.grid} className="user-page__grid">
        <article style={styles.card}>
          <h4 style={styles.cardTitle}>Pickup status</h4>
          <p style={{ ...styles.statusText, color: pickupStatus === 'failed' ? '#d14343' : '#0b6bcb' }}>{statusMessage}</p>
          {!pickupRequested && (
            <p style={styles.cardHint}>Need help locating yourself? Use the map below or tap “Use Current Location”.</p>
          )}
        </article>
        <article style={styles.card}>
          <h4 style={styles.cardTitle}>Rewards highlight</h4>
          <p style={styles.cardBody}>
            Redeem {rewards[0]?.name || 'exclusive rewards'} once you hit{' '}
            {rewards[0]?.points?.toLocaleString() || 'the required'} points.
          </p>
          <button style={styles.smallButton} onClick={() => handleTabChange('rewards')}>
            Browse rewards
          </button>
        </article>
      </section>

      <section style={styles.mapSection}>
        <div style={styles.mapHeader}>
          <div>
            <p style={styles.mapEyebrow}>Live map</p>
            <h3 style={styles.mapTitle}>Set your pickup spot</h3>
          </div>
          <button
            style={styles.secondaryButton}
            onClick={handleUseCurrentLocation}
            disabled={!userPosition}
          >
            Use current location
          </button>
        </div>
        <div style={styles.mapCard} className="user-page__map-card">
          <MapContainer
            center={pickupCoordinates || truckPosition || center}
            zoom={15}
            style={styles.map}
            className="user-page__map"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <ManualLocationSelector onSelect={setPickupPosition} />
            <LocationMarker position={pickupCoordinates} icon={UserIcon} />
            {pickupRequested && truckPosition && <Marker position={truckPosition} icon={TruckIcon} />}
          </MapContainer>
          <div style={styles.mapInfo}>
            <div>
              <p style={styles.mapInfoLabel}>Selected location</p>
              <p style={styles.mapInfoValue}>
                {pickupCoordinates
                  ? `${pickupCoordinates.lat.toFixed(4)}, ${pickupCoordinates.lng.toFixed(4)}`
                  : 'Tap on the map to drop a pin'}
              </p>
            </div>
            {!pickupRequested && (
              <button
                style={styles.requestButton}
                onClick={handleRequestPickup}
                disabled={!pickupCoordinates}
              >
                Confirm & request
              </button>
            )}
          </div>
        </div>
        {locationError && <p style={styles.locationError}>{locationError}</p>}
        {!locationError && !pickupRequested && (
          <p style={styles.mapHint}>Drag or tap on the map to reposition your marker before requesting.</p>
        )}
      </section>

      {activeTab === 'activity' && (
        <section style={styles.activityPanel}>
          <div style={styles.tabHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Recent activity</h3>
              <p style={styles.cardHint}>Track the pickups and rewards you've completed this week.</p>
            </div>
            <span style={styles.activityTotal}>Total entries: {activityHistory.length}</span>
          </div>
          <div style={styles.activityList}>
            {activityHistory.length === 0 && <p style={styles.cardHint}>No activity yet. Schedule your first pickup!</p>}
            {activityHistory.map((activity) => (
              <div key={activity.id} style={styles.activityItem} className="user-page__activity-item">
                <div style={styles.activityIcon}>{activity.icon}</div>
                <div style={styles.activityDetails}>
                  <p style={styles.activityTitle}>{activity.title}</p>
                  <p style={styles.activityMeta}>
                    {activity.date} · {activity.location}
                  </p>
                  <p
                    style={{
                      ...styles.activityPoints,
                      color: activity.points >= 0 ? '#15803d' : '#dc2626',
                    }}
                  >
                    {activity.points >= 0 ? '+' : ''}{activity.points} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'rewards' && (
        <section style={styles.rewardsPanel}>
          <div style={styles.tabHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Available rewards</h3>
              <p style={styles.cardHint}>Redeem eco points for sustainable perks and essentials.</p>
            </div>
            <span style={styles.activityTotal}>Balance: {userData.points.toLocaleString()} pts</span>
          </div>
          <div style={styles.rewardsGrid}>
            {rewards.filter((reward) => !redeemedRewards.some((rr) => rr.id === reward.id)).map((reward) => {
              const canRedeem = userData.points >= reward.points;
              return (
                <div key={reward.id} style={styles.rewardCard}>
                  <h4 style={styles.rewardName}>{reward.name}</h4>
                  <p style={styles.cardBody}>{reward.description}</p>
                  <div style={styles.rewardPoints}>{reward.points.toLocaleString()} pts</div>
                  <button
                    style={{
                      ...styles.redeemButton,
                      ...(canRedeem ? {} : styles.redeemButtonDisabled),
                    }}
                    disabled={!canRedeem}
                    onClick={() => handleRedeem(reward.id)}
                  >
                    {canRedeem ? 'Redeem now' : 'Need more points'}
                  </button>
                </div>
              );
            })}
          </div>
          {redeemedRewards.length > 0 && (
            <>
              <h3 style={styles.sectionTitle}>Redeemed rewards</h3>
              <div style={styles.rewardsGrid}>
                {redeemedRewards.map((reward) => (
                  <div key={`redeemed-${reward.id}`} style={styles.rewardCard}>
                    <h4 style={styles.rewardName}>{reward.name}</h4>
                    <p style={styles.cardBody}>{reward.description}</p>
                    <div style={{ ...styles.rewardPoints, color: '#16a34a' }}>Redeemed</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {activeTab === 'profile' && (
        <section style={styles.profilePanel}>
          <div style={styles.tabHeader}>
            <div>
              <h3 style={styles.sectionTitle}>Account overview</h3>
              <p style={styles.cardHint}>Stay on top of your sustainability stats.</p>
            </div>
            {!isEditingProfile ? (
              <button style={styles.secondaryButton} onClick={handleEditProfile}>
                Edit Profile
              </button>
            ) : (
              <button style={styles.ctaButton} onClick={handleSaveProfile}>
                Save Changes
              </button>
            )}
          </div>
          <div style={styles.profileRows}>
            <div style={styles.profileRow}>
              <span>Full name</span>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={styles.input}
                />
              ) : (
                <strong>{userData.name}</strong>
              )}
            </div>
            <div style={styles.profileRow}>
              <span>Membership</span>
              <strong>{userData.membership}</strong>
            </div>
            <div style={styles.profileRow}>
              <span>District</span>
              {isEditingProfile ? (
                <input
                  type="text"
                  value={editData.district || ''}
                  onChange={(e) => setEditData({ ...editData, district: e.target.value })}
                  style={styles.input}
                />
              ) : (
                <strong>{userData.district}</strong>
              )}
            </div>
          </div>
          <div style={styles.profileStats}>
            <div style={styles.profileStatCard}>
              <p style={styles.cardHint}>Total pickups</p>
              <h4>{userData.completedPickups}</h4>
            </div>
            <div style={styles.profileStatCard}>
              <p style={styles.cardHint}>Scheduled</p>
              <h4>{userData.scheduledPickups}</h4>
            </div>
            <div style={styles.profileStatCard}>
              <p style={styles.cardHint}>Eco points</p>
              <h4>{userData.points.toLocaleString()}</h4>
            </div>
          </div>
        </section>
      )}

      <footer style={styles.navBar} className="user-page__nav">
        <button
          style={activeTab === 'home' ? styles.navButtonActive : styles.navButton}
          onClick={() => handleTabChange('home')}
        >
          <FiHome style={styles.navIcon} />
          Home
        </button>
        <button
          style={activeTab === 'activity' ? styles.navButtonActive : styles.navButton}
          onClick={() => handleTabChange('activity')}
        >
          <FiActivity style={styles.navIcon} />
          Activity
        </button>
        <button
          style={activeTab === 'rewards' ? styles.navButtonActive : styles.navButton}
          onClick={() => handleTabChange('rewards')}
        >
          <FiGift style={styles.navIcon} />
          Rewards
        </button>
        <button
          style={activeTab === 'profile' ? styles.navButtonActive : styles.navButton}
          onClick={() => handleTabChange('profile')}
        >
          <FiUser style={styles.navIcon} />
          Profile
        </button>
        <button style={{ ...styles.navButton, color: '#dc2626' }} onClick={handleLogout}>
          <FiLogOut style={styles.navIcon} />
          Logout
        </button>
      </footer>
    </div>
  );
}

// --- STYLES ---
const styles = {
  page: {
    fontFamily: 'Inter, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    minHeight: '100vh',
    width: '100%',
    maxWidth: '1200px',
    padding: '32px clamp(20px, 4vw, 56px)',
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #f7fdf9 0%, #ffffff 60%)',
    overflowX: 'hidden',
    paddingBottom: '110px',
    margin: '0 auto',
  },
  notificationContainer: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 20,
  },
  notification: {
    backgroundColor: '#fff',
    padding: '12px 18px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    borderLeft: '5px solid #16a34a',
    fontWeight: 500,
    color: '#0b3b24',
  },
  loadingOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(255,255,255,0.85)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    zIndex: 15,
    fontWeight: 600,
    color: '#0b3b24',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '4px solid rgba(20,83,45,0.2)',
    borderTopColor: '#16a34a',
    animation: 'userPageSpin 1s linear infinite',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '32px',
    alignItems: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#0f8346',
    fontWeight: 600,
    marginBottom: '12px',
    fontSize: '0.85rem',
  },
  heroTitle: {
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    margin: '0 0 10px',
    color: '#082b16',
  },
  heroSubtitle: {
    margin: '0 0 20px',
    color: '#4b5b52',
    lineHeight: 1.5,
  },
  heroMeta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '18px',
  },
  heroMetaChip: {
    padding: '10px 16px',
    borderRadius: '999px',
    backgroundColor: '#f0fdf4',
    border: '1px solid rgba(22,163,74,0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  heroMetaChipLabel: {
    fontSize: '0.75rem',
    color: '#4b5b52',
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  ctaButton: {
    padding: '12px 28px',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(120deg, #16a34a, #22d3ee)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity .2s ease',
  },
  secondaryGhost: {
    padding: '12px 20px',
    borderRadius: '999px',
    border: '1px solid rgba(8, 43, 22, 0.2)',
    background: 'transparent',
    color: '#0f172a',
    cursor: 'pointer',
  },
  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
  },
  heroStatCard: {
    padding: '20px',
    borderRadius: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 15px 30px rgba(15, 118, 110, 0.1)',
  },
  heroStatLabel: { margin: 0, color: '#6b7a70', fontSize: '0.85rem' },
  heroStatValue: { margin: '6px 0 0', fontSize: '1.8rem', color: '#0c4a34' },
  heroStatFoot: { margin: '4px 0 0', color: '#8da396', fontSize: '0.8rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '18px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardTitle: {
    margin: 0,
    color: '#0b3b24',
    fontSize: '1rem',
  },
  statusText: {
    margin: 0,
    fontSize: '1rem',
    lineHeight: 1.4,
  },
  cardHint: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#7a8a80',
  },
  cardBody: {
    margin: 0,
    color: '#4b5b52',
    lineHeight: 1.5,
  },
  smallButton: {
    alignSelf: 'flex-start',
    padding: '10px 18px',
    borderRadius: '999px',
    border: '1px solid rgba(15, 118, 110, 0.3)',
    background: 'transparent',
    cursor: 'pointer',
  },
  mapSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  mapEyebrow: {
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    fontSize: '0.75rem',
    color: '#8da396',
  },
  mapTitle: { margin: '4px 0 0', color: '#0b3b24', fontSize: '1.3rem' },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 20px 35px rgba(0,0,0,0.08)',
    width: '100%',
  },
  map: {
    height: '50vh',
    width: '100%',
    borderRadius: '18px',
    overflow: 'hidden',
  },
  mapInfo: {
    marginTop: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  mapInfoLabel: { margin: 0, fontSize: '0.8rem', color: '#7a8a80' },
  mapInfoValue: { margin: '4px 0 0', fontSize: '1rem', color: '#0c4a34' },
  requestButton: {
    padding: '12px 22px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0ea5e9',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  requestActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  },
  secondaryButton: {
    backgroundColor: '#eef5f0',
    color: '#0b3b24',
    border: 'none',
    padding: '12px 18px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#333',
    cursor: 'pointer'
  },
  navButtonActive: {
    background: 'none',
    border: 'none',
    color: '#4CAF50',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  mapHint: {
    margin: '4px 0 0',
    color: '#7a8a80',
    fontSize: '0.85rem',
  },
  locationError: {
    color: '#d14343',
    marginTop: '8px',
    fontSize: '0.85rem',
  },
  activityPanel: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  },
  rewardsPanel: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
  },
  rewardCard: {
    padding: '20px',
    borderRadius: '16px',
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  rewardName: {
    margin: 0,
    fontSize: '1.1rem',
    color: '#0b3b24',
  },
  rewardPoints: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#0ea5e9',
  },
  redeemButton: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
  redeemButtonDisabled: {
    backgroundColor: '#d1d5db',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
  tabHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '1.5rem',
    color: '#0b3b24',
  },
  activityTotal: {
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#f9fafb',
  },
  activityIcon: {
    fontSize: '1.5rem',
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#0b3b24',
  },
  activityMeta: {
    margin: '4px 0',
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  activityPoints: {
    fontSize: '0.9rem',
    fontWeight: 600,
  },
  profilePanel: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
  },
  profileRows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
  },
  profileRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '1px solid #e5e7eb',
  },
  profileStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '16px',
  },
  profileStatCard: {
    textAlign: 'center',
    padding: '16px',
    borderRadius: '12px',
    backgroundColor: '#f9fafb',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    width: '200px',
  },
  navBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -6px 20px rgba(15, 23, 42, 0.08)',
    zIndex: 10,
  },
};

export default UserPage;
