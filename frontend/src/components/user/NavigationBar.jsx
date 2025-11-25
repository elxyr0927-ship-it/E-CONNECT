import React from 'react';
import { styles } from './userStyles';

const NavigationBar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'home', label: 'Home', icon: '🏠' },
        { id: 'history', label: 'History', icon: '📜' },
        { id: 'rankings', label: 'Rankings', icon: '🏆' },
        { id: 'gcash', label: 'GCash', icon: '💰' },
        { id: 'rewards', label: 'Rewards', icon: '🎁' },
        { id: 'profile', label: 'Profile', icon: '👤' }
    ];

    return (
        <nav style={styles.navigationBar}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    style={activeTab === tab.id ? styles.navButtonActive : styles.navButton}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
                    <span style={{ fontSize: '0.75rem' }}>{tab.label}</span>
                </button>
            ))}
        </nav>
    );
};

export default NavigationBar;
