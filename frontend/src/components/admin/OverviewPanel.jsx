import React from 'react';
import { FiTruck, FiStar, FiAlertTriangle, FiActivity } from 'react-icons/fi';
import { styles } from './adminStyles';

const OverviewPanel = ({ stats, recentActivity }) => (
    <div style={styles.grid}>
        {/* Stats Cards */}
        <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#e0f2fe', color: '#0284c7' }}>
                <FiTruck size={24} />
            </div>
            <div>
                <p style={styles.statLabel}>Total Pickups</p>
                <h3 style={styles.statValue}>{stats.totalPickups}</h3>
                <p style={styles.statSub}>{stats.completedPickups} completed</p>
            </div>
        </div>
        <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#fef3c7', color: '#d97706' }}>
                <FiStar size={24} />
            </div>
            <div>
                <p style={styles.statLabel}>Avg Rating</p>
                <h3 style={styles.statValue}>{stats.avgRating}</h3>
                <p style={styles.statSub}>Based on recent reviews</p>
            </div>
        </div>
        <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#fee2e2', color: '#dc2626' }}>
                <FiAlertTriangle size={24} />
            </div>
            <div>
                <p style={styles.statLabel}>Traffic Reports</p>
                <h3 style={styles.statValue}>{stats.trafficIncidents}</h3>
                <p style={styles.statSub}>Incidents reported</p>
            </div>
        </div>
        <div style={styles.statCard}>
            <div style={{ ...styles.iconBox, background: '#dcfce7', color: '#16a34a' }}>
                <FiActivity size={24} />
            </div>
            <div>
                <p style={styles.statLabel}>System Status</p>
                <h3 style={styles.statValue}>Online</h3>
                <p style={styles.statSub}>All systems operational</p>
            </div>
        </div>

        {/* Recent Activity Feed */}
        <div style={styles.activitySection}>
            <h3 style={styles.sectionTitle}>Recent Activity</h3>
            <div style={styles.activityList}>
                {recentActivity.length === 0 && <p style={styles.emptyText}>No recent activity.</p>}
                {recentActivity.map((item) => (
                    <div key={item.id} style={styles.activityItem}>
                        <div style={styles.activityIcon}>
                            {item.rating ? <FiStar color="#fbbf24" /> : <FiAlertTriangle color="#ea580c" />}
                        </div>
                        <div>
                            <p style={styles.activityText}>
                                {item.rating
                                    ? <span><strong>{item.userName}</strong> rated <strong>{item.collectorName}</strong> {item.rating}/5</span>
                                    : <span><strong>{item.collectorName}</strong> reported heavy traffic</span>
                                }
                            </p>
                            <p style={styles.activityTime}>{new Date(item.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default OverviewPanel;
