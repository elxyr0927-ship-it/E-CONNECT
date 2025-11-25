import React from 'react';
import { styles } from './collectorStyles';
import StatusSelector from './StatusSelector';

const CollectorHeader = ({ collectorName, status, onStatusChange }) => {
    return (
        <header style={styles.hero}>
            <div>
                <p style={styles.heroBadge}>Collector Dashboard</p>
                <h1 style={styles.heroTitle}>Welcome, {collectorName}</h1>
                <p style={styles.heroSubtitle}>
                    Manage your pickup routes and track your progress in real-time.
                </p>
                <StatusSelector currentStatus={status} onStatusChange={onStatusChange} />
            </div>
        </header>
    );
};

export default CollectorHeader;
