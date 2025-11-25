import React from 'react';
import { styles } from './userStyles';

const UserStats = ({ userData, pickupRequested, statusMessage }) => {
    return (
        <div style={styles.heroStats} className="user-page__hero-stats">
            <div style={styles.heroStatCard}>
                <p style={styles.heroStatLabel}>Eco Points</p>
                <h3 style={styles.heroStatValue}>{userData.points.toLocaleString()}</h3>
                <p style={styles.heroStatFoot}>+{userData.weeklyPoints} this week</p>
            </div>
            <div style={styles.heroStatCard}>
                <p style={styles.heroStatLabel}>Completed Pickups</p>
                <h3 style={styles.heroStatValue}>{userData.completedPickups}</h3>
                <p style={styles.heroStatFoot}>{userData.scheduledPickups} scheduled</p>
            </div>
            <div style={styles.heroStatCard}>
                <p style={styles.heroStatLabel}>Current status</p>
                <h3 style={styles.heroStatValue}>{pickupRequested ? 'Live' : 'Idle'}</h3>
                <p style={styles.heroStatFoot}>
                    {pickupRequested ? statusMessage : 'Ready for your next pickup'}
                </p>
            </div>
        </div>
    );
};

export default UserStats;
