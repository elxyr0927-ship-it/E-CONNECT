import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SocketContext } from '../context/socket';
import truckIconUrl from '../assets/truck.png';
import userIconUrl from '../assets/user.svg'; // Placeholder for profile icon

const center = [9.3068, 123.3054]; // Dumaguete City

const TruckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40],
});

// A custom component to recenter the map
const RecenterButton = ({ position }) => {
  const map = useMap();
  const recenterMap = () => {
    map.setView(position, 15);
  };
  return (
    <button onClick={recenterMap} style={styles.recenterButton}>
      🎯
    </button>
  );
};


const CollectorPage = () => {
  const socket = useContext(SocketContext);
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [jobOffer, setJobOffer] = useState(null);
  const [truckPosition, setTruckPosition] = useState({ lat: center[0], lng: center[1] });
  const [countdown, setCountdown] = useState(30);

  // Effect for socket event listeners
  useEffect(() => {
    socket.emit('collectorConnect');

    socket.on('jobOffer', (offer) => {
      setJobOffer(offer);
      setCountdown(30);
    });

    socket.on('statsUpdated', (stats) => {
      setEarnings(stats.earnings);
      setJobsCompleted(stats.jobsCompleted);
    });

    // Mock truck movement for demo purposes
    const interval = setInterval(() => {
      setTruckPosition(prev => {
        const newPos = {
          lat: prev.lat + 0.0001,
          lng: prev.lng + 0.0001,
        };
        socket.emit('updateLocation', newPos);
        return newPos;
      });
    }, 5000);

    return () => {
      socket.off('jobOffer');
      socket.off('statsUpdated');
      clearInterval(interval);
    };
  }, [socket]);

  // Effect for the countdown timer
  useEffect(() => {
    if (jobOffer) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleDecline();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [jobOffer]);

  const handleStatusChange = (newStatus) => {
    setIsOnline(newStatus);
    socket.emit('setStatus', newStatus ? 'online' : 'offline');
  };

  const handleAccept = () => {
    socket.emit('jobAccepted', jobOffer);
    setJobOffer(null);
  };

  const handleDecline = () => {
    socket.emit('jobDeclined', jobOffer);
    setJobOffer(null);
  };

  return (
    <div style={styles.page}>
      <MapContainer center={[truckPosition.lat, truckPosition.lng]} zoom={15} style={styles.map}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[truckPosition.lat, truckPosition.lng]} icon={TruckIcon} />
        <RecenterButton position={[truckPosition.lat, truckPosition.lng]} />
      </MapContainer>

      <div style={styles.header}>
        <img src={userIconUrl} alt="Profile" style={styles.profileIcon} />
        <div>
          <button
            onClick={() => handleStatusChange(true)}
            style={isOnline ? styles.onlineButton : styles.offlineButton}
          >
            Online
          </button>
          <button
            onClick={() => handleStatusChange(false)}
            style={!isOnline ? styles.onlineButton : styles.offlineButton}
          >
            Offline
          </button>
        </div>
      </div>

      <div style={styles.bottomSheet}>
        {jobOffer ? (
          <div style={styles.jobOfferContainer}>
            <div style={styles.jobHeader}>
              <h4>Recyclables Pickup</h4>
              <div style={styles.timer}>{countdown}s</div>
            </div>
            <p style={styles.jobDetails}>1.2km away (Est. 5 mins)</p>
            <p style={styles.jobAddress}>123 Green St, Eco City</p>
            <div style={styles.jobFooter}>
              <p style={styles.earnings}>Earnings: ₱{jobOffer.earnings.toFixed(2)}</p>
              <button onClick={handleDecline} style={styles.declineButton}>Decline</button>
              <button onClick={handleAccept} style={styles.acceptButton}>Accept</button>
            </div>
          </div>
        ) : (
          <div style={styles.dashboard}>
            <div style={styles.statBox}>
              <p>Today's Earnings</p>
              <h3>₱{earnings.toFixed(2)}</h3>
            </div>
            <div style={styles.statBox}>
              <p>Jobs Completed</p>
              <h3>{jobsCompleted}</h3>
            </div>
          </div>
        )}
      </div>

      <div style={styles.navBar}>
        <button style={styles.navButton}>Dashboard</button>
        <button style={styles.navButton} disabled>Jobs</button>
        <button style={styles.navButton} disabled>Earnings</button>
        <button style={styles.navButton} disabled>Profile</button>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  page: { fontFamily: 'sans-serif', position: 'relative', height: '100vh', width: '100vw', overflow: 'hidden' },
  map: { height: '100%', width: '100%' },
  header: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileIcon: { width: '50px', height: '50px', borderRadius: '50%' },
  onlineButton: { backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '20px', cursor: 'pointer' },
  offlineButton: { backgroundColor: '#f0f0f0', color: 'black', padding: '10px 20px', border: 'none', borderRadius: '20px', cursor: 'pointer' },
  recenterButton: { position: 'absolute', top: '20px', right: '20px', zIndex: 1001, backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', fontSize: '20px' },
  bottomSheet: {
    position: 'absolute',
    bottom: '80px', // Adjusted for nav bar
    left: '10px',
    right: '10px',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000,
  },
  dashboard: { display: 'flex', justifyContent: 'space-around' },
  statBox: { textAlign: 'center' },
  jobOfferContainer: { color: '#333' },
  jobHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  timer: { backgroundColor: '#FFC107', color: 'white', padding: '5px 10px', borderRadius: '15px' },
  jobDetails: { fontWeight: 'bold', fontSize: '1.2em', margin: '10px 0' },
  jobAddress: { color: '#666', marginBottom: '15px' },
  jobFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  earnings: { fontWeight: 'bold', color: '#4CAF50' },
  declineButton: { backgroundColor: '#f0f0f0', border: 'none', padding: '10px 20px', borderRadius: '20px' },
  acceptButton: { backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '20px' },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70px',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
    zIndex: 1001,
  },
  navButton: { background: 'none', border: 'none', color: '#333', cursor: 'pointer' },
};

export default CollectorPage;
