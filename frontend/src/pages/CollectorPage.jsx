import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/socket';
import BroadcastView from '../components/collector/BroadcastView';
import GigView from '../components/collector/GigView';

const CollectorPage = () => {
  const { socket } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [workerType, setWorkerType] = useState('freelancer'); // Default to freelancer for demo
  const [collectorName, setCollectorName] = useState('Route Team');

  useEffect(() => {
    // Load worker profile from localStorage
    const storedName = localStorage.getItem('workerName');
    const storedType = localStorage.getItem('workerType');

    if (storedName) setCollectorName(storedName);
    if (storedType) setWorkerType(storedType);

    // Connect socket
    socket.emit('collectorConnect');
  }, [socket]);

  const handleStatusChange = (newStatus) => {
    setIsOnline(newStatus);
    socket.emit('setStatus', newStatus ? 'online' : 'offline');
  };

  // Render the appropriate view based on worker type
  if (workerType === 'government') {
    return (
      <BroadcastView
        collectorName={collectorName}
        isOnline={isOnline}
        onStatusChange={handleStatusChange}
      />
    );
  }

  return (
    <GigView
      collectorName={collectorName}
      isOnline={isOnline}
      onStatusChange={handleStatusChange}
    />
  );
};

export default CollectorPage;
