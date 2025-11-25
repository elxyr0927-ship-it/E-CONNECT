import React from 'react';
import { styles } from './userStyles';

const ActivityPanel = ({ activityHistory, isVisible }) => {
    if (!isVisible) return null;

    return (
        <section style={styles.activityPanel}>
            <div style={styles.tabHeader}>
                <div>
                    <h3 style={styles.sectionTitle}>Recent activity</h3>
                    <p style={styles.cardHint}>Track the pickups and rewards you've completed this week.</p>
                </div>
                <span style={styles.activityTotal}>Total entries: {activityHistory.length}</span>
            </div>
            <div style={styles.activityList}>
                {activityHistory.length === 0 && <p style={styles.cardHint}>No activity yet. Schedule your first pickup!</p>}
                {activityHistory.map((activity) => (
                    <div key={activity.id} style={styles.activityItem} className="user-page__activity-item">
                        <div style={styles.activityIcon}>{activity.icon}</div>
                        <div style={styles.activityDetails}>
                            <p style={styles.activityTitle}>{activity.title}</p>
                            <p style={styles.activityMeta}>
                                {activity.date} · {activity.location}
                            </p>
                            <p
                                style={{
                                    ...styles.activityPoints,
                                    color: activity.points >= 0 ? '#15803d' : '#dc2626',
                                }}
                            >
                                {activity.points >= 0 ? '+' : ''}{activity.points} points
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ActivityPanel;
