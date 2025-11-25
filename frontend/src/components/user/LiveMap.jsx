import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import truckIconUrl from '../../assets/truck.png';
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import { styles } from './userStyles';

const center = [9.3068, 123.3054]; // Dumaguete City

const TruckIcon = new L.Icon({
    iconUrl: truckIconUrl,
    iconSize: [40, 40],
});

const UserIcon = new L.Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

const LocationMarker = ({ position, icon }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [map, position]);

    return position === null ? null : <Marker position={position} icon={icon} />;
};

const ManualLocationSelector = ({ onSelect, disabled }) => {
    useMapEvents({
        click(e) {
            if (disabled) {
                return;
            }
            if (onSelect) {
                onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
            }
        },
    });
    return null;
};

const LiveMap = ({
    pickupCoordinates,
    truckPosition,
    pickupRequested,
    userPosition,
    locationError,
    onSetPickupPosition,
    onUseCurrentLocation,
    onRequestPickup,
    route,
}) => {
    return (
        <section style={styles.mapSection}>
            <div style={styles.mapHeader}>
                <div>
                    <p style={styles.mapEyebrow}>Live map</p>
                    <h3 style={styles.mapTitle}>Set your pickup spot</h3>
                </div>
                <button
                    style={styles.secondaryButton}
                    onClick={onUseCurrentLocation}
                    disabled={pickupRequested}
                >
                    Use current location
                </button>
            </div>
            <div style={styles.mapCard} className="user-page__map-card">
                <MapContainer
                    center={pickupCoordinates || truckPosition || center}
                    zoom={15}
                    style={styles.map}
                    className="user-page__map"
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <ManualLocationSelector onSelect={onSetPickupPosition} disabled={pickupRequested} />
                    <LocationMarker position={pickupCoordinates} icon={UserIcon} />
                    {pickupRequested && truckPosition && <Marker position={truckPosition} icon={TruckIcon} />}
                    {route && route.length > 0 && <Polyline positions={route} color="blue" weight={4} opacity={0.7} />}
                </MapContainer>
                <div style={styles.mapInfo}>
                    <div>
                        <p style={styles.mapInfoLabel}>Selected location</p>
                        <p style={styles.mapInfoValue}>
                            {pickupCoordinates
                                ? `${pickupCoordinates.lat.toFixed(4)}, ${pickupCoordinates.lng.toFixed(4)}`
                                : 'Tap on the map to drop a pin'}
                        </p>
                    </div>
                    {!pickupRequested && (
                        <button
                            style={styles.requestButton}
                            onClick={onRequestPickup}
                            disabled={!pickupCoordinates}
                        >
                            Confirm & request
                        </button>
                    )}
                </div>
            </div>
            {locationError && <p style={styles.locationError}>{locationError}</p>}
            {!locationError && !pickupRequested && (
                <p style={styles.mapHint}>Drag or tap on the map to reposition your marker before requesting.</p>
            )}
        </section>
    );
};

export default LiveMap;
