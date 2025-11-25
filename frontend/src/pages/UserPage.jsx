import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSocket } from '../context/socket';
import { useAuth } from '../context/AuthContext';
import { getUserData, getPickupHistory } from '../services/apiService';
import RatingModal from '../components/RatingModal';

// Import all user components
import NotificationContainer from '../components/user/NotificationContainer';
import UserHero from '../components/user/UserHero';
import PickupStatusCard from '../components/user/PickupStatusCard';
import RewardsHighlight from '../components/user/RewardsHighlight';
import LiveMap from '../components/user/LiveMap';
import ActivityPanel from '../components/user/ActivityPanel';
import RewardsPanel from '../components/user/RewardsPanel';
import ProfilePanel from '../components/user/ProfilePanel';
import NavigationBar from '../components/user/NavigationBar';
import CityTruckScheduleModal from '../components/user/CityTruckScheduleModal';
import { styles } from '../components/user/userStyles';

// Fallback data
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

const center = [9.3068, 123.3054]; // Dumaguete City

const UserPage = () => {
  const { socket } = useSocket();
  const { user: authUser } = useAuth();

  // State management
  // State management
  const [truckPosition, setTruckPosition] = useState(center);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [userPosition, setUserPosition] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [pickupPosition, setPickupPosition] = useState(null);
  const [pickupStatus, setPickupStatus] = useState(null);
  const [collectorName, setCollectorName] = useState('');
  const [pickupPoints, setPickupPoints] = useState(0);
  const [userData, setUserData] = useState(authUser || {
    name: 'Loading...',
    points: 0,
    completedPickups: 0,
    scheduledPickups: 0,
    weeklyPoints: 0,
    membership: 'Eco Citizen',
    district: '',
    barangay: ''
  });
  const [activityHistory, setActivityHistory] = useState(FALLBACK_ACTIVITIES);
  const [rewards, setRewards] = useState(FALLBACK_REWARDS);
  const [redeemedRewards, setRedeemedRewards] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const notificationTimers = useRef([]);
  const [notifications, setNotifications] = useState([]);
  const [wasteType, setWasteType] = useState('recyclable');
  const [loadSize, setLoadSize] = useState('base');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [cityTruckSchedule, setCityTruckSchedule] = useState(null);
  const [route, setRoute] = useState([]);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userPickupState');
      if (!raw) return;

      const saved = JSON.parse(raw);
      if (saved && typeof saved === 'object') {
        if (typeof saved.pickupRequested === 'boolean') {
          setPickupRequested(saved.pickupRequested);
        }
        if (saved.pickupPosition && typeof saved.pickupPosition.lat === 'number' && typeof saved.pickupPosition.lng === 'number') {
          setPickupPosition(saved.pickupPosition);
        }
        if (typeof saved.pickupStatus === 'string') {
          setPickupStatus(saved.pickupStatus);
        }
        if (typeof saved.pickupPoints === 'number') {
          setPickupPoints(saved.pickupPoints);
        }
        if (typeof saved.collectorName === 'string') {
          setCollectorName(saved.collectorName);
        }
      }
    } catch (error) { }
  }, []);

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

  // Responsive styles injection
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

  // Load user data
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      setLoading(true);

      // Priority 1: Use authenticated user data
      if (authUser) {
        console.log('Loading user data from authUser:', authUser);
        setUserData(authUser);
      } else {
        // Priority 2: Check localStorage for current user
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            console.log('Loading user data from localStorage:', parsed);
            setUserData(parsed);
          } catch (e) {
            console.error('Error parsing stored user:', e);
          }
        }
      }

      // Load other persisted data
      const storedRedeemed = localStorage.getItem('redeemedRewards');
      if (storedRedeemed) {
        setRedeemedRewards(JSON.parse(storedRedeemed));
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
  }, [authUser]);

  // Socket event handlers

  useEffect(() => {
    const handleInitialData = (data) => {
      if (!data) return;
      if (data.truckPosition) {
        setTruckPosition(data.truckPosition);
      }
      if (data.route) {
        setRoute(data.route);
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
          setShowRatingModal(true);
        }
      }
      if (data.collectorName) {
        setCollectorName(data.collectorName);
      }
    };

    const handleRouteCalculated = (newRoute) => {
      setRoute(newRoute || []);
    };

    const handleTruckUpdate = (pos) => {
      setTruckPosition(pos);
    };

    socket.on('initialData', handleInitialData);
    socket.on('pickupStatus', handlePickupStatus);
    socket.on('routeCalculated', handleRouteCalculated);
    socket.on('newTruckLocation', handleTruckUpdate);

    // Re-emit pickup request if user had one before refresh
    if (pickupRequested && pickupPosition && !pickupStatus) {
      console.log('Re-emitting pickup request after page refresh');
      socket.emit('requestPickup', {
        id: socket.id,
        ...pickupPosition,
        wasteType: wasteType,
      });
    }

    return () => {
      socket.off('initialData', handleInitialData);
      socket.off('pickupStatus', handlePickupStatus);
      socket.off('routeCalculated', handleRouteCalculated);
      socket.off('newTruckLocation', handleTruckUpdate);
    };
  }, [socket]);

  // Persist state to localStorage
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
    const state = {
      pickupRequested,
      pickupPosition,
      pickupStatus,
      pickupPoints,
      collectorName,
    };
    try {
      localStorage.setItem('userPickupState', JSON.stringify(state));
    } catch (error) { }
  }, [pickupRequested, pickupPosition, pickupStatus, pickupPoints, collectorName]);

  // Get user location
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

  // Event handlers
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

    // Check waste type and route accordingly
    if (wasteType === 'residual') {
      handleShowCityTruckSchedule();
      return;
    }

    if (wasteType === 'bulk') {
      // Handle paid/special pickup
      const prices = { base: 150, medium: 300, full: 500 };
      const price = prices[loadSize] || 150;

      socket.emit('bookSpecialPickup', {
        id: socket.id,
        ...pickupPosition,
        wasteType: wasteType,
        loadSize: loadSize,
        price: price,
      });
      setPickupRequested(true);
      setPickupStatus(null);
      setCollectorName('');
      addNotification('Special pickup booked! Finding an Eco-Warrior...', 'success');
      return;
    }

    // For recyclable/biodegradable, proceed with normal pickup request
    socket.emit('requestPickup', {
      id: socket.id,
      ...pickupPosition,
      wasteType: wasteType, // Include waste type in request
    });
    setPickupRequested(true);
    setPickupStatus(null);
    setCollectorName('');
    addNotification('Pickup requested! Waiting for a collector...', 'success');
  };

  const handleShowCityTruckSchedule = async () => {
    try {
      const response = await fetch('/city_truck_schedule.json');
      if (!response.ok) throw new Error('Failed to load schedule');
      const data = await response.json();

      // Find schedule for user's barangay (match by district name)
      let schedule = data.schedules.find(s =>
        s.barangayName.toLowerCase().includes(userData.district?.toLowerCase() || '')
      );

      // Fallback to first schedule if no match
      if (!schedule && data.schedules.length > 0) {
        schedule = data.schedules[0];
      }

      if (schedule) {
        setCityTruckSchedule(schedule);
        setShowScheduleModal(true);
      } else {
        addNotification('Schedule not available for your area.', 'warning');
      }
    } catch (error) {
      console.error('Error loading city truck schedule:', error);
      addNotification('Could not load city truck schedule. Please try again.', 'error');
    }
  };

  const handleCancelPickup = () => {
    socket.emit('cancelPickup');
    setPickupRequested(false);
    setPickupStatus(null);
    setPickupPoints(0);
    setCollectorName('');
    addNotification('Pickup cancelled. You can adjust your pin and request again.', 'warning');
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      addNotification('Geolocation is not supported on this device or browser.', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserPosition(coords);
        setPickupPosition(coords);
        setLocationError(null);
        addNotification('Using your current location', 'success');
      },
      (err) => {
        console.error(err);
        setLocationError('Unable to fetch your location. Please allow location access.');
        addNotification('We could not access your location. Please check app permissions.', 'error');
      },
      { enableHighAccuracy: true }
    );
  };

  const handleRatingSubmit = (ratingData) => {
    socket.emit('submitRating', {
      userId: socket.id,
      userName: userData.name,
      collectorName: collectorName || 'Route Team',
      ...ratingData
    });
    setShowRatingModal(false);
    addNotification('Thank you for your feedback!', 'success');
  };

  // Computed values
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

  return (
    <div style={styles.page}>
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRatingSubmit}
        collectorName={collectorName || 'your collector'}
      />

      <NotificationContainer
        notifications={notifications}
        notificationColors={notificationColors}
      />

      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner} />
          <p>Loading your dashboard…</p>
        </div>
      )}

      <UserHero
        userData={userData}
        pickupRequested={pickupRequested}
        pickupPosition={pickupPosition}
        userPosition={userPosition}
        statusMessage={statusMessage}
        wasteType={wasteType}
        onWasteTypeChange={setWasteType}
        loadSize={loadSize}
        onLoadSizeChange={setLoadSize}
        onRequestPickup={handleRequestPickup}
        onTabChange={handleTabChange}
      />

      <section style={styles.grid} className="user-page__grid">
        <PickupStatusCard
          pickupRequested={pickupRequested}
          pickupStatus={pickupStatus}
          statusMessage={statusMessage}
          onCancelPickup={handleCancelPickup}
        />
        <RewardsHighlight
          rewards={rewards}
          onTabChange={handleTabChange}
        />
      </section>

      <LiveMap
        pickupCoordinates={pickupCoordinates}
        truckPosition={truckPosition}
        pickupRequested={pickupRequested}
        userPosition={userPosition}
        locationError={locationError}
        onSetPickupPosition={setPickupPosition}
        onUseCurrentLocation={handleUseCurrentLocation}
        onRequestPickup={handleRequestPickup}
        route={route}
      />

      <ActivityPanel
        activityHistory={activityHistory}
        isVisible={activeTab === 'activity'}
      />

      <RewardsPanel
        rewards={rewards}
        redeemedRewards={redeemedRewards}
        userData={userData}
        onRedeem={handleRedeem}
        isVisible={activeTab === 'rewards'}
      />

      <ProfilePanel
        userData={userData}
        isEditing={isEditingProfile}
        editData={editData}
        onEdit={handleEditProfile}
        onSave={handleSaveProfile}
        onEditDataChange={setEditData}
        isVisible={activeTab === 'profile'}
      />

      <NavigationBar
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <CityTruckScheduleModal
        isOpen={showScheduleModal}
        schedule={cityTruckSchedule}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
};

export default UserPage;
