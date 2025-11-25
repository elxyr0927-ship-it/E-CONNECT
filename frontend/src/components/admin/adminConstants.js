import L from 'leaflet';

// Fix for default Leaflet markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
export const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/713/713311.png',
    iconSize: [35, 35],
    iconAnchor: [17, 17],
    popupAnchor: [0, -10],
});

export const trashIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/484/484662.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -10],
});

export const dumpsiteIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/9131/9131546.png',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -10],
});

// Barangay Dumpsites Data
export const barangayDumpsites = [
    { id: 'poblacion', name: 'Barangay Poblacion', lat: 9.3068, lng: 123.3054 },
    { id: 'taclobo', name: 'Barangay Taclobo', lat: 9.304, lng: 123.295 },
    { id: 'bantayan', name: 'Barangay Bantayan', lat: 9.3305, lng: 123.309 },
    { id: 'candauay', name: 'Barangay Candau-ay', lat: 9.2835, lng: 123.2925 },
    { id: 'bagacay', name: 'Barangay Bagacay', lat: 9.298, lng: 123.315 },
];
