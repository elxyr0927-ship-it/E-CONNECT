import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Styles for the modal
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    content: {
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '24px',
        position: 'relative',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    title: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    closeButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#6b7280',
    },
    mapContainer: {
        height: '200px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '16px',
        border: '1px solid #e5e7eb',
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '20px',
    },
    detailItem: {
        backgroundColor: '#f9fafb',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #f3f4f6',
    },
    label: {
        fontSize: '0.75rem',
        color: '#6b7280',
        marginBottom: '4px',
        display: 'block',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    value: {
        fontSize: '1rem',
        fontWeight: '600',
        color: '#1f2937',
        margin: 0,
    },
    actions: {
        display: 'flex',
        gap: '12px',
        marginTop: '20px',
    },
    button: {
        flex: 1,
        padding: '12px',
        borderRadius: '8px',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'background-color 0.2s',
    },
    primaryButton: {
        backgroundColor: '#10b981',
        color: 'white',
    },
    secondaryButton: {
        backgroundColor: '#ef4444',
        color: 'white',
    },
    outlineButton: {
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        color: '#374151',
    },
    reasonSelect: {
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #d1d5db',
        marginTop: '8px',
        fontSize: '0.9rem',
    }
};

const UserIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2740%27%20height=%2740%27%3e%3ccircle%20cx=%2720%27%20cy=%2720%27%20r=%2715%27%20fill=%27%2310b981%27/%3e%3c/svg%3e',
    iconSize: [25, 25],
});

const RequestDetailsModal = ({
    isOpen,
    onClose,
    request,
    onAccept,
    onDecline,
    onReportIssue,
    workerType = 'freelancer'
}) => {
    const [showIssueSelect, setShowIssueSelect] = useState(false);
    const [issueReason, setIssueReason] = useState('blocked');

    if (!isOpen || !request) return null;

    const wasteTypeColors = {
        recyclable: { bg: '#ecfdf5', text: '#065f46' },
        biodegradable: { bg: '#ecfdf5', text: '#065f46' },
        residual: { bg: '#fffbeb', text: '#92400e' },
        bulk: { bg: '#e0e7ff', text: '#3730a3' },
    };

    const typeStyle = wasteTypeColors[request.wasteType] || wasteTypeColors.recyclable;

    const handleIssueSubmit = () => {
        if (onReportIssue) {
            onReportIssue(request.id, issueReason);
            setShowIssueSelect(false);
            onClose();
        }
    };

    return (
        <div style={modalStyles.overlay} onClick={onClose}>
            <div style={modalStyles.content} onClick={e => e.stopPropagation()}>
                <div style={modalStyles.header}>
                    <h3 style={modalStyles.title}>Pickup Request Details</h3>
                    <button style={modalStyles.closeButton} onClick={onClose}>&times;</button>
                </div>

                <div style={modalStyles.mapContainer}>
                    <MapContainer
                        center={[request.lat, request.lng]}
                        zoom={16}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                        dragging={false}
                        scrollWheelZoom={false}
                        doubleClickZoom={false}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[request.lat, request.lng]} icon={UserIcon} />
                    </MapContainer>
                </div>

                <div style={modalStyles.detailsGrid}>
                    <div style={modalStyles.detailItem}>
                        <span style={modalStyles.label}>Request ID</span>
                        <p style={modalStyles.value}>#{request.id.slice(0, 8)}</p>
                    </div>
                    <div style={{ ...modalStyles.detailItem, backgroundColor: typeStyle.bg }}>
                        <span style={{ ...modalStyles.label, color: typeStyle.text }}>Waste Type</span>
                        <p style={{ ...modalStyles.value, color: typeStyle.text }}>
                            {request.wasteType.charAt(0).toUpperCase() + request.wasteType.slice(1)}
                        </p>
                    </div>
                    {workerType === 'freelancer' && (
                        <div style={modalStyles.detailItem}>
                            <span style={modalStyles.label}>Estimated Earnings</span>
                            <p style={{ ...modalStyles.value, color: '#15803d' }}>
                                {request.wasteType === 'bulk' ? '₱160.00' : '₱50.00'}
                            </p>
                        </div>
                    )}
                    <div style={modalStyles.detailItem}>
                        <span style={modalStyles.label}>Distance</span>
                        <p style={modalStyles.value}>~0.5 km</p>
                    </div>
                </div>

                {showIssueSelect ? (
                    <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', color: '#991b1b' }}>Select Issue Reason</h4>
                        <select
                            style={modalStyles.reasonSelect}
                            value={issueReason}
                            onChange={(e) => setIssueReason(e.target.value)}
                        >
                            <option value="blocked">Road Blocked / Inaccessible</option>
                            <option value="wrong_type">Wrong Waste Type</option>
                            <option value="no_trash">No Trash Found</option>
                            <option value="unsafe">Unsafe Location</option>
                        </select>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button
                                style={{ ...modalStyles.button, ...modalStyles.secondaryButton, padding: '8px' }}
                                onClick={handleIssueSubmit}
                            >
                                Submit Report
                            </button>
                            <button
                                style={{ ...modalStyles.button, ...modalStyles.outlineButton, padding: '8px' }}
                                onClick={() => setShowIssueSelect(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={modalStyles.actions}>
                        {workerType === 'freelancer' ? (
                            <>
                                <button
                                    style={{ ...modalStyles.button, ...modalStyles.primaryButton }}
                                    onClick={() => { onAccept(request.id); onClose(); }}
                                >
                                    Accept Job
                                </button>
                                <button
                                    style={{ ...modalStyles.button, ...modalStyles.outlineButton }}
                                    onClick={() => { onDecline(request.id); onClose(); }}
                                >
                                    Decline
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    style={{ ...modalStyles.button, ...modalStyles.primaryButton }}
                                    onClick={() => { onAccept(request.id); onClose(); }}
                                >
                                    Mark Collected
                                </button>
                                <button
                                    style={{ ...modalStyles.button, ...modalStyles.secondaryButton }}
                                    onClick={() => setShowIssueSelect(true)}
                                >
                                    Report Issue
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestDetailsModal;
