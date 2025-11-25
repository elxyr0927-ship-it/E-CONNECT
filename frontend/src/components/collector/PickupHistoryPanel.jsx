import React from 'react';
import { styles } from './collectorStyles';

const PickupHistoryPanel = ({ history }) => {
    if (!history || history.length === 0) {
        return (
            <div style={styles.historyCard}>
                <h4 style={styles.cardTitle}>Recent Pickups</h4>
                <p style={styles.mapHint}>No pickup history yet</p>
            </div>
        );
    }

    return (
        <div style={styles.historyCard}>
            <h4 style={styles.cardTitle}>Recent Pickups</h4>
            <ul style={styles.queueList}>
                {history.map((item, index) => (
                    <li key={index} style={styles.queueItem}>
                        <div>
                            <p style={styles.queueId}>Request #{item.id}</p>
                            <p style={styles.queueCoords}>
                                {item.lat?.toFixed(4)}, {item.lng?.toFixed(4)}
                            </p>
                        </div>
                        <span style={styles.queueStatus}>{item.status}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PickupHistoryPanel;
