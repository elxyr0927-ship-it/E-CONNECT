import React, { useState, useEffect } from 'react';
import { styles } from './userStyles';

const BarangayRankingsPanel = ({ userData, isVisible }) => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isVisible) {
            fetchRankings();
        }
    }, [isVisible]);

    const fetchRankings = async () => {
        try {
            const response = await fetch('/api/barangay-details');
            if (!response.ok) throw new Error('Failed to fetch rankings');
            const data = await response.json();
            setRankings(data);
        } catch (error) {
            console.error('Error fetching rankings:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isVisible) return null;

    if (loading) {
        return (
            <section style={styles.activityPanel}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                    <div style={styles.loadingSpinner}></div>
                </div>
            </section>
        );
    }

    // Find user's barangay in rankings
    const userBarangayName = userData.barangay || userData.district || '';
    const userRanking = rankings.find(r => r.name.toLowerCase() === userBarangayName.toLowerCase()) || {
        name: userBarangayName || 'Unknown',
        totalPickups: 0,
        totalPoints: 0,
        constituentCount: 0,
        rank: '-'
    };

    // Calculate user's contribution
    const userContribution = userRanking.totalPickups > 0
        ? Math.round((userData.completedPickups / userRanking.totalPickups) * 100)
        : 0;

    const getRankBadge = (rank) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '🏅';
    };

    return (
        <section style={styles.activityPanel}>
            {/* Header */}
            <div style={styles.tabHeader}>
                <div>
                    <h3 style={styles.sectionTitle}>🏆 Barangay Rankings</h3>
                    <p style={styles.cardHint}>See how your barangay ranks in Dumaguete City</p>
                </div>
            </div>

            {/* Your Barangay Card */}
            <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
                marginBottom: '24px',
                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                        <p style={{ margin: '0 0 4px', fontSize: '0.875rem', opacity: 0.9 }}>Your Barangay</p>
                        <h2 style={{ margin: '0 0 8px', fontSize: '1.75rem' }}>{userRanking.name}</h2>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                            <span>📊 {userRanking.totalPickups} pickups</span>
                            <span>👥 {userRanking.constituentCount} users</span>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', lineHeight: 1 }}>{getRankBadge(userRanking.rank)}</div>
                        <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: '700' }}>
                            Rank #{userRanking.rank}
                        </p>
                    </div>
                </div>

                <div style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '12px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.875rem' }}>Your Contribution</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '700' }}>{userContribution}%</span>
                    </div>
                    <div style={{
                        height: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.min(userContribution, 100)}%`,
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                    <p style={{ margin: '8px 0 0', fontSize: '0.75rem', opacity: 0.9 }}>
                        You've completed {userData.completedPickups} out of {userRanking.totalPickups} total pickups
                    </p>
                </div>
            </div>

            {/* Leaderboard */}
            <div>
                <h4 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: '#111827' }}>
                    🌟 Top 10 Barangays
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {rankings.slice(0, 10).map((barangay) => {
                        const isUserBarangay = barangay.name.toLowerCase() === userBarangayName.toLowerCase();
                        const badge = getRankBadge(barangay.rank);

                        return (
                            <div
                                key={barangay.id || barangay.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 16px',
                                    backgroundColor: isUserBarangay ? '#f0f9ff' : 'white',
                                    border: `2px solid ${isUserBarangay ? '#3b82f6' : '#e5e7eb'}`,
                                    borderRadius: '12px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{
                                    fontSize: '1.5rem',
                                    minWidth: '40px',
                                    textAlign: 'center'
                                }}>
                                    {badge}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{
                                                margin: 0,
                                                fontWeight: '700',
                                                fontSize: '0.95rem',
                                                color: isUserBarangay ? '#1e40af' : '#111827'
                                            }}>
                                                {barangay.name}
                                                {isUserBarangay && <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#3b82f6' }}>(You)</span>}
                                            </p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                                {barangay.totalPickups} pickups · {barangay.constituentCount} active users
                                            </p>
                                        </div>
                                        <div style={{
                                            fontWeight: '700',
                                            fontSize: '1rem',
                                            color: '#15803d'
                                        }}>
                                            {barangay.totalPoints.toLocaleString()} pts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievement Badges */}
            <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#fef3c7', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#92400e' }}>
                    🎖️ Barangay Achievements
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {userRanking.rank <= 3 && (
                        <span style={{
                            padding: '6px 12px',
                            backgroundColor: '#fbbf24',
                            color: '#78350f',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            ⭐ Top 3 Performer
                        </span>
                    )}
                    {userRanking.totalPickups >= 400 && (
                        <span style={{
                            padding: '6px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            🌟 400+ Pickups
                        </span>
                    )}
                    {userRanking.constituentCount >= 70 && (
                        <span style={{
                            padding: '6px 12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            👥 Highly Active Community
                        </span>
                    )}
                </div>
            </div>
        </section>
    );
};

export default BarangayRankingsPanel;
