import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SocketContext } from '../context/socket';
import truckIconUrl from '../assets/truck.png';

const center = [9.3068, 123.3054]; // Dumaguete City

const TruckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40],
});

const RequestMarker = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    setPosition(map.getCenter());
  }, [map]);

  useMapEvents({
    move() {
      setPosition(map.getCenter());
    },
  });

  return position === null ? null : <Marker position={position} />;
};

const RequestButton = ({ onPickupRequested }) => {
  const socket = useContext(SocketContext);
  const map = useMap();

  const handleRequestPickup = () => {
    const center = map.getCenter();
    socket.emit('requestPickup', { lat: center.lat, lng: center.lng });
    onPickupRequested();
  };

  return (
    <button onClick={handleRequestPickup}>
      Request Pickup Here
    </button>
  );
};

const UserPage = () => {
  const socket = useContext(SocketContext);
  const [truckPosition, setTruckPosition] = useState(null);
  const [pickupRequested, setPickupRequested] = useState(false);
  const [pickupComplete, setPickupComplete] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [collectorName, setCollectorName] = useState('');

  useEffect(() => {
    socket.on('newTruckLocation', (data) => {
      setTruckPosition(data);
    });

    socket.on('pickupComplete', (data) => {
      setPickupComplete(true);
      setCollectorName(data.collectorName);
    });

    // Clean up the effect
    return () => {
      socket.off('newTruckLocation');
      socket.off('pickupComplete');
    };
  }, [socket]);

  const handleFeedback = (rating) => {
    socket.emit('submitFeedback', { rating, collectorName });
    setFeedbackSubmitted(true);
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <h1>User View</h1>
      <MapContainer center={center} zoom={13} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RequestMarker />
        {truckPosition && <Marker position={[truckPosition.lat, truckPosition.lng]} icon={TruckIcon} />}
        <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: 10, borderRadius: 5 }}>
          {!pickupRequested && <RequestButton onPickupRequested={() => setPickupRequested(true)} />}
          {pickupRequested && !pickupComplete && <p>Pickup Requested. Waiting for collector...</p>}
          {pickupComplete && !feedbackSubmitted && (
            <div>
              <p>Pickup Complete! Thank you for using our service.</p>
              <p>Your collector was: <strong>{collectorName}</strong></p>
              <h4>Rate your experience:</h4>
              <button onClick={() => handleFeedback(5)}>★★★★★</button>
              <button onClick={() => handleFeedback(4)}>★★★★☆</button>
              <button onClick={() => handleFeedback(3)}>★★★☆☆</button>
              <button onClick={() => handleFeedback(2)}>★★☆☆☆</button>
              <button onClick={() => handleFeedback(1)}>★☆☆☆☆</button>
            </div>
          )}
          {feedbackSubmitted && <p>Thank you for your feedback!</p>}
        </div>
      </MapContainer>
    </div>
  );
};

export default UserPage;
