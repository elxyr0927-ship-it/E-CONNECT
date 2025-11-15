import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SocketContext } from '../context/socket';
import truckIconUrl from '../assets/truck.png';

const center = [9.3068, 123.3054]; // Dumaguete City

const TruckIcon = new L.Icon({
  iconUrl: truckIconUrl,
  iconSize: [40, 40],
});


const CollectorPage = () => {
  const socket = useContext(SocketContext);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [dumpsite, setDumpsite] = useState(null);
  const [route, setRoute] = useState([]);
  const [truckPosition, setTruckPosition] = useState(null);
  const [isDriving, setIsDriving] = useState(false);

  useEffect(() => {
    socket.on('newPickupRequest', (request) => {
      setPickupRequests((prev) => [...prev, request]);
    });

    socket.on('routeCalculated', (calculatedRoute) => {
      setRoute(calculatedRoute);
      // Start the driving simulation
      simulateDriving(calculatedRoute);
    });

    // Clean up the effect
    return () => {
      socket.off('newPickupRequest');
      socket.off('routeCalculated');
    };
  }, [socket]);

  const DumpsiteSetter = () => {
    useMapEvents({
        click(e) {
            if (!dumpsite) {
                setDumpsite(e.latlng);
                socket.emit('setDumpsite', e.latlng);
            }
        },
    });
    return null;
  };


  const handleCalculateRoute = () => {
    socket.emit('calculateRoute', { dumpsite, pickupRequests });
  };

  const simulateDriving = (calculatedRoute) => {
      setIsDriving(true);
      let currentIndex = 0;
      const interval = setInterval(() => {
          if (currentIndex < calculatedRoute.length) {
              const newPosition = calculatedRoute[currentIndex];
              setTruckPosition(newPosition);
              socket.emit('updateLocation', newPosition);
              currentIndex++;
          } else {
              clearInterval(interval);
              setIsDriving(false);
          }
      }, 3000); // 3 seconds per step
  };


  const handleCompletePickup = (requestId) => {
    const collectorName = localStorage.getItem('workerName');
    socket.emit('pickupComplete', { requestId, collectorName });
    setPickupRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <h1>Collector View</h1>
      <MapContainer center={center} zoom={13} style={{ height: '90%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <DumpsiteSetter />
        {dumpsite && <Marker position={dumpsite} />}
        {pickupRequests.map((req) => (
          <Marker key={req.id} position={[req.lat, req.lng]} />
        ))}
        {truckPosition && <Marker position={truckPosition} icon={TruckIcon} />}
        {route.length > 0 && <Polyline positions={route.map(p => [p.lat, p.lng])} color="blue" />}
      </MapContainer>
      <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 1000, background: 'white', padding: 10, borderRadius: 5, maxHeight: '80vh', overflowY: 'auto' }}>
        {!dumpsite && <p>Click on the map to set the dumpsite location.</p>}
        {dumpsite && !isDriving && <button onClick={handleCalculateRoute} disabled={pickupRequests.length === 0}>
          Calculate Route and Start Driving
        </button>}
        {isDriving && <p>Route is in progress...</p>}

        <div style={{ marginTop: '20px' }}>
          <h3>Pickup Requests</h3>
          {pickupRequests.length === 0 ? (
            <p>No active requests.</p>
          ) : (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {pickupRequests.map((req) => (
                <li key={req.id} style={{ marginBottom: '10px' }}>
                  <span>Request ID: {req.id.substring(0, 6)}...</span>
                  <button onClick={() => handleCompletePickup(req.id)} style={{ marginLeft: '10px' }}>
                    Complete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectorPage;
