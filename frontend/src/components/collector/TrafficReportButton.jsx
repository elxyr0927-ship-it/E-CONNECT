import React from 'react';
import { styles } from './collectorStyles';

const TrafficReportButton = ({ onReportTraffic }) => {
    return (
        <button style={styles.ghostButton} onClick={onReportTraffic}>
            🚦 Report Traffic
        </button>
    );
};

export default TrafficReportButton;
