import React from 'react';
import { styles } from './userStyles';

const PickupStatusCard = ({ pickupRequested, pickupStatus, statusMessage, onCancelPickup }) => {
    return (
        <article style={styles.card}>
            <h4 style={styles.cardTitle}>Pickup status</h4>
            <p style={{ ...styles.statusText, color: pickupStatus === 'failed' ? '#d14343' : '#0b6bcb' }}>
                {statusMessage}
            </p>
            {!pickupRequested && (
                <p style={styles.cardHint}>
                    Need help locating yourself? Use the map below or tap "Use Current Location".
                </p>
            )}
            {pickupRequested && (!pickupStatus || pickupStatus === 'pending') && (
                <button
                    style={{ ...styles.secondaryButton, marginTop: 12 }}
                    onClick={onCancelPickup}
                >
                    Cancel pickup
                </button>
            )}
        </article>
    );
};

export default PickupStatusCard;
