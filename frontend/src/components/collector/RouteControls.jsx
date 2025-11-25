import React from 'react';
import { styles } from './collectorStyles';

const RouteControls = ({ route, isPlaying, onCalculateRoute, onStartPlayback, onStopPlayback }) => {
    return (
        <div style={styles.cardActions}>
            <button style={styles.ghostButton} onClick={onCalculateRoute}>
                📍 Calculate Route
            </button>
            {route && route.length > 0 && !isPlaying && (
                <button style={styles.primaryButton} onClick={() => onStartPlayback(route)}>
                    ▶ Start Route
                </button>
            )}
            {isPlaying && (
                <button style={styles.failButton} onClick={onStopPlayback}>
                    ⏹ Stop Route
                </button>
            )}
        </div>
    );
};

export default RouteControls;
