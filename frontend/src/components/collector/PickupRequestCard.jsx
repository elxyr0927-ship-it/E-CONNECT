import React from 'react';
import { styles } from './collectorStyles';

const PickupRequestCard = ({ request, onAccept, onDecline, isActive, isPaid, earnings }) => {
    if (!request) return null;

    // Determine waste type info
    const wasteType = request.wasteType || 'recyclable'; // Default to recyclable for backwards compatibility
    const isResidual = wasteType === 'residual';
    const isBulk = wasteType === 'bulk';

    const wasteTypeInfo = {
        recyclable: { icon: '♻️', label: 'Recyclable', color: '#10b981', bgColor: '#ecfdf5' },
        biodegradable: { icon: '🌱', label: 'Biodegradable', color: '#10b981', bgColor: '#ecfdf5' },
        residual: { icon: '🗑️', label: 'Residual', color: '#f59e0b', bgColor: '#fef3c7' },
        bulk: { icon: '🚛', label: 'Bulk / Special', color: '#6366f1', bgColor: '#e0e7ff' },
    };

    const typeInfo = wasteTypeInfo[wasteType] || wasteTypeInfo.recyclable;

    return (
        <div style={isActive ? styles.stopCard : styles.jobCardMuted}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                    <h4 style={styles.stopTitle}>
                        {isActive ? 'Current Stop' : 'Pickup Request'}
                    </h4>
                    {isPaid && (
                        <div style={{
                            marginTop: '4px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#dcfce7',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            color: '#15803d',
                            border: '1px solid #86efac'
                        }}>
                            <span>💰</span>
                            <span>Earn ₱{earnings}</span>
                        </div>
                    )}
                </div>
                <div style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: typeInfo.bgColor,
                    border: `1px solid ${typeInfo.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: typeInfo.color,
                }}>
                    <span>{typeInfo.icon}</span>
                    <span>{typeInfo.label}</span>
                </div>
            </div>

            <p style={styles.stopMeta}>
                Location: {request.lat?.toFixed(4)}, {request.lng?.toFixed(4)}
            </p>
            <p style={styles.stopMeta}>Request ID: {request.id?.slice(0, 8)}</p>

            {isResidual && (
                <div style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fde047',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start'
                }}>
                    <span style={{ fontSize: '1rem' }}>⚠️</span>
                    <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#92400e',
                        lineHeight: '1.4'
                    }}>
                        <strong>Warning:</strong> This is residual waste. It should be collected by the city truck, not barangay collectors.
                        Mark as "Failed" if you encounter this.
                    </p>
                </div>
            )}

            {isActive ? (
                <div style={styles.stopActions}>
                    <button
                        style={styles.successButton}
                        onClick={() => onAccept(request.id)}
                        disabled={isResidual}
                        title={isResidual ? 'Cannot accept residual waste' : 'Mark as successful'}
                    >
                        ✓ Success
                    </button>
                    <button
                        style={styles.failButton}
                        onClick={() => onDecline(request.id)}
                        title={isResidual ? 'Mark as failed - wrong waste type' : 'Mark as failed'}
                    >
                        ✗ Failed
                    </button>
                </div>
            ) : (
                <div style={styles.stopActions}>
                    <button
                        style={styles.successButton}
                        onClick={() => onAccept(request.id)}
                        disabled={isResidual}
                        title={isResidual ? 'Cannot accept residual waste' : 'Accept this request'}
                    >
                        Accept
                    </button>
                    <button
                        style={styles.failButton}
                        onClick={() => onDecline(request.id)}
                        title="Decline this request"
                    >
                        Decline
                    </button>
                </div>
            )}
        </div>
    );
};

export default PickupRequestCard;
