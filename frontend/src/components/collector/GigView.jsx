import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/socket';
import CollectorHeader from './CollectorHeader';
import ProfileCard from './ProfileCard';
import LiveCollectorMap from './LiveCollectorMap';
import PickupRequestCard from './PickupRequestCard';
import RouteControls from './RouteControls';
import TrafficReportButton from './TrafficReportButton';
import PickupHistoryPanel from './PickupHistoryPanel';

import IconSelectorModal from './IconSelectorModal';
import RequestDetailsModal from './RequestDetailsModal';
import JunkshopFinder from './JunkshopFinder';
import { styles } from './collectorStyles';
import brgyData from '../../data/brgy.json';
import './CollectorDashboard.css';

const GigView = ({ collectorName, onStatusChange, isOnline }) => {
    const { socket } = useSocket();

    // State
    const [jobsCompleted, setJobsCompleted] = useState(0);
    const [jobOffer, setJobOffer] = useState(null);
    const [truckPosition, setTruckPosition] = useState(null);
    const [pickupRequests, setPickupRequests] = useState([]);
    const [dumpsite, setDumpsite] = useState(null);
    const [route, setRoute] = useState([]);
    const [isDriving, setIsDriving] = useState(false);
    const [currentStop, setCurrentStop] = useState(null);

    const [selectedIcon, setSelectedIcon] = useState(() => localStorage.getItem('collectorIcon') || 'gray');
    const [showIconSelector, setShowIconSelector] = useState(false);

    // New State for Features
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [totalEarnings, setTotalEarnings] = useState(0); // Fetch from backend
    const [wasteFilter, setWasteFilter] = useState('all'); // 'all', 'recyclable', 'bulk'
    const [isSettingDumpsite, setIsSettingDumpsite] = useState(false);
    const [showJunkshopFinder, setShowJunkshopFinder] = useState(false);
    const [lastCompletedRequest, setLastCompletedRequest] = useState(null);

    // Fetch worker earnings from backend
    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await fetch('/api/worker/earnings', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched earnings:', data);
                    setTotalEarnings(data.earnings_wallet || 0);
                } else {
                    console.error('Failed to fetch earnings, status:', response.status);
                }
            } catch (error) {
                console.error('Failed to fetch earnings:', error);
            }
        };

        fetchEarnings();
    }, []);

    const driveIntervalRef = useRef(null);
    const isPausedRef = useRef(false);

    const profileIcons = {
        gray: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='100'%20height='100'%3e%3crect%20width='100'%20height='100'%20fill='gray'%20/%3e%3c/svg%3e",
        blue: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='100'%20height='100'%3e%3crect%20width='100'%20height='100'%20fill='blue'%20/%3e%3c/svg%3e",
        green: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='100'%20height='100'%3e%3crect%20width='100'%20height='100'%20fill='green'%20/%3e%3c/svg%3e",
        red: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='100'%20height='100'%3e%3crect%20width='100'%20height='100'%20fill='red'%20/%3e%3c/svg%3e",
        purple: "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20width='100'%20height='100'%3e%3crect%20width='100'%20height='100'%20fill='purple'%20/%3e%3c/svg%3e",
    };

    // --- Socket Listeners (Similar to original CollectorPage) ---
    useEffect(() => {
        const handleTruckUpdate = (pos) => setTruckPosition(pos);

        const applySnapshot = (data) => {
            if (data) {
                setPickupRequests(data.pickupRequests || []);
                setDumpsite(data.dumpsite || null);
                if (data.truckPosition) setTruckPosition(data.truckPosition);
                setRoute(data.route || []);
            }
        };

        // Handle socket reconnection - critical for rural areas with spotty internet
        const handleReconnect = () => {
            console.log('Socket reconnected! Re-fetching latest state...');
            socket.emit('requestLatestData');
        };

        socket.on('connect', handleReconnect);
        socket.on('initialData', applySnapshot);
        socket.on('latestData', applySnapshot);
        socket.on('newTruckLocation', handleTruckUpdate);

        socket.on('newPickupRequest', (request) => {
            if (!request) return;
            setPickupRequests((prev) => {
                const withoutExisting = prev.filter((r) => r.id !== request.id);
                return [...withoutExisting, request];
            });
        });

        socket.on('routeCalculated', (newRoute) => {
            const safeRoute = newRoute || [];
            setRoute(safeRoute);
            if (safeRoute.length > 0) startRoutePlayback(safeRoute);
        });

        socket.on('jobOffer', (offer) => setJobOffer(offer));
        socket.on('statsUpdated', (stats) => setJobsCompleted(stats.jobsCompleted));

        socket.on('pickupStatusUpdated', (updatedRequest) => {
            setPickupRequests((prev) => prev.map((req) => (req.id === updatedRequest.id ? updatedRequest : req)));
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

        // Request initial data on mount
        socket.emit('requestLatestData');

        return () => {
            stopRoutePlayback();
            socket.off('connect');
            socket.off('initialData');
            socket.off('latestData');
            socket.off('newTruckLocation');
            socket.off('newPickupRequest');
            socket.off('routeCalculated');
            socket.off('jobOffer');
            socket.off('statsUpdated');
            socket.off('pickupStatusUpdated');
            socket.off('pickupReached');
            socket.off('requestCancelled');
            socket.off('dumpsiteUpdated');
        };
    }, [socket]);

    // --- Handlers ---
    const handleStatusChangeInternal = (newStatus) => {
        onStatusChange(newStatus);
    };

    const handleAcceptJob = () => {
        if (!jobOffer) return;
        socket.emit('acceptJob', { offerId: jobOffer.id, collectorName });
        setJobOffer(null);
    };

    const handleDeclineJob = () => {
        setJobOffer(null);
    };

    const handleMapClick = (coords) => {
        if (isSettingDumpsite) {
            setDumpsite(coords);
            setIsSettingDumpsite(false);
        } else if (!isDriving) {
            // Allow manual movement if not driving route
            setTruckPosition(coords);
            socket.emit('updateLocation', coords);
        }
    };

    const startRoutePlayback = (routePoints) => {
        if (driveIntervalRef.current) clearInterval(driveIntervalRef.current);
        setIsDriving(true);
        let index = 0;

        driveIntervalRef.current = setInterval(() => {
            if (isPausedRef.current) return;

            if (index >= routePoints.length) {
                stopRoutePlayback();
                return;
            }

            const point = routePoints[index];
            setTruckPosition(point);
            socket.emit('updateLocation', point);
            index++;

            if (index >= routePoints.length) {
                stopRoutePlayback();
                alert('Route completed! All pickups finished.');
            }
        }, 200); // Fast update for demo
    };

    const stopRoutePlayback = () => {
        if (driveIntervalRef.current) {
            clearInterval(driveIntervalRef.current);
            driveIntervalRef.current = null;
        }
        setIsDriving(false);
        isPausedRef.current = false;
    };

    const handleCalculateRoute = () => {
        if (!dumpsite) {
            alert('Need dumpsite to calculate route.');
            return;
        }
        socket.emit('calculateRoute', { dumpsite });
    };

    const handlePickupResult = (status) => {
        if (!currentStop) return;

        if (status === 'success') {
            // Calculate earnings
            const request = pickupRequests.find(r => r.id === currentStop.id);
            // Use actual price for bulk waste (80% goes to collector), or 50 for regular
            const earnings = request?.wasteType === 'bulk' ? (request.price || 200) * 0.8 : 50;
            setTotalEarnings(prev => prev + earnings);

            // Check for Partner Junk Shop suggestion if recyclable
            if (request?.wasteType === 'recyclable' || request?.wasteType === 'biodegradable') {
                const savedDumpsites = localStorage.getItem('barangayDumpsites');
                if (savedDumpsites) {
                    const dumpsites = JSON.parse(savedDumpsites);
                    // Find a partner in the current barangay or nearby
                    // For demo, just find ANY partner
                    const partner = Object.values(dumpsites).find(d => d.type === 'junkshop');

                    if (partner) {
                        // Mock buying prices for the "Smart Routing" feature
                        const buyingPrices = "Buying: Copper ₱300/kg, Cans ₱15/kg, Karton ₱4/kg";

                        const confirmSell = window.confirm(
                            `♻️ DOUBLE INCOME OPPORTUNITY!\n\n` +
                            `Partner Junk Shop Found: ${partner.barangayName} Junk Shop\n` +
                            `Distance: ~1.2 km\n` +
                            `${buyingPrices}\n\n` +
                            `Do you want to route there now to sell this load?`
                        );
                        if (confirmSell) {
                            setDumpsite({ lat: partner.lat, lng: partner.lng });
                            alert(`Routing to ${partner.barangayName} Junk Shop...\n\nDrive safe! 🚚`);
                        }
                    }
                }
            }
        }

        socket.emit('pickupResult', { id: currentStop.id, status, collectorName });

        // Store last completed request for junkshop finder
        if (status === 'success') {
            setLastCompletedRequest(currentStop);
        }

        setCurrentStop(null);
        setSelectedRequest(null);
        isPausedRef.current = false;
    };

    const handleAcceptRequest = (requestId) => {
        const request = pickupRequests.find(r => r.id === requestId);
        if (request) {
            setCurrentStop(request);
            // In a real app, emit 'acceptJob' to server
        }
    };

    // Filter requests
    const filteredRequests = pickupRequests.filter(req => {
        if (req.status && req.status !== 'pending') return false;
        if (wasteFilter === 'all') return true;
        if (wasteFilter === 'recyclable') return ['recyclable', 'biodegradable'].includes(req.wasteType);
        return req.wasteType === wasteFilter;
    });

    const pendingRequests = filteredRequests;
    const pickupHistory = pickupRequests.filter(req => req.status && req.status !== 'pending').slice(0, 5);

    // Map only shows CURRENT STOP for privacy
    const mapRequests = currentStop ? [currentStop] : [];

    return (
        <div className="collector-page">
            <CollectorHeader
                collectorName={collectorName}
                status={isOnline ? 'available' : 'offline'}
                onStatusChange={handleStatusChangeInternal}
            />

            <ProfileCard
                collectorName={collectorName}
                profileIcon={profileIcons[selectedIcon]}
                completedJobs={jobsCompleted}
                onIconClick={() => setShowIconSelector(true)}
                earnings={totalEarnings}
            />

            <div className="collector-layout">
                <div className="collector-main">
                    {/* Freelancer Specific Banner */}
                    <div style={{
                        marginBottom: '16px',
                        padding: '16px',
                        backgroundColor: '#ecfdf5', // Emerald 50
                        border: '1px solid #a7f3d0',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            backgroundColor: '#10b981',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem'
                        }}>
                            🚛
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, color: '#065f46', fontSize: '1.1rem' }}>Freelance Collector</h3>
                            <p style={{ margin: '4px 0 0', color: '#047857', fontSize: '0.9rem' }}>
                                You are in control. Accept jobs, set your route, and earn per pickup.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsSettingDumpsite(!isSettingDumpsite)}
                            style={{
                                padding: '8px 16px',
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
                    </div>

                    <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
                        <div style={{
                            flex: 1,
                            backgroundColor: 'white',
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <div>
                                <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Total Earnings</p>
                                <h3 style={{ margin: '4px 0 0', fontSize: '1.5rem', color: '#10b981' }}>₱{totalEarnings}</h3>
                            </div>
                            <div style={{ fontSize: '2rem' }}>💰</div>
                        </div>
                    </div>

                    <LiveCollectorMap
                        truckPosition={truckPosition}
                        pickupRequests={mapRequests}
                        route={route}
                        dumpsite={dumpsite}
                        onMapClick={handleMapClick}
                        allowInteraction={true}
                    />

                    <div style={{ marginTop: '16px' }}>
                        <RouteControls
                            route={route}
                            isPlaying={isDriving}
                            onCalculateRoute={handleCalculateRoute}
                            onStartPlayback={() => startRoutePlayback(route)}
                            onStopPlayback={stopRoutePlayback}
                        />
                    </div>
                </div>

                <div className="collector-sidebar">
                    {currentStop && (
                        <PickupRequestCard
                            request={currentStop}
                            onAccept={() => handlePickupResult('success')}
                            onDecline={() => handlePickupResult('failed')}
                            isActive={true}
                            isPaid={currentStop.wasteType === 'bulk'}
                            earnings={currentStop.wasteType === 'bulk' ? (currentStop.price || 200) * 0.8 : 0}
                        />
                    )}

                    {/* Find Junkshop Button - Show after completing recyclable pickup */}
                    {lastCompletedRequest && ['recyclable', 'biodegradable'].includes(lastCompletedRequest.wasteType) && (
                        <div style={{
                            backgroundColor: '#ecfdf5',
                            border: '2px solid #10b981',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '16px'
                        }}>
                            <div style={{ marginBottom: '12px' }}>
                                <h4 style={{ margin: '0 0 4px', color: '#065f46', fontSize: '0.9rem' }}>
                                    ♻️ Recyclable Pickup Completed!
                                </h4>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#047857' }}>
                                    Maximize your earnings by selling to a junkshop
                                </p>
                            </div>
                            <button
                                onClick={() => setShowJunkshopFinder(true)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                🏪 Find Nearest Junkshop
                            </button>
                            <button
                                onClick={() => setLastCompletedRequest(null)}
                                style={{
                                    width: '100%',
                                    marginTop: '8px',
                                    padding: '6px',
                                    backgroundColor: 'transparent',
                                    color: '#6b7280',
                                    border: 'none',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Dismiss
                            </button>
                        </div>
                    )}

                    {pendingRequests.length > 0 && !currentStop && (
                        <div style={styles.queueCard}>
                            <div style={styles.cardHeaderRow}>
                                <h4 style={styles.cardTitle}>Pickup Queue</h4>
                                <span style={styles.queueBadge}>{pendingRequests.length}</span>
                            </div>

                            {/* Filters */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', padding: '0 16px' }}>
                                {['all', 'recyclable', 'bulk'].map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setWasteFilter(filter)}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '16px',
                                            border: 'none',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            backgroundColor: wasteFilter === filter ? '#10b981' : '#f3f4f6',
                                            color: wasteFilter === filter ? 'white' : '#4b5563',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            <ul style={styles.queueList}>
                                {pendingRequests.map((req) => (
                                    <li
                                        key={req.id}
                                        style={{ ...styles.queueItem, cursor: 'pointer' }}
                                        onClick={() => setSelectedRequest(req)}
                                    >
                                        <div>
                                            <p style={styles.queueId}>#{req.id.slice(0, 6)}</p>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: req.wasteType === 'bulk' ? '#e0e7ff' : '#f3f4f6',
                                                    color: req.wasteType === 'bulk' ? '#4338ca' : '#374151'
                                                }}>
                                                    {req.wasteType === 'bulk' ? '🚛 Bulk' : '🗑️ Standard'}
                                                </span>
                                                {req.wasteType === 'bulk' && req.price && (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d' }}>
                                                        💰 ₱{Math.round((req.price || 200) * 0.8)}
                                                    </span>
                                                )}
                                                {req.wasteType !== 'bulk' && (
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#15803d' }}>
                                                        💰 ₱50
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <PickupHistoryPanel history={pickupHistory} />
                </div>
            </div>

            <IconSelectorModal
                isOpen={showIconSelector}
                currentIcon={selectedIcon}
                profileIcons={profileIcons}
                onSelect={(icon) => {
                    setSelectedIcon(icon);
                    localStorage.setItem('collectorIcon', icon);
                    setShowIconSelector(false);
                }}
                onClose={() => setShowIconSelector(false)}
            />

            <RequestDetailsModal
                isOpen={!!selectedRequest}
                onClose={() => setSelectedRequest(null)}
                request={selectedRequest}
                onAccept={handleAcceptRequest}
                onDecline={() => setSelectedRequest(null)}
                workerType="freelancer"
            />

            <JunkshopFinder
                isOpen={showJunkshopFinder}
                onClose={() => setShowJunkshopFinder(false)}
                currentPosition={truckPosition}
                wasteType={lastCompletedRequest?.wasteType || 'recyclable'}
                onRouteToJunkshop={(junkshopLocation, junkshopName) => {
                    // Set junkshop as dumpsite
                    setDumpsite(junkshopLocation);

                    // Automatically calculate route
                    socket.emit('calculateRoute', { dumpsite: junkshopLocation });

                    // Show notification
                    alert(`🏪 Routing to ${junkshopName}!\n\nCalculating optimal route...\nFollow the blue line on the map.`);

                    // Clear last completed request
                    setLastCompletedRequest(null);
                }}
            />
        </div>
    );
};

export default GigView;
