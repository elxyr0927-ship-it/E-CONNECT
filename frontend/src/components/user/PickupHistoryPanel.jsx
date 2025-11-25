import React, { useState } from 'react';
import { styles } from './userStyles';

const PickupHistoryPanel = ({ activityHistory, isVisible }) => {
    const [filterType, setFilterType] = useState('all');
    const [filterDate, setFilterDate] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isVisible) return null;

    // Filter activities
    const filteredActivities = activityHistory.filter(activity => {
        // Type filter
        if (filterType !== 'all') {
            const activityType = activity.title.toLowerCase();
            if (filterType === 'recyclable' && !activityType.includes('recycl')) return false;
            if (filterType === 'biodegradable' && !activityType.includes('bio')) return false;
            if (filterType === 'bulk' && !activityType.includes('bulk')) return false;
        }

        // Search filter
        if (searchQuery && !activity.location.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }

        return true;
    });

    // Calculate statistics
    const totalPickups = filteredActivities.filter(a => a.points > 0).length;
    const totalPoints = filteredActivities.reduce((sum, a) => sum + (a.points > 0 ? a.points : 0), 0);
    const wasteTypes = {};
    filteredActivities.forEach(a => {
        const type = a.title.split(' ')[0];
        wasteTypes[type] = (wasteTypes[type] || 0) + 1;
    });
    const mostCommon = Object.keys(wasteTypes).length > 0
        ? Object.entries(wasteTypes).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    return (
        <section style={styles.activityPanel}>
            {/* Header */}
            <div style={styles.tabHeader}>
                <div>
                    <h3 style={styles.sectionTitle}>📜 Pickup History</h3>
                    <p style={styles.cardHint}>Detailed record of all your completed pickups</p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
            }}>
                <div style={{
                    backgroundColor: '#f0f9ff',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #bae6fd'
                }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#0369a1' }}>Total Pickups</p>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#0c4a6e' }}>{totalPickups}</h3>
                </div>
                <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0'
                }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#15803d' }}>Total Points</p>
                    <h3 style={{ margin: 0, fontSize: '2rem', color: '#14532d' }}>{totalPoints}</h3>
                </div>
                <div style={{
                    backgroundColor: '#fef3c7',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid #fde68a'
                }}>
                    <p style={{ margin: '0 0 4px', fontSize: '0.875rem', color: '#92400e' }}>Most Common</p>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#78350f' }}>{mostCommon}</h3>
                </div>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem',
                        backgroundColor: 'white'
                    }}
                >
                    <option value="all">All Types</option>
                    <option value="recyclable">♻️ Recyclable</option>
                    <option value="biodegradable">🌱 Biodegradable</option>
                    <option value="bulk">🚛 Bulk</option>
                </select>

                <input
                    type="text"
                    placeholder="Search by location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '200px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.875rem'
                    }}
                />

                <button
                    onClick={() => {
                        setFilterType('all');
                        setSearchQuery('');
                    }}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                    }}
                >
                    Clear Filters
                </button>
            </div>

            {/* Pickup List */}
            <div style={styles.activityList}>
                {filteredActivities.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                        <p style={{ fontSize: '3rem', margin: '0 0 16px' }}>📭</p>
                        <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>No pickups found</p>
                        <p style={{ margin: '8px 0 0', fontSize: '0.875rem' }}>Try adjusting your filters</p>
                    </div>
                )}
                {filteredActivities.map((activity) => (
                    <div
                        key={activity.id}
                        style={{
                            ...styles.activityItem,
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '12px'
                        }}
                        className="user-page__activity-item"
                    >
                        <div style={styles.activityIcon}>{activity.icon}</div>
                        <div style={{ ...styles.activityDetails, flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <p style={styles.activityTitle}>{activity.title}</p>
                                    <p style={styles.activityMeta}>
                                        📅 {activity.date} · 📍 {activity.location}
                                    </p>
                                </div>
                                <div style={{
                                    ...styles.activityPoints,
                                    color: activity.points >= 0 ? '#15803d' : '#dc2626',
                                    backgroundColor: activity.points >= 0 ? '#f0fdf4' : '#fef2f2',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontWeight: '700'
                                }}>
                                    {activity.points >= 0 ? '+' : ''}{activity.points} pts
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Export Button */}
            {filteredActivities.length > 0 && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                        onClick={() => {
                            const csv = [
                                ['Date', 'Title', 'Location', 'Points'].join(','),
                                ...filteredActivities.map(a =>
                                    [a.date, a.title, a.location, a.points].join(',')
                                )
                            ].join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'pickup-history.csv';
                            link.click();
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        📥 Export to CSV
                    </button>
                </div>
            )}
        </section>
    );
};

export default PickupHistoryPanel;
