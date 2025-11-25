import React from 'react';
import { styles } from './userStyles';

const RewardsHighlight = ({ rewards, onTabChange }) => {
    return (
        <article style={styles.card}>
            <h4 style={styles.cardTitle}>Rewards highlight</h4>
            <p style={styles.cardBody}>
                Redeem {rewards[0]?.name || 'exclusive rewards'} once you hit{' '}
                {rewards[0]?.points?.toLocaleString() || 'the required'} points.
            </p>
            <button style={styles.smallButton} onClick={() => onTabChange('rewards')}>
                Browse rewards
            </button>
        </article>
    );
};

export default RewardsHighlight;
