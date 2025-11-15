import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SocketContext } from '../context/socket';
import truckIconUrl from '../assets/truck.png';
import userIconUrl from '../assets/user.svg';

const center = [9.3068, 123.3054]; // Dumaguete City

const TruckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40],
});

const LocationMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    });
  }, [map]);

  return position === null ? null : <Marker position={position} />;
};


const UserPage = () => {
  const socket = useContext(SocketContext);
  const [truckPosition, setTruckPosition] = useState(center);
  const [pickupRequested, setPickupRequested] = useState(false);

  useEffect(() => {
    socket.on('newTruckLocation', (data) => {
      setTruckPosition(data);
    });

    socket.on('requestAccepted', () => {
      setPickupRequested(true);
    });

    return () => {
      socket.off('newTruckLocation');
      socket.off('requestAccepted');
    };
  }, [socket]);

  const handleRequestPickup = () => {
    // For now, we'll just emit a static location.
    // A real implementation would use the user's actual location.
    socket.emit('requestPickup', { lat: center[0], lng: center[1] });
    setPickupRequested(true);
  };


  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <img src={userIconUrl} alt="Profile" style={styles.profileIcon} />
        <h2>Juan</h2>
      </div>

      <div style={styles.dashboard}>
        <div style={styles.pointsCard}>
          <h4>Eco-Points</h4>
          <p>3,250</p>
        </div>
        <button style={styles.rewardsButton}>Browse Rewards</button>
      </div>

      <div style={styles.promoSection}>
        <h4>Don't miss out!</h4>
        <div style={styles.promoCard}>
          <p>Get 2x points on your next pickup!</p>
        </div>
      </div>

      <div style={styles.mapContainer}>
        <MapContainer center={truckPosition || center} zoom={15} style={styles.map}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {pickupRequested && truckPosition && <Marker position={truckPosition} icon={TruckIcon} />}
          {!pickupRequested && <LocationMarker />}
        </MapContainer>
        {!pickupRequested && <button onClick={handleRequestPickup} style={styles.requestButton}>Request a Pickup</button>}
      </div>

      <div style={styles.navBar}>
        <button style={styles.navButton} disabled>Home</button>
        <button style={styles.navButton} disabled>Activity</button>
        <button style={styles.navButton} disabled>Profile</button>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  page: {
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    padding: '20px',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px'
  },
  profileIcon: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    marginRight: '15px'
  },
  dashboard: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  pointsCard: {
    backgroundColor: '#E8F5E9',
    padding: '15px',
    borderRadius: '10px',
    flexGrow: 1,
    marginRight: '10px'
  },
  rewardsButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '15px 20px',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  promoSection: {
    marginBottom: '20px'
  },
  promoCard: {
    backgroundColor: '#F3E5F5',
    padding: '20px',
    borderRadius: '10px'
  },
  mapContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    height: '100%',
    width: '100%',
    borderRadius: '10px'
  },
  requestButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px 40px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '1.2em',
    cursor: 'pointer'
  },
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
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: '#333',
    cursor: 'pointer'
  },
};

export default UserPage;
