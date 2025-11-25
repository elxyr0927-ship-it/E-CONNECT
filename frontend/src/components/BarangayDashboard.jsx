import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiUsers, FiAward, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const BarangayDashboard = () => {
    const [barangayData, setBarangayData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedBarangay, setExpandedBarangay] = useState(null);

    useEffect(() => {
        fetchBarangayDetails();
    }, []);

    const fetchBarangayDetails = async () => {
        try {
            const response = await fetch('/api/barangay-details');
            const data = await response.json();
            setBarangayData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching barangay details:', error);
            setLoading(false);
        }
    };

    const toggleExpand = (barangayId) => {
        setExpandedBarangay(expandedBarangay === barangayId ? null : barangayId);
    };

    const getRankBadge = (rank) => {
        if (rank === 1) return { emoji: '🥇', color: '#fbbf24', label: 'Champion' };
        if (rank === 2) return { emoji: '🥈', color: '#94a3b8', label: '2nd Place' };
        if (rank === 3) return { emoji: '🥉', color: '#cd7f32', label: '3rd Place' };
        return { emoji: '🏅', color: '#10b981', label: `#${rank}` };
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading barangay data...</p>
            </div>
        );
    }

    return (
        <section style={styles.section}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>🏆 Barangay Performance Dashboard</h2>
                    <p style={styles.subtitle}>
                        Real-time leaderboard showing constituent participation and environmental impact
                    </p>
                </div>

                <div style={styles.grid}>
                    {barangayData.slice(0, 10).map((barangay) => {
                        const badge = getRankBadge(barangay.rank);
                        const isExpanded = expandedBarangay === barangay.id;

                        return (
                            <div
                                key={barangay.id}
                                style={{
                                    ...styles.card,
                                    ...(barangay.rank <= 3 ? styles.topCard : {})
                                }}
                            >
                                {/* Header */}
                                <div style={styles.cardHeader}>
                                    <div style={styles.rankBadge}>
                                        <span style={{ fontSize: '1.5rem' }}>{badge.emoji}</span>
                                        <span style={{ ...styles.rankText, color: badge.color }}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <h3 style={styles.barangayName}>{barangay.name}</h3>
                                </div>

                                {/* Stats Grid */}
                                <div style={styles.statsGrid}>
                                    <div style={styles.statBox}>
                                        <div style={styles.statIcon}>🎯</div>
                                        <div>
                                            <p style={styles.statValue}>{barangay.totalPoints.toLocaleString()}</p>
                                            <p style={styles.statLabel}>Total Points</p>
                                        </div>
                                    </div>
                                    <div style={styles.statBox}>
                                        <div style={styles.statIcon}>♻️</div>
                                        <div>
                                            <p style={styles.statValue}>{barangay.totalPickups}</p>
                                            <p style={styles.statLabel}>Pickups</p>
                                        </div>
                                    </div>
                                    <div style={styles.statBox}>
                                        <div style={styles.statIcon}>👥</div>
                                        <div>
                                            <p style={styles.statValue}>{barangay.constituentCount}</p>
                                            <p style={styles.statLabel}>Active Users</p>
                                        </div>
                                    </div>
                                    <div style={styles.statBox}>
                                        <div style={styles.statIcon}>📊</div>
                                        <div>
                                            <p style={styles.statValue}>{barangay.avgPointsPerUser}</p>
                                            <p style={styles.statLabel}>Avg/User</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Expand Button */}
                                <button
                                    style={styles.expandButton}
                                    onClick={() => toggleExpand(barangay.id)}
                                >
                                    {isExpanded ? (
                                        <>
                                            Hide Constituents <FiChevronUp />
                                        </>
                                    ) : (
                                        <>
                                            View Constituents <FiChevronDown />
                                        </>
                                    )}
                                </button>

                                {/* Constituent List */}
                                {isExpanded && (
                                    <div style={styles.constituentList}>
                                        <h4 style={styles.constituentTitle}>
                                            Top Contributors (Anonymized IDs)
                                        </h4>
                                        <div style={styles.constituentGrid}>
                                            {barangay.constituents.slice(0, 5).map((constituent, idx) => (
                                                <div key={constituent.id} style={styles.constituentCard}>
                                                    <div style={styles.constituentRank}>#{idx + 1}</div>
                                                    <div style={styles.constituentInfo}>
                                                        <p style={styles.constituentId}>
                                                            ID: {constituent.id.slice(0, 8)}...
                                                        </p>
                                                        <div style={styles.constituentStats}>
                                                            <span>🎯 {constituent.points} pts</span>
                                                            <span>♻️ {constituent.pickups} pickups</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {barangay.constituents.length > 5 && (
                                            <p style={styles.moreText}>
                                                +{barangay.constituents.length - 5} more constituents
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {barangayData.length === 0 && (
                    <div style={styles.emptyState}>
                        <p style={styles.emptyText}>No barangay data available yet.</p>
                        <p style={styles.emptySubtext}>Start participating to see your barangay on the leaderboard!</p>
                    </div>
                )}
            </div>
        </section>
    );
};

const styles = {
    section: {
        backgroundColor: '#f9fafb',
        padding: '80px 20px',
        minHeight: '100vh'
    },
    container: {
        maxWidth: '1400px',
        margin: '0 auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '60px'
    },
    title: {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '16px'
    },
    subtitle: {
        fontSize: '1.125rem',
        color: '#6b7280',
        maxWidth: '700px',
        margin: '0 auto'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb',
        transition: 'transform 0.2s, box-shadow 0.2s',
        ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }
    },
    topCard: {
        border: '2px solid #fbbf24',
        background: 'linear-gradient(135deg, #fffbeb 0%, #fff 100%)'
    },
    cardHeader: {
        marginBottom: '24px'
    },
    rankBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
    },
    rankText: {
        fontSize: '0.875rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    barangayName: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '20px'
    },
    statBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px'
    },
    statIcon: {
        fontSize: '1.5rem'
    },
    statValue: {
        fontSize: '1.25rem',
        fontWeight: '700',
        color: '#111827',
        margin: '0 0 2px'
    },
    statLabel: {
        fontSize: '0.75rem',
        color: '#6b7280',
        margin: 0,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    },
    expandButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '0.875rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'background-color 0.2s'
    },
    constituentList: {
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid #e5e7eb'
    },
    constituentTitle: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '16px'
    },
    constituentGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    constituentCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        backgroundColor: '#f9fafb',
        borderRadius: '10px',
        border: '1px solid #e5e7eb'
    },
    constituentRank: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#10b981',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        fontWeight: '700',
        flexShrink: 0
    },
    constituentInfo: {
        flex: 1
    },
    constituentId: {
        fontSize: '0.875rem',
        fontWeight: '600',
        color: '#111827',
        margin: '0 0 4px',
        fontFamily: 'monospace'
    },
    constituentStats: {
        display: 'flex',
        gap: '12px',
        fontSize: '0.75rem',
        color: '#6b7280'
    },
    moreText: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280',
        marginTop: '12px',
        fontStyle: 'italic'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '16px'
    },
    spinner: {
        width: '48px',
        height: '48px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #10b981',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        fontSize: '1rem',
        color: '#6b7280'
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px'
    },
    emptyText: {
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '8px'
    },
    emptySubtext: {
        fontSize: '1rem',
        color: '#6b7280'
    }
};

export default BarangayDashboard;
