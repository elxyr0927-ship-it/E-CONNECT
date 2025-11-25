import React from 'react';
import { styles } from './userStyles';
import UserStats from './UserStats';
import WasteTypeSelector from './WasteTypeSelector';

const UserHero = ({
    userData,
    pickupRequested,
    pickupPosition,
    userPosition,
    statusMessage,
    wasteType,
    onWasteTypeChange,
    onRequestPickup,
    onTabChange,
    loadSize,
    onLoadSizeChange
}) => {
    const greetingName = userData?.name?.split(' ')[0] || 'Eco hero';

    return (
        <header style={styles.hero} className="user-page__hero">
            <div>
                <p style={styles.heroBadge}>{userData.membership || 'Eco Citizen'}</p>
                <h1 style={styles.heroTitle}>Hi {greetingName}, keep the city clean.</h1>
                <p style={styles.heroSubtitle}>
                    Earn rewards every time you recycle. Drop your pin, request a pickup, and follow the truck in real time.
                    Serving <strong>{userData.district || 'Dumaguete City'}</strong>.
                </p>
                <div style={styles.heroMeta}>
                    <div style={styles.heroMetaChip}>
                        <span style={styles.heroMetaChipLabel}>District</span>
                        <strong>{userData.district || 'Dumaguete City'}</strong>
                    </div>
                    <div style={styles.heroMetaChip}>
                        <span style={styles.heroMetaChipLabel}>Membership</span>
                        <strong>{userData.membership || 'Eco Citizen'}</strong>
                    </div>
                </div>
                <WasteTypeSelector
                    selectedType={wasteType}
                    onTypeChange={onWasteTypeChange}
                    loadSize={loadSize}
                    onLoadSizeChange={onLoadSizeChange}
                />
                <div style={styles.heroActions}>
                    <button
                        style={{ ...styles.ctaButton, opacity: pickupRequested ? 0.6 : 1 }}
                        onClick={onRequestPickup}
                        disabled={pickupRequested || (!pickupPosition && !userPosition)}
                    >
                        {pickupRequested
                            ? 'Pickup in progress'
                            : wasteType === 'residual'
                                ? 'View City Truck Schedule'
                                : 'Request Pickup'}
                    </button>
                    <button style={styles.secondaryGhost} onClick={() => onTabChange('activity')}>
                        View activity
                    </button>
                </div>
            </div>
            <UserStats
                userData={userData}
                pickupRequested={pickupRequested}
                statusMessage={statusMessage}
            />
        </header>
    );
};

export default UserHero;
