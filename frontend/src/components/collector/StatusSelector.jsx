import React from 'react';
import { styles } from './collectorStyles';

const StatusSelector = ({ currentStatus, onStatusChange }) => {
    const statuses = [
        { value: 'available', label: 'Available' },
        { value: 'busy', label: 'Busy' },
        { value: 'offline', label: 'Offline' },
    ];

    return (
        <div style={styles.heroActions}>
            {statuses.map((status) => (
                <button
                    key={status.value}
                    style={currentStatus === status.value ? styles.heroButtonActive : styles.heroButton}
                    onClick={() => onStatusChange(status.value)}
                >
                    {status.label}
                </button>
            ))}
        </div>
    );
};

export default StatusSelector;
