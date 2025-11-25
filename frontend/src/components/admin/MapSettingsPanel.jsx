import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { truckIcon, trashIcon, dumpsiteIcon } from './adminConstants';
import { styles } from './adminStyles';
import barangaysData from '../../../../data/brgy.json';

// Component to handle map clicks for placing dumpsites
const DumpsitePlacer = ({ onPlaceDumpsite, isPlacingMode }) => {
    useMapEvents({
        click(e) {
            if (isPlacingMode && onPlaceDumpsite) {
                onPlaceDumpsite(e.latlng.lat, e.latlng.lng);
            }
        },
    });
    return null;
};

// Component to handle map centering
const MapCenterController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom || 15);
        }
    }, [center, zoom, map]);
    return null;
};

const MapSettingsPanel = ({
    truckPosition,
    pickupRequests,
    trafficReports,
    onManualDumpsite
}) => {
    const [selectedBarangay, setSelectedBarangay] = useState(null);
    const [barangayDumpsites, setBarangayDumpsites] = useState({});
    const [isPlacingMode, setIsPlacingMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [mapCenter, setMapCenter] = useState(null);
    const [showBoundaries, setShowBoundaries] = useState(true);
    const [hoveredBoundary, setHoveredBoundary] = useState(null);
    const [barangayBoundaries, setBarangayBoundaries] = useState(null);
    const [siteType, setSiteType] = useState('dumpsite'); // 'dumpsite' or 'junkshop'

    // Load GeoJSON boundaries
    useEffect(() => {
        fetch('/dumaguete_barangay_boundaries.geojson')
            .then(response => response.json())
            .then(data => setBarangayBoundaries(data))
            .catch(error => console.error('Error loading barangay boundaries:', error));
    }, []);

    // Load saved dumpsite locations from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('barangayDumpsites');
        if (saved) {
            try {
                setBarangayDumpsites(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load dumpsite data:', e);
            }
        }
    }, []);

    // Save dumpsite locations to localStorage whenever they change
    useEffect(() => {
        if (Object.keys(barangayDumpsites).length > 0) {
            localStorage.setItem('barangayDumpsites', JSON.stringify(barangayDumpsites));
        }
    }, [barangayDumpsites]);

    const handleBarangaySelect = (barangayId) => {
        const barangay = barangaysData.barangays.find(b => b.id === parseInt(barangayId));
        setSelectedBarangay(barangay);
        setIsPlacingMode(false);
    };

    const handlePlaceDumpsite = (lat, lng) => {
        if (!selectedBarangay) {
            alert('Please select a barangay first!');
            return;
        }

        const newDumpsite = {
            barangayId: selectedBarangay.id,
            barangayName: selectedBarangay.name,
            lat,
            lng,
            type: siteType,
            timestamp: new Date().toISOString()
        };

        setBarangayDumpsites(prev => ({
            ...prev,
            [selectedBarangay.id]: newDumpsite
        }));

        // Emit to socket if callback provided
        if (onManualDumpsite) {
            onManualDumpsite(lat, lng, selectedBarangay.name);
        }

        setIsPlacingMode(false);
        alert(`Dumpsite pinned for ${selectedBarangay.name}!`);
    };

    const handleRemoveDumpsite = (barangayId) => {
        const confirmed = window.confirm('Remove this dumpsite location?');
        if (confirmed) {
            setBarangayDumpsites(prev => {
                const updated = { ...prev };
                delete updated[barangayId];
                return updated;
            });
        }
    };

    const handleSetAsActive = (barangayId) => {
        const dumpsite = barangayDumpsites[barangayId];
        if (dumpsite && onManualDumpsite) {
            onManualDumpsite(dumpsite.lat, dumpsite.lng, dumpsite.barangayName);
            alert(`Set ${dumpsite.barangayName} dumpsite as active!`);
        }
    };

    // Search functionality
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim() === '') {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        // Filter barangays based on search query
        const results = barangaysData.barangays.filter(b =>
            b.name.toLowerCase().includes(query.toLowerCase()) ||
            (b.alias && b.alias.toLowerCase().includes(query.toLowerCase()))
        );

        setSearchResults(results);
        setShowSearchResults(true);
    };

    const handleSearchSelect = (barangay) => {
        if (barangay.coordinates) {
            setMapCenter([barangay.coordinates.latitude, barangay.coordinates.longitude]);
            setSearchQuery(barangay.name);
            setShowSearchResults(false);
            setSelectedBarangay(barangay);
        }
    };

    // Boundary styling and interactions
    const getBoundaryStyle = (feature) => {
        const isHovered = hoveredBoundary === feature.properties.name;
        const isSelected = selectedBarangay?.name === feature.properties.name ||
            selectedBarangay?.name === feature.properties.alt_name;

        return {
            fillColor: isSelected ? '#10b981' : isHovered ? '#3b82f6' : '#6366f1',
            fillOpacity: isSelected ? 0.3 : isHovered ? 0.2 : 0.1,
            color: isSelected ? '#059669' : isHovered ? '#2563eb' : '#4f46e5',
            weight: isSelected ? 3 : isHovered ? 2.5 : 2,
            opacity: 0.8,
        };
    };

    const onEachBoundary = (feature, layer) => {
        const barangayName = feature.properties.name;

        layer.on({
            mouseover: (e) => {
                setHoveredBoundary(barangayName);
                layer.setStyle({
                    fillOpacity: 0.3,
                    weight: 3,
                });
            },
            mouseout: (e) => {
                setHoveredBoundary(null);
            },
            click: (e) => {
                // Find matching barangay in our data
                const matchedBarangay = barangaysData.barangays.find(b =>
                    b.name === barangayName ||
                    (feature.properties.alt_name && feature.properties.alt_name.includes(b.name))
                );

                if (matchedBarangay) {
                    setSelectedBarangay(matchedBarangay);
                    if (matchedBarangay.coordinates) {
                        setMapCenter([matchedBarangay.coordinates.latitude, matchedBarangay.coordinates.longitude]);
                    }
                }
            }
        });

        // Bind tooltip
        layer.bindTooltip(barangayName, {
            permanent: false,
            direction: 'center',
            className: 'boundary-tooltip'
        });
    };

    const dumpsiteCount = Object.keys(barangayDumpsites).length;

    return (
        <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
            {/* Control Panel */}
            <div style={styles.settingsPanel}>
                <h3 style={styles.sectionTitle}>Barangay Locations & Disposal Sites</h3>
                <p style={styles.settingsHelp}>
                    Manage official dumpsites and accredited junk shops. These locations will be visible to Eco-Warriors for bulk waste disposal.
                </p>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <label style={styles.settingsLabel} htmlFor="barangay-search">
                        🔍 Search Barangay
                    </label>
                    <input
                        id="barangay-search"
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
                        placeholder="Type barangay name or alias..."
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'border-color 0.2s',
                        }}
                    />

                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            marginTop: '4px',
                            maxHeight: '250px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            zIndex: 1000,
                        }}>
                            {searchResults.map((barangay) => (
                                <div
                                    key={barangay.id}
                                    onClick={() => handleSearchSelect(barangay)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid #f1f5f9',
                                        transition: 'background-color 0.15s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                >
                                    <div style={{ fontWeight: '600', color: '#111827' }}>
                                        {barangay.name}
                                    </div>
                                    {barangay.alias && (
                                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>
                                            {barangay.alias}
                                        </div>
                                    )}
                                    {barangay.coordinates && (
                                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '4px' }}>
                                            📍 {barangay.coordinates.location_note}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Boundary Toggle Control */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500'
                    }}>
                        <input
                            type="checkbox"
                            checked={showBoundaries}
                            onChange={(e) => setShowBoundaries(e.target.checked)}
                            style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        />
                        <span>Show Barangay Boundaries</span>
                    </label>
                    <div style={{
                        marginLeft: 'auto',
                        fontSize: '0.85rem',
                        color: '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '12px',
                            backgroundColor: '#6366f1',
                            opacity: 0.3,
                            border: '2px solid #4f46e5',
                            borderRadius: '2px'
                        }}></div>
                        <span>Boundary</span>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={styles.settingsLabel} htmlFor="barangay-select">
                            Select Barangay
                        </label>
                        <select
                            id="barangay-select"
                            value={selectedBarangay?.id || ''}
                            onChange={(e) => handleBarangaySelect(e.target.value)}
                            style={{ ...styles.settingsSelect, maxWidth: '100%', width: '100%' }}
                        >
                            <option value="">-- Choose a barangay --</option>
                            {barangaysData.barangays.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name} {b.alias ? `(${b.alias})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label style={styles.settingsLabel}>Site Type</label>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="siteType"
                                    value="dumpsite"
                                    checked={siteType === 'dumpsite'}
                                    onChange={(e) => setSiteType(e.target.value)}
                                />
                                <span>🗑️ Public Dumpsite</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                                <input
                                    type="radio"
                                    name="siteType"
                                    value="junkshop"
                                    checked={siteType === 'junkshop'}
                                    onChange={(e) => setSiteType(e.target.value)}
                                />
                                <span>♻️ Junk Shop Partner</span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsPlacingMode(!isPlacingMode)}
                        disabled={!selectedBarangay}
                        style={{
                            ...styles.primaryButton,
                            backgroundColor: isPlacingMode ? '#ef4444' : '#10b981',
                            opacity: !selectedBarangay ? 0.5 : 1,
                            cursor: !selectedBarangay ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {isPlacingMode ? '✕ Cancel Placing' : '📍 Pin Disposal Site'}
                    </button>
                </div>

                {selectedBarangay && (
                    <div style={{
                        marginTop: '12px',
                        padding: '12px',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '8px',
                        border: '1px solid #bbf7d0'
                    }}>
                        <p style={{ margin: 0, fontWeight: '600', color: '#166534' }}>
                            Selected: {selectedBarangay.name} {selectedBarangay.alias ? `(${selectedBarangay.alias})` : ''}
                        </p>
                        {isPlacingMode && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                                👆 Click anywhere on the map to place the dumpsite
                            </p>
                        )}
                        {barangayDumpsites[selectedBarangay.id] && !isPlacingMode && (
                            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#15803d' }}>
                                ✓ Dumpsite already pinned for this barangay
                            </p>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#374151' }}>
                        Pinned Dumpsites: {dumpsiteCount} / {barangaysData.total_count}
                    </p>
                    <div style={{
                        maxHeight: '200px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {Object.values(barangayDumpsites).length === 0 ? (
                            <p style={styles.emptyText}>No dumpsites pinned yet.</p>
                        ) : (
                            Object.values(barangayDumpsites)
                                .sort((a, b) => a.barangayName.localeCompare(b.barangayName))
                                .map((dumpsite) => (
                                    <div
                                        key={dumpsite.barangayId}
                                        style={{
                                            padding: '8px 12px',
                                            backgroundColor: '#fafafa',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
                                                {dumpsite.barangayName}
                                            </p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                                {dumpsite.lat.toFixed(4)}, {dumpsite.lng.toFixed(4)}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button
                                                onClick={() => handleSetAsActive(dumpsite.barangayId)}
                                                style={{
                                                    padding: '4px 8px',
                                                    fontSize: '0.75rem',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    backgroundColor: '#10b981',
                                                    color: '#fff',
                                                    cursor: 'pointer'
                                                }}
                                                title="Set as active dumpsite"
                                            >
                                                Use
                                            </button>
                                            <button
                                                onClick={() => handleRemoveDumpsite(dumpsite.barangayId)}
                                                style={{
                                                    padding: '4px 8px',
                                                    fontSize: '0.75rem',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    backgroundColor: '#ef4444',
                                                    color: '#fff',
                                                    cursor: 'pointer'
                                                }}
                                                title="Remove dumpsite"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>

            {/* Map */}
            <div style={styles.mapContainer}>
                <MapContainer
                    center={[9.3068, 123.3054]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />

                    <MapCenterController center={mapCenter} zoom={16} />

                    {/* Barangay Boundaries Layer */}
                    {showBoundaries && barangayBoundaries && (
                        <GeoJSON
                            key={JSON.stringify(barangayBoundaries)}
                            data={barangayBoundaries}
                            style={getBoundaryStyle}
                            onEachFeature={onEachBoundary}
                        />
                    )}

                    <DumpsitePlacer
                        onPlaceDumpsite={handlePlaceDumpsite}
                        isPlacingMode={isPlacingMode}
                    />

                    {/* Render all barangay locations from brgy.json */}
                    {barangaysData.barangays
                        .filter(b => b.coordinates) // Only show barangays with coordinates
                        .map((barangay) => (
                            <Marker
                                key={`barangay-${barangay.id}`}
                                position={[barangay.coordinates.latitude, barangay.coordinates.longitude]}
                                icon={dumpsiteIcon}
                            >
                                <Popup>
                                    <div>
                                        <strong>{barangay.name}</strong>
                                        {barangay.alias && <><br /><em>({barangay.alias})</em></>}
                                        <br />
                                        <small style={{ color: '#6b7280' }}>
                                            {barangay.coordinates.location_note}
                                        </small>
                                        <br />
                                        <small style={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                                            {barangay.coordinates.latitude.toFixed(4)}, {barangay.coordinates.longitude.toFixed(4)}
                                        </small>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                    {/* Render all pinned dumpsites */}
                    {Object.values(barangayDumpsites).map((dumpsite) => (
                        <Marker
                            key={dumpsite.barangayId}
                            position={[dumpsite.lat, dumpsite.lng]}
                            icon={dumpsite.type === 'junkshop' ? truckIcon : dumpsiteIcon} // Using truckIcon as placeholder for junkshop if no specific icon
                        >
                            <Popup>
                                <div>
                                    <strong>{dumpsite.barangayName}</strong>
                                    <br />
                                    {dumpsite.type === 'junkshop' ? '♻️ Partner Junk Shop' : '🗑️ Public Dumpsite'}
                                    <br />
                                    <small>
                                        {dumpsite.lat.toFixed(4)}, {dumpsite.lng.toFixed(4)}
                                    </small>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Truck position */}
                    {truckPosition && (
                        <Marker position={[truckPosition.lat, truckPosition.lng]} icon={truckIcon}>
                            <Popup>Collection Truck</Popup>
                        </Marker>
                    )}

                    {/* Pickup requests */}
                    {pickupRequests.map(req =>
                        req.status === 'pending' && (
                            <Marker key={req.id} position={[req.lat, req.lng]} icon={trashIcon}>
                                <Popup>Pickup Request from User</Popup>
                            </Marker>
                        )
                    )}
                </MapContainer>
            </div>

            {isPlacingMode && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    zIndex: 1000,
                    pointerEvents: 'none'
                }}>
                    📍 Click on the map to place dumpsite for {selectedBarangay?.name}
                </div>
            )}
        </div>
    );
};

export default MapSettingsPanel;
