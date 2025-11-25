import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/socket';
import CollectorHeader from './CollectorHeader';
import LiveCollectorMap from './LiveCollectorMap';
import PickupRequestCard from './PickupRequestCard';
import RequestDetailsModal from './RequestDetailsModal';
import { styles } from './collectorStyles';
import './CollectorDashboard.css';

const BroadcastView = ({ collectorName, onStatusChange, isOnline }) => {
    const { socket } = useSocket();
    const [truckPosition, setTruckPosition] = useState(null);
    const [isBroadcasting, setIsBroadcasting] = useState(false);
    const [route, setRoute] = useState([]);
    const [pickupRequests, setPickupRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [dumpsite, setDumpsite] = useState(null);
    const [isSettingDumpsite, setIsSettingDumpsite] = useState(false);
    const [currentStop, setCurrentStop] = useState(null);

    // Simulation refs
    const driveIntervalRef = useRef(null);
    const routeIndexRef = useRef(0);
    const isPausedRef = useRef(false);

    // Helper functions for simulation (defined outside useEffect)
    const startSimulation = (routePoints) => {
        stopSimulation();
        setIsBroadcasting(true);
        routeIndexRef.current = 0;

        driveIntervalRef.current = setInterval(() => {
            if (isPausedRef.current) return; // Pause when at a pickup location

            const nextPoint = routePoints[routeIndexRef.current];
            if (!nextPoint) {
                stopSimulation();
                return;
            }

            setTruckPosition(nextPoint);
            socket.emit('updateLocation', nextPoint);

            routeIndexRef.current++;
            if (routeIndexRef.current >= routePoints.length) {
                // Route complete - stop at dumpsite
                stopSimulation();
                alert('Route completed! All pickups finished.');
            }
        }, 200); // Fast update for demo
    };

    const stopSimulation = () => {
        if (driveIntervalRef.current) {
            clearInterval(driveIntervalRef.current);
            driveIntervalRef.current = null;
        }
        setIsBroadcasting(false);
        isPausedRef.current = false;
    };

    useEffect(() => {
        // Listen for truck updates (self)
        const handleTruckUpdate = (pos) => {
            setTruckPosition(pos);
        };

        const applySnapshot = (data) => {
            if (data) {
                setPickupRequests(data.pickupRequests || []);
                setRoute(data.route || []);
                if (data.truckPosition) setTruckPosition(data.truckPosition);
                if (data.dumpsite) setDumpsite(data.dumpsite);
            }
        };

        socket.on('newTruckLocation', handleTruckUpdate);
        socket.on('initialData', applySnapshot);
        socket.on('latestData', applySnapshot);

        socket.on('newPickupRequest', (request) => {
            if (!request) return;
            setPickupRequests((prev) => {
                const withoutExisting = prev.filter((r) => r.id !== request.id);
                return [...withoutExisting, request];
            });
        });

        socket.on('pickupStatusUpdated', (updatedRequest) => {
            setPickupRequests((prev) => prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)));
        });

        // Listen for route calculation (for simulation)
        socket.on('routeCalculated', (newRoute) => {
            setRoute(newRoute || []);
            if (newRoute && newRoute.length > 0) {
                startSimulation(newRoute);
            }
        });

        socket.on('pickupReached', (request) => {
            if (!request || request.status !== 'pending') return;
            setCurrentStop(request);
            isPausedRef.current = true;
        });

        socket.on('requestCancelled', (requestId) => {
            setPickupRequests((prev) => prev.filter((req) => req.id !== requestId));
            if (currentStop?.id === requestId) {
                setCurrentStop(null);
                isPausedRef.current = false;
            }
        });

        socket.on('dumpsiteUpdated', (newDumpsite) => {
            setDumpsite(newDumpsite);
        });

        return () => {
            socket.off('newTruckLocation', handleTruckUpdate);
            socket.off('initialData');
            socket.off('latestData');
            socket.off('newPickupRequest');
            socket.off('pickupStatusUpdated');
            socket.off('routeCalculated');
            socket.off('pickupReached');
            socket.off('requestCancelled');
            socket.off('dumpsiteUpdated');
            stopSimulation();
        };
    }, [socket]);

    const handleStartRoute = () => {
        // For demo: request a route to simulate movement
        // In real app: this would just start GPS tracking
        if (isBroadcasting) {
            stopSimulation();
        } else {
            // Trigger a route calculation to get points to simulate
            // We'll use a dummy dumpsite for now or the current location
            const targetDumpsite = dumpsite || { lat: 9.3068, lng: 123.3054 };
            socket.emit('calculateRoute', { dumpsite: targetDumpsite });
            setIsBroadcasting(true);
        }
    };

    const handleOptimizeRoute = () => {
        // Simple sort by distance to current truck position (mock optimization)
        if (!truckPosition || pickupRequests.length === 0) return;

        const sorted = [...pickupRequests].sort((a, b) => {
            const distA = Math.hypot(a.lat - truckPosition.lat, a.lng - truckPosition.lng);
            const distB = Math.hypot(b.lat - truckPosition.lat, b.lng - truckPosition.lng);
            return distA - distB;
        });

        setPickupRequests(sorted);
        alert('Route optimized based on proximity!');
    };

    const handleRequestAction = (id, status, reason = null) => {
        socket.emit('pickupResult', { id, status, collectorName, reason });
        setSelectedRequest(null);
        setCurrentStop(null);
        isPausedRef.current = false; // Resume route after marking pickup
    };

    const handleMapClick = (coords) => {
        if (isSettingDumpsite) {
            setDumpsite(coords);
            setIsSettingDumpsite(false);
            // Optionally emit dumpsite update if backend supports it
        } else {
            // Manual truck movement (if needed)
            // setTruckPosition(coords);
            // socket.emit('updateLocation', coords);
        }
    };

    const pendingRequests = pickupRequests.filter(req => !req.status || req.status === 'pending');

    return (
        <div className="collector-page">
            <CollectorHeader
                collectorName={collectorName}
                status={isOnline ? 'available' : 'offline'}
                onStatusChange={onStatusChange}
            />

            <div className="collector-layout">
                <div className="collector-main">
                    {/* LGU Specific Banner */}
                    <div style={{
                        marginBottom: '16px',
                        padding: '16px',
                        backgroundColor: '#fff7ed', // Orange 50
                        border: '1px solid #fed7aa',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#f97316',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem'
                        }}>
                            🏛️
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, color: '#9a3412', fontSize: '1.1rem' }}>Government Collection Unit</h3>
                            <p style={{ margin: '4px 0 0', color: '#c2410c', fontSize: '0.9rem' }}>
                                You are broadcasting your location to residents. Follow your assigned route.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setIsSettingDumpsite(!isSettingDumpsite)}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: isSettingDumpsite ? '#f59e0b' : '#fff',
                                    color: isSettingDumpsite ? 'white' : '#f59e0b',
                                    border: '1px solid #f59e0b',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                }}
                            >
                                {isSettingDumpsite ? 'Click Map to Set' : 'Set Dumpsite'}
                            </button>
                            <button
                                onClick={handleStartRoute}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: isBroadcasting ? '#ef4444' : '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                }}
                            >
                                {isBroadcasting ? 'Stop Route' : 'Start Route'}
                            </button>
                        </div>
                    </div>

                    <LiveCollectorMap
                        truckPosition={truckPosition}
                        pickupRequests={pendingRequests} // LGU sees all pending requests
                        route={route}
                        dumpsite={dumpsite}
                        onMapClick={handleMapClick}
                        allowInteraction={true}
                    />
                </div>

                <div className="collector-sidebar">
                    {/* Current Stop - Paused for Verification */}
                    {currentStop && (
                        <div style={{
                            marginBottom: '16px',
                            padding: '16px',
                            backgroundColor: '#fef3c7',
                            border: '2px solid #f59e0b',
                            borderRadius: '12px'
                        }}>
                            <h4 style={{ margin: '0 0 8px', color: '#92400e', fontSize: '0.9rem' }}>⏸️ Truck Paused at Pickup</h4>
                            <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#78350f' }}>
                                #{currentStop.id.slice(0, 6)} - {currentStop.wasteType || 'Standard'}
                            </p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleRequestAction(currentStop.id, 'success')}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✓ Success
                                </button>
                                <button
                                    onClick={() => setSelectedRequest(currentStop)}
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ✗ Report Issue
                                </button>
                            </div>
                        </div>
                    )}

                    <div style={styles.queueCard}>
                        <div style={styles.cardHeaderRow}>
                            <h4 style={styles.cardTitle}>Route Plan</h4>
                            <button
                                onClick={handleOptimizeRoute}
                                style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 8px',
                                    backgroundColor: '#e0f2fe',
                                    color: '#0284c7',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                            >
                                ⚡ Optimize
                            </button>
                        </div>
                        <ul style={styles.queueList}>
                            {pendingRequests.map((req) => (
                                <li
                                    key={req.id}
                                    style={{ ...styles.queueItem, cursor: 'pointer' }}
                                    onClick={() => setSelectedRequest(req)}
                                >
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <p style={styles.queueId}>#{req.id.slice(0, 6)}</p>
                                            <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                                                {req.wasteType}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#4b5563', margin: '4px 0 0' }}>
                                            Lat: {req.lat.toFixed(4)}, Lng: {req.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </li>
                            ))}
                            {pendingRequests.length === 0 && (
                                <li style={{ padding: '16px', textAlign: 'center', color: '#9ca3af' }}>
                                    No pending pickups
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

            <RequestDetailsModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
                onAccept={(id) => handleRequestAction(id, 'success')}
                onReportIssue={(id, reason) => handleRequestAction(id, 'failed', reason)}
                workerType="government"
            />
        </div>
    );
};

export default BroadcastView;
