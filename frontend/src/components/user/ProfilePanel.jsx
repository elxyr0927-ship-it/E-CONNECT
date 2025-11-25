import React from 'react';
import { styles } from './userStyles';

const ProfilePanel = ({
    userData,
    isEditing,
    editData,
    onEdit,
    onSave,
    onEditDataChange,
    isVisible
}) => {
    if (!isVisible) return null;

    return (
        <section style={styles.profilePanel}>
            <div style={styles.tabHeader}>
                <div>
                    <h3 style={styles.sectionTitle}>Account overview</h3>
                    <p style={styles.cardHint}>Stay on top of your sustainability stats.</p>
                </div>
                {!isEditing ? (
                    <button style={styles.secondaryButton} onClick={onEdit}>
                        Edit Profile
                    </button>
                ) : (
                    <button style={styles.ctaButton} onClick={onSave}>
                        Save Changes
                    </button>
                )}
            </div>
            <div style={styles.profileRows}>
                <div style={styles.profileRow}>
                    <span>Full name</span>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => onEditDataChange({ ...editData, name: e.target.value })}
                            style={styles.input}
                        />
                    ) : (
                        <strong>{userData.name}</strong>
                    )}
                </div>
                <div style={styles.profileRow}>
                    <span>Membership</span>
                    <strong>{userData.membership}</strong>
                </div>
                <div style={styles.profileRow}>
                    <span>District</span>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editData.district || ''}
                            onChange={(e) => onEditDataChange({ ...editData, district: e.target.value })}
                            style={styles.input}
                        />
                    ) : (
                        <strong>{userData.district}</strong>
                    )}
                </div>
            </div>
            <div style={styles.profileStats}>
                <div style={styles.profileStatCard}>
                    <p style={styles.cardHint}>Total pickups</p>
                    <h4>{userData.completedPickups}</h4>
                </div>
                <div style={styles.profileStatCard}>
                    <p style={styles.cardHint}>Scheduled</p>
                    <h4>{userData.scheduledPickups}</h4>
                </div>
                <div style={styles.profileStatCard}>
                    <p style={styles.cardHint}>Eco points</p>
                    <h4>{userData.points.toLocaleString()}</h4>
                </div>
            </div>
        </section>
    );
};

export default ProfilePanel;
