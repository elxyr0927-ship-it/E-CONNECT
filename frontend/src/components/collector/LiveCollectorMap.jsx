import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import truckIconUrl from '../../assets/truck.png';
import { styles } from './collectorStyles';

const TruckIcon = new L.Icon({
    iconUrl: truckIconUrl,
    iconSize: [40, 40],
});

const UserIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2740%27%20height=%2740%27%3e%3ccircle%20cx=%2720%27%20cy=%2720%27%20r=%2715%27%20fill=%27%2310b981%27/%3e%3c/svg%3e',
    iconSize: [25, 25],
});

// Recenter button component
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

// Generic map click handler
const MapClickHandler = ({ onClick }) => {
    useMapEvents({
        click(e) {
            if (onClick) {
                onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
    });
    return null;
};

const DumpsiteIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2740%27%20height=%2740%27%3e%3crect%20x=%2710%27%20y=%2710%27%20width=%2720%27%20height=%2725%27%20fill=%27%23ef4444%27/%3e%3cpath%20d=%27M8%2010%20L32%2010%20L30%205%20L10%205%20Z%27%20fill=%27%23ef4444%27/%3e%3c/svg%3e',
    iconSize: [30, 30],
});

const LiveCollectorMap = ({
    truckPosition,
    pickupRequests,
    route,
    dumpsite,
    onMapClick,
    onRecenter,
    allowInteraction = true
}) => {
    const center = [truckPosition?.lat || 9.3068, truckPosition?.lng || 123.3054];

    return (
        <div style={styles.mapCard}>
            <div style={styles.cardHeader}>
                <div>
                    <p style={styles.cardEyebrow}>Live Map</p>
                    <h3 style={styles.cardTitle}>Route & Pickups</h3>
                </div>
            </div>

            <div style={styles.mapWrapper}>
                <MapContainer center={center} zoom={15} style={styles.map}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {allowInteraction && <MapClickHandler onClick={onMapClick} />}
                    <RecenterButton position={center} />

                    {/* Truck marker */}
                    {truckPosition && (
                        <Marker position={[truckPosition.lat, truckPosition.lng]} icon={TruckIcon} />
                    )}

                    {/* Dumpsite marker */}
                    {dumpsite && (
                        <Marker position={[dumpsite.lat, dumpsite.lng]} icon={DumpsiteIcon} />
                    )}

                    {/* Pickup request markers */}
                    {pickupRequests && pickupRequests.map((req) => (
                        <Marker
                            key={req.id}
                            position={[req.lat, req.lng]}
                            icon={UserIcon}
                        />
                    ))}

                    {/* Route polyline */}
                    {route && route.length > 0 && (
                        <Polyline
                            positions={route.map((point) => [point.lat, point.lng])}
                            color="#10b981"
                            weight={4}
                            opacity={0.7}
                        />
                    )}
                </MapContainer>
            </div>

            <p style={styles.mapHint}>
                {allowInteraction
                    ? "Click on the map to interact."
                    : "Follow the route to the pickups and dumpsite."}
            </p>
        </div>
    );
};

export default LiveCollectorMap;
