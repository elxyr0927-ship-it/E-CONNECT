import React from 'react';
import { styles } from './userStyles';

const NotificationContainer = ({ notifications, notificationColors }) => {
    return (
        <div style={styles.notificationContainer}>
            {(notifications || []).map((notification) => (
                <div
                    key={notification.id}
                    style={{
                        ...styles.notification,
                        borderLeftColor: notificationColors[notification.tone] || notificationColors.success,
                    }}
                >
                    {notification.message}
                </div>
            ))}
        </div>
    );
};

export default NotificationContainer;
