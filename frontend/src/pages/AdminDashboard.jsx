import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/socket';
import { barangayDumpsites } from '../components/admin/adminConstants';
import { styles } from '../components/admin/adminStyles';
import Sidebar from '../components/admin/Sidebar';
import OverviewPanel from '../components/admin/OverviewPanel';
import MapSettingsPanel from '../components/admin/MapSettingsPanel';
import ReviewsPanel from '../components/admin/ReviewsPanel';
import UsersWorkersPanel from '../components/admin/UsersWorkersPanel';
import WorkerAssignmentPanel from '../components/admin/WorkerAssignmentPanel';
import BarangayRankings from '../components/admin/BarangayRankings';

const AdminDashboard = () => {
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('overview');

  // Data State
  const [ratings, setRatings] = useState([]);
  const [trafficReports, setTrafficReports] = useState([]);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [truckPosition, setTruckPosition] = useState(null);
  const [dumpsite, setDumpsite] = useState(null);
  const [selectedBarangayId, setSelectedBarangayId] = useState(barangayDumpsites[0]?.id || '');

  useEffect(() => {
    socket.emit('adminConnect');

    socket.on('adminInitialData', (data) => {
      if (data.ratings) setRatings(data.ratings);
      if (data.trafficReports) setTrafficReports(data.trafficReports);
      if (data.pickupRequests) setPickupRequests(data.pickupRequests);
    });

    socket.on('adminUpdate', (update) => {
      if (update.type === 'rating') {
        setRatings((prev) => [update.data, ...prev]);
      } else if (update.type === 'traffic') {
        setTrafficReports((prev) => [update.data, ...prev]);
      }
    });

    // Listen for live operational updates
    socket.on('newPickupRequest', (request) => {
      setPickupRequests((prev) => [...prev, request]);
    });

    socket.on('pickupStatusUpdated', (updatedRequest) => {
      setPickupRequests((prev) =>
        prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
      );
    });

    socket.on('newTruckLocation', (pos) => {
      setTruckPosition(pos);
    });

    socket.on('dumpsiteUpdated', (pos) => {
      setDumpsite(pos);
      if (pos && pos.barangay) {
        const match = barangayDumpsites.find((b) => b.name === pos.barangay);
        if (match) {
          setSelectedBarangayId(match.id);
        }
      }
    });

    return () => {
      socket.off('adminInitialData');
      socket.off('adminUpdate');
      socket.off('newPickupRequest');
      socket.off('pickupStatusUpdated');
      socket.off('newTruckLocation');
      socket.off('dumpsiteUpdated');
    };
  }, [socket]);

  const handleManualDumpsite = (lat, lng, barangayName) => {
    const location = { lat, lng, barangay: barangayName };
    setDumpsite(location);
    socket.emit('setDumpsite', location);
  };

  // Derived Stats
  const totalPickups = pickupRequests.length;
  const completedPickups = pickupRequests.filter(r => r.status === 'success').length;
  const pendingPickups = pickupRequests.filter(r => r.status === 'pending').length;
  const avgRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : 'N/A';
  const trafficIncidents = trafficReports.length;

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.pageTitle}>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'map' && 'Live Map & Dumpsite Management'}
            {activeTab === 'reviews' && 'Reviews & Moderation'}
            {activeTab === 'users' && 'Users & Workers Management'}
            {activeTab === 'assignments' && 'Worker Assignments'}
            {activeTab === 'rankings' && 'Barangay Rankings'}
            {activeTab === 'settings' && 'Dumpsite Configuration'}
          </h1>
          <div style={styles.headerActions}>
            <span style={styles.date}>{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <div style={styles.contentArea}>
          {activeTab === 'overview' && (
            <OverviewPanel
              stats={{ totalPickups, completedPickups, pendingPickups, avgRating, trafficIncidents }}
              recentActivity={[...ratings, ...trafficReports].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5)}
            />
          )}
          {(activeTab === 'map' || activeTab === 'settings') && (
            <MapSettingsPanel
              truckPosition={truckPosition}
              pickupRequests={pickupRequests}
              trafficReports={trafficReports}
              onManualDumpsite={handleManualDumpsite}
            />
          )}
          {activeTab === 'reviews' && (
            <ReviewsPanel ratings={ratings} />
          )}
          {activeTab === 'users' && (
            <UsersWorkersPanel />
          )}
          {activeTab === 'assignments' && (
            <WorkerAssignmentPanel />
          )}
          {activeTab === 'rankings' && (
            <BarangayRankings />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
