import React from 'react';
import { styles } from './collectorStyles';

const ProfileCard = ({ collectorName, profileIcon, completedJobs, onIconClick, earnings }) => {
    return (
        <div style={styles.profileCard}>
            <img
                src={profileIcon}
                alt="Profile"
                style={styles.profileAvatar}
                onClick={onIconClick}
            />
            <div style={{ flex: 1 }}>
                <h3 style={styles.profileName}>{collectorName}</h3>
                <p style={styles.profileStatus}>{completedJobs} jobs completed</p>
                {earnings !== undefined && (
                    <div style={{
                        marginTop: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#dcfce7',
                        borderRadius: '8px',
                        border: '1px solid #86efac',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <span style={{ fontSize: '1.2rem' }}>💰</span>
                        <div>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#15803d', fontWeight: '600' }}>Earnings Wallet</p>
                            <p style={{ margin: 0, fontSize: '1.1rem', color: '#15803d', fontWeight: '700' }}>₱{earnings}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
