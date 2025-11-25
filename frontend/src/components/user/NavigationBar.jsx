import React from 'react';
import { FiActivity, FiGift, FiHome, FiUser } from 'react-icons/fi';
import { styles } from './userStyles';

const NavigationBar = ({ activeTab, onTabChange }) => {
    return (
        <footer style={styles.navBar} className="user-page__nav">
            <button
                style={activeTab === 'home' ? styles.navButtonActive : styles.navButton}
                onClick={() => onTabChange('home')}
            >
                <FiHome style={styles.navIcon} />
                Home
            </button>
            <button
                style={activeTab === 'activity' ? styles.navButtonActive : styles.navButton}
                onClick={() => onTabChange('activity')}
            >
                <FiActivity style={styles.navIcon} />
                Activity
            </button>
            <button
                style={activeTab === 'rewards' ? styles.navButtonActive : styles.navButton}
                onClick={() => onTabChange('rewards')}
            >
                <FiGift style={styles.navIcon} />
                Rewards
            </button>
            <button
                style={activeTab === 'profile' ? styles.navButtonActive : styles.navButton}
                onClick={() => onTabChange('profile')}
            >
                <FiUser style={styles.navIcon} />
                Profile
            </button>
        </footer>
    );
};

export default NavigationBar;
