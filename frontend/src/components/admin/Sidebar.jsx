import React from 'react';
import { FiHome, FiMap, FiStar, FiUsers, FiSettings } from 'react-icons/fi';
import { styles } from './adminStyles';

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside style={styles.sidebar}>
            <div style={styles.logoArea}>
                <h2 style={styles.logoText}>EcoAdmin</h2>
            </div>
            <nav style={styles.nav}>
                <button
                    style={activeTab === 'overview' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('overview')}
                >
                    <FiHome /> Overview
                </button>
                <button
                    style={activeTab === 'map' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('map')}
                >
                    <FiMap /> Live Map
                </button>
                <button
                    style={activeTab === 'reviews' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('reviews')}
                >
                    <FiStar /> Reviews
                </button>
                <button
                    style={activeTab === 'users' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('users')}
                >
                    <FiUsers /> Users & Workers
                </button>
                <button
                    style={activeTab === 'assignments' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('assignments')}
                >
                    📍 Worker Assignments
                </button>
                <button
                    style={activeTab === 'rankings' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('rankings')}
                >
                    🏆 Rankings
                </button>
                <button
                    style={activeTab === 'junkshops' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('junkshops')}
                >
                    🏪 Junkshops
                </button>
                <button
                    style={activeTab === 'settings' ? styles.navItemActive : styles.navItem}
                    onClick={() => setActiveTab('settings')}
                >
                    <FiSettings /> Settings
                </button>
            </nav>
            <div style={styles.userProfile}>
                <div style={styles.avatar}>A</div>
                <div>
                    <p style={styles.userName}>Admin User</p>
                    <p style={styles.userRole}>Super Admin</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
