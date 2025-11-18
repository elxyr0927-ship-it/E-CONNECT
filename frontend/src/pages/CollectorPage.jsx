import React, { useState, useEffect, useContext, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
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

const TruckMoveHandler = ({ onMove }) => {
  useMapEvents({
    click(e) {
      if (onMove) {
        onMove({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
};


const CollectorPage = () => {
  const socket = useContext(SocketContext);
  const [isOnline, setIsOnline] = useState(false);
  const [earnings, setEarnings] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [jobOffer, setJobOffer] = useState(null);
  const [truckPosition, setTruckPosition] = useState({ lat: center[0], lng: center[1] });
  const [countdown, setCountdown] = useState(30);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pickupRequests, setPickupRequests] = useState([]);
  const [dumpsite, setDumpsite] = useState(null);
  const [route, setRoute] = useState([]);
  const [isDriving, setIsDriving] = useState(false);
  const [currentStop, setCurrentStop] = useState(null);
  const [lastPickup, setLastPickup] = useState(null);
  const driveIntervalRef = useRef(null);
  const isPausedRef = useRef(false);
  const collectorDisplayName = 'Route Team';

  // Effect for socket event listeners
  useEffect(() => {
    socket.emit('collectorConnect');

    const handleTruckUpdate = (pos) => {
      if (pos) {
        setTruckPosition(pos);
      }
    };

    const applySnapshot = (data) => {
      if (data) {
        setPickupRequests(data.pickupRequests || []);
        setDumpsite(data.dumpsite || null);
        if (data.truckPosition) {
          setTruckPosition(data.truckPosition);
        }
        setRoute(data.route || []);
      }
    };

    socket.on('initialData', applySnapshot);
    socket.on('latestData', applySnapshot);

    socket.on('newPickupRequest', (request) => {
      if (!request) return;
      setPickupRequests((prev) => {
        const withoutExisting = prev.filter((r) => r.id !== request.id);
        return [...withoutExisting, request];
      });
    });

    socket.on('dumpsiteUpdated', (location) => {
      setDumpsite(location || null);
    });

    socket.on('routeCalculated', (newRoute) => {
      const safeRoute = newRoute || [];
      setRoute(safeRoute);
      if (safeRoute.length > 0) {
        startRoutePlayback(safeRoute);
      }
    });

    socket.on('jobOffer', (offer) => {
      setJobOffer(offer);
      setCountdown(30);
    });

    socket.on('statsUpdated', (stats) => {
      setEarnings(stats.earnings);
      setJobsCompleted(stats.jobsCompleted);
    });

    socket.on('pickupStatusUpdated', (updatedRequest) => {
      setPickupRequests((prev) => prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)));
      setLastPickup({ id: updatedRequest.id, status: updatedRequest.status, points: updatedRequest.points });
    });

    socket.on('pickupReached', (request) => {
      if (!request || request.status !== 'pending') {
        return;
      }
      setCurrentStop(request);
      isPausedRef.current = true;
    });

    socket.on('newTruckLocation', handleTruckUpdate);

    return () => {
      stopRoutePlayback();
      socket.off('initialData', applySnapshot);
      socket.off('latestData', applySnapshot);
      socket.off('newPickupRequest');
      socket.off('dumpsiteUpdated');
      socket.off('routeCalculated');
      socket.off('jobOffer');
      socket.off('statsUpdated');
      socket.off('pickupStatusUpdated');
      socket.off('pickupReached');
      socket.off('newTruckLocation', handleTruckUpdate);
    };
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit('requestLatestData');
    }, 4000);
    return () => clearInterval(interval);
  }, [socket]);

  const stopRoutePlayback = () => {
    if (driveIntervalRef.current) {
      clearInterval(driveIntervalRef.current);
      driveIntervalRef.current = null;
    }
    setIsDriving(false);
    isPausedRef.current = false;
  };

  const startRoutePlayback = (points) => {
    if (!points || points.length === 0) {
      return;
    }
    stopRoutePlayback();
    setIsDriving(true);
    isPausedRef.current = false;
    let index = 0;
    driveIntervalRef.current = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      const nextPoint = points[index];
      if (!nextPoint) {
        stopRoutePlayback();
        socket.emit('routeCompleted');
        return;
      }
      handleTruckMove(nextPoint);
      index += 1;
      if (index >= points.length) {
        stopRoutePlayback();
        socket.emit('routeCompleted');
      }
    }, 400); // faster playback for this run
  };

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

  const handleSetDumpsiteHere = () => {
    const location = { lat: truckPosition.lat, lng: truckPosition.lng };
    setDumpsite(location);
    socket.emit('setDumpsite', location);
  };

  const handleCalculateRoute = () => {
    if (!dumpsite || pickupRequests.length === 0) {
      alert('Set a dumpsite and wait for at least one pickup request first.');
      return;
    }
    if (isDriving) {
      alert('Route already in progress.');
      return;
    }
    socket.emit('calculateRoute', { dumpsite });
  };

  const handleTruckMove = (position) => {
    setTruckPosition(position);
    socket.emit('updateLocation', position);
  };

  const handlePickupResult = (status) => {
    if (!currentStop) {
      return;
    }
    socket.emit('pickupResult', { id: currentStop.id, status, collectorName: collectorDisplayName });
    setCurrentStop(null);
    isPausedRef.current = false;
  };

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <div>
          <p style={styles.heroBadge}>Collector Console</p>
          <h1 style={styles.heroTitle}>Deliver clean streets, one pickup at a time.</h1>
          <p style={styles.heroSubtitle}>
            Monitor live requests, adjust routes, and keep residents updated without leaving your seat.
          </p>
          <div style={styles.heroActions}>
            <button
              style={isOnline ? styles.heroButtonActive : styles.heroButton}
              onClick={() => handleStatusChange(true)}
            >
              Go Online
            </button>
            <button
              style={!isOnline ? styles.heroButtonActive : styles.heroButton}
              onClick={() => handleStatusChange(false)}
            >
              Go Offline
            </button>
          </div>
        </div>
        <div style={styles.profileCard}>
          <img src={userIconUrl} alt="Collector" style={styles.profileAvatar} />
          <div>
            <h4 style={styles.profileName}>Route Team</h4>
            <p style={styles.profileStatus}>{isOnline ? 'Currently accepting jobs' : 'Offline'}</p>
          </div>
        </div>
      </header>

      <section style={styles.statsGrid}>
        <article style={styles.statCard}>
          <p style={styles.statLabel}>Pending requests</p>
          <h3 style={styles.statValue}>{pickupRequests.length}</h3>
          <p style={styles.statFoot}>{dumpsite ? 'Dumpsite ready' : 'Set a dumpsite to start routing'}</p>
        </article>
        <article style={styles.statCard}>
          <p style={styles.statLabel}>Today's earnings</p>
          <h3 style={styles.statValue}>₱{earnings.toFixed(2)}</h3>
          <p style={styles.statFoot}>{jobsCompleted} jobs completed</p>
        </article>
        <article style={styles.statCard}>
          <p style={styles.statLabel}>Route status</p>
          <h3 style={styles.statValue}>{isDriving ? 'In progress' : 'Idle'}</h3>
          <p style={styles.statFoot}>{route.length ? `${route.length} points queued` : 'Awaiting calculation'}</p>
        </article>
      </section>

      <div style={styles.layout}>
        <section style={styles.mapCard}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.cardEyebrow}>Live fleet map</p>
              <h3 style={styles.cardTitle}>Navigate pickups with confidence</h3>
            </div>
            <div style={styles.cardActions}>
              <button style={styles.ghostButton} onClick={handleSetDumpsiteHere}>
                Set dumpsite here
              </button>
              <button
                style={{ ...styles.primaryButton, opacity: isDriving ? 0.7 : 1 }}
                onClick={handleCalculateRoute}
                disabled={isDriving}
              >
                {isDriving ? 'Route in progress…' : 'Start calculating route'}
              </button>
            </div>
          </div>
          <div style={styles.mapWrapper}>
            <MapContainer center={[truckPosition.lat, truckPosition.lng]} zoom={15} style={styles.map}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[truckPosition.lat, truckPosition.lng]} icon={TruckIcon} />
              {pickupRequests.map((req) => (
                <Marker key={req.id} position={[req.lat, req.lng]} />
              ))}
              {dumpsite && <Marker position={[dumpsite.lat, dumpsite.lng]} />}
              {route && route.length > 0 && (
                <Polyline positions={route.map((p) => [p.lat, p.lng])} color="blue" />
              )}
              <TruckMoveHandler onMove={isDriving || currentStop ? null : handleTruckMove} />
              <RecenterButton position={[truckPosition.lat, truckPosition.lng]} />
            </MapContainer>
          </div>
          <p style={styles.mapHint}>
            {isDriving
              ? 'Route playback in progress. The truck follows the calculated path automatically.'
              : 'Click the map to reposition the truck manually and broadcast the update to users.'}
          </p>
        </section>

        <aside style={styles.sidePanel}>
          {currentStop ? (
            <div style={styles.stopCard}>
              <p style={styles.cardEyebrow}>Arrival detected</p>
              <h4 style={styles.stopTitle}>User {currentStop.id}</h4>
              <p style={styles.stopMeta}>Confirm before resuming the route.</p>
              <div style={styles.stopActions}>
                <button style={styles.successButton} onClick={() => handlePickupResult('success')}>
                  Pickup successful
                </button>
                <button style={styles.failButton} onClick={() => handlePickupResult('failed')}>
                  Pickup not completed
                </button>
              </div>
            </div>
          ) : lastPickup ? (
            <div style={styles.historyCard}>
              <p style={styles.cardEyebrow}>Latest update</p>
              <h4 style={styles.stopTitle}>User {lastPickup.id}</h4>
              <p style={{ ...styles.stopMeta, color: lastPickup.status === 'success' ? '#15803d' : '#b91c1c' }}>
                {lastPickup.status === 'success'
                  ? `Pickup successful (+${lastPickup.points} pts)`
                  : 'Pickup could not be completed'}
              </p>
            </div>
          ) : (
            <div style={styles.historyCard}>
              <p style={styles.cardEyebrow}>Latest update</p>
              <p style={styles.stopMeta}>No pickups processed yet.</p>
            </div>
          )}

          <div style={styles.queueCard}>
            <div style={styles.cardHeaderRow}>
              <h4 style={styles.cardTitle}>Pickup queue</h4>
              <span style={styles.queueBadge}>{pickupRequests.length}</span>
            </div>
            {pickupRequests.length === 0 ? (
              <p style={styles.stopMeta}>Waiting for residents to request pickups…</p>
            ) : (
              <ul style={styles.queueList}>
                {pickupRequests.slice(0, 5).map((req) => (
                  <li key={req.id} style={styles.queueItem}>
                    <div>
                      <p style={styles.queueId}>User {req.id}</p>
                      <p style={styles.queueCoords}>
                        {req.lat.toFixed(3)}, {req.lng.toFixed(3)}
                      </p>
                    </div>
                    <span style={styles.queueStatus}>{req.status || 'pending'}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {jobOffer ? (
            <div style={styles.jobCard}>
              <div style={styles.cardHeaderRow}>
                <h4 style={styles.cardTitle}>Incoming job</h4>
                <span style={styles.timer}>{countdown}s</span>
              </div>
              <p style={styles.jobMeta}>Recyclables pickup • 1.2km away</p>
              <p style={styles.jobMeta}>Earnings: ₱{jobOffer.earnings.toFixed(2)}</p>
              <div style={styles.stopActions}>
                <button style={styles.failButton} onClick={handleDecline}>Decline</button>
                <button style={styles.successButton} onClick={handleAccept}>Accept</button>
              </div>
            </div>
          ) : (
            <div style={styles.jobCardMuted}>
              <h4 style={styles.cardTitle}>No job offers</h4>
              <p style={styles.stopMeta}>Stay online to receive requests in real time.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  page: {
    fontFamily: 'Inter, sans-serif',
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f3f8ff 0%, #ffffff 70%)',
    padding: '32px clamp(16px, 4vw, 56px)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    alignItems: 'center',
  },
  heroBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '999px',
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    color: '#1d4ed8',
    fontWeight: 600,
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  heroTitle: {
    margin: '0 0 10px',
    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
    color: '#0f172a',
  },
  heroSubtitle: {
    margin: '0 0 18px',
    color: '#475569',
    lineHeight: 1.5,
  },
  heroActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  heroButton: {
    padding: '10px 20px',
    borderRadius: '999px',
    border: '1px solid rgba(15, 23, 42, 0.2)',
    background: 'white',
    color: '#0f172a',
    cursor: 'pointer',
  },
  heroButtonActive: {
    padding: '10px 20px',
    borderRadius: '999px',
    border: 'none',
    background: 'linear-gradient(120deg, #2563eb, #38bdf8)',
    color: '#fff',
    cursor: 'pointer',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fff',
    borderRadius: '18px',
    padding: '16px 20px',
    boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
  },
  profileAvatar: { width: 56, height: 56, borderRadius: '50%' },
  profileName: { margin: 0, color: '#0f172a' },
  profileStatus: { margin: 0, color: '#64748b', fontSize: '0.85rem' },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 10px 20px rgba(15, 23, 42, 0.05)',
  },
  statLabel: { margin: 0, color: '#64748b', fontSize: '0.85rem' },
  statValue: { margin: '6px 0 0', fontSize: '1.8rem', color: '#0f172a' },
  statFoot: { margin: '4px 0 0', color: '#94a3b8', fontSize: '0.85rem' },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)',
    gap: '24px',
    alignItems: 'flex-start',
  },
  mapCard: {
    backgroundColor: '#fff',
    borderRadius: '24px',
    padding: '20px',
    boxShadow: '0 20px 35px rgba(15, 23, 42, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  cardEyebrow: {
    margin: 0,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: '#94a3b8',
  },
  cardTitle: { margin: '4px 0 0', color: '#0f172a' },
  cardActions: { display: 'flex', gap: '12px', flexWrap: 'wrap' },
  ghostButton: {
    padding: '10px 18px',
    borderRadius: '12px',
    border: '1px solid rgba(15, 23, 42, 0.2)',
    background: 'white',
    cursor: 'pointer',
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
  },
  mapWrapper: {
    borderRadius: '18px',
    overflow: 'hidden',
    width: '100%',
  },
  map: {
    width: '100%',
    minHeight: '360px',
  },
  mapHint: {
    margin: 0,
    color: '#64748b',
    fontSize: '0.85rem',
  },
  sidePanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  stopCard: {
    backgroundColor: '#fef3c7',
    borderRadius: '18px',
    padding: '18px',
    border: '1px solid #fde68a',
  },
  stopTitle: { margin: '4px 0', color: '#78350f' },
  stopMeta: { margin: 0, color: '#7c8795', fontSize: '0.9rem' },
  stopActions: { display: 'flex', gap: '10px', marginTop: '12px' },
  successButton: {
    flex: 1,
    backgroundColor: '#22c55e',
    border: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  failButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    border: 'none',
    color: '#fff',
    padding: '10px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 10px 20px rgba(15,23,42,0.05)',
  },
  queueCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 10px 20px rgba(15,23,42,0.05)',
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  queueBadge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.8rem',
  },
  queueList: {
    listStyle: 'none',
    margin: '12px 0 0',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  queueItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
  },
  queueId: { margin: 0, color: '#0f172a', fontWeight: 600 },
  queueCoords: { margin: 0, color: '#475569', fontSize: '0.85rem' },
  queueStatus: { color: '#475569', fontSize: '0.85rem', textTransform: 'capitalize' },
  jobCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '18px',
    boxShadow: '0 12px 24px rgba(15,23,42,0.08)',
  },
  jobCardMuted: {
    backgroundColor: '#f8fafc',
    borderRadius: '16px',
    padding: '18px',
    border: '1px dashed #cbd5f5',
  },
  timer: {
    backgroundColor: '#f97316',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.8rem',
  },
  jobMeta: {
    margin: '6px 0 0',
    color: '#475569',
    fontSize: '0.9rem',
  },
  recenterButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    zIndex: 1001,
    backgroundColor: '#fff',
    border: '1px solid rgba(15,23,42,0.15)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '18px',
  },
};

export default CollectorPage;
