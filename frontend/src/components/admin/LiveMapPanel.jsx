import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { truckIcon, trashIcon, dumpsiteIcon } from './adminConstants';
import { styles } from './adminStyles';

const LiveMapPanel = ({ truckPosition, pickupRequests, dumpsite, trafficReports, onManualDumpsite }) => (
    <div style={styles.mapContainer}>
        <MapContainer
            center={[9.3068, 123.3054]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            eventHandlers={onManualDumpsite ? { click: (e) => onManualDumpsite(e.latlng.lat, e.latlng.lng) } : undefined}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            {dumpsite && (
                <Marker
                    position={[dumpsite.lat, dumpsite.lng]}
                    icon={dumpsiteIcon}
                    draggable={!!onManualDumpsite}
                    eventHandlers={
                        onManualDumpsite
                            ? {
                                dragend: (e) => {
                                    const { lat, lng } = e.target.getLatLng();
                                    onManualDumpsite(lat, lng);
                                },
                            }
                            : undefined
                    }
                >
                    <Popup>Dumpsite / Recycling Center</Popup>
                </Marker>
            )}
            {truckPosition && (
                <Marker position={[truckPosition.lat, truckPosition.lng]} icon={truckIcon}>
                    <Popup>Collection Truck</Popup>
                </Marker>
            )}
            {pickupRequests.map(req =>
                req.status === 'pending' && (
                    <Marker key={req.id} position={[req.lat, req.lng]} icon={trashIcon}>
                        <Popup>Pickup Request from User</Popup>
                    </Marker>
                )
            )}
        </MapContainer>
    </div>
);

export default LiveMapPanel;
