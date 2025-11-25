import React from 'react';
import { styles } from './userStyles';

const RewardsPanel = ({ rewards, redeemedRewards, userData, onRedeem, isVisible }) => {
    if (!isVisible) return null;

    return (
        <section style={styles.rewardsPanel}>
            <div style={styles.tabHeader}>
                <div>
                    <h3 style={styles.sectionTitle}>Available rewards</h3>
                    <p style={styles.cardHint}>Redeem eco points for sustainable perks and essentials.</p>
                </div>
                <span style={styles.activityTotal}>Balance: {userData.points.toLocaleString()} pts</span>
            </div>
            <div style={styles.rewardsGrid}>
                {rewards.filter((reward) => !redeemedRewards.some((rr) => rr.id === reward.id)).map((reward) => {
                    const canRedeem = userData.points >= reward.points;
                    return (
                        <div key={reward.id} style={styles.rewardCard}>
                            <h4 style={styles.rewardName}>{reward.name}</h4>
                            <p style={styles.cardBody}>{reward.description}</p>
                            <div style={styles.rewardPoints}>{reward.points.toLocaleString()} pts</div>
                            <button
                                style={{
                                    ...styles.redeemButton,
                                    ...(canRedeem ? {} : styles.redeemButtonDisabled),
                                }}
                                disabled={!canRedeem}
                                onClick={() => onRedeem(reward.id)}
                            >
                                {canRedeem ? 'Redeem now' : 'Need more points'}
                            </button>
                        </div>
                    );
                })}
            </div>
            {redeemedRewards.length > 0 && (
                <>
                    <h3 style={styles.sectionTitle}>Redeemed rewards</h3>
                    <div style={styles.rewardsGrid}>
                        {redeemedRewards.map((reward) => (
                            <div key={`redeemed-${reward.id}`} style={styles.rewardCard}>
                                <h4 style={styles.rewardName}>{reward.name}</h4>
                                <p style={styles.cardBody}>{reward.description}</p>
                                <div style={{ ...styles.rewardPoints, color: '#16a34a' }}>Redeemed</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default RewardsPanel;
