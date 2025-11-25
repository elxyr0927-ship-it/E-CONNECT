import React, { useState } from 'react';
import { styles } from './adminStyles';

const BarangayRankings = () => {
    // State for rankings
    const [rankings, setRankings] = useState([]);

    React.useEffect(() => {
        fetch('/api/rankings')
            .then(res => res.json())
            .then(data => setRankings(data))
            .catch(err => console.error('Failed to fetch rankings:', err));
    }, []);

    const getRankBadge = (index) => {
        switch (index) {
            case 0: return <span style={{ fontSize: '1.5rem' }}>🏆</span>;
            case 1: return <span style={{ fontSize: '1.5rem' }}>🥈</span>;
            case 2: return <span style={{ fontSize: '1.5rem' }}>🥉</span>;
            default: return <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#64748b' }}>#{index + 1}</span>;
        }
    };

    const getTrendIcon = (trend) => {
        switch (trend) {
            case 'up': return <span style={{ color: '#10b981' }}>▲</span>;
            case 'down': return <span style={{ color: '#ef4444' }}>▼</span>;
            default: return <span style={{ color: '#94a3b8' }}>▶</span>;
        }
    };

    return (
        <div style={styles.settingsPanel}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h3 style={styles.sectionTitle}>Barangay Performance Leaderboard</h3>
                    <p style={styles.settingsHelp}>
                        Rankings based on pickup efficiency, recyclable volume, and resident feedback.
                    </p>
                </div>
                <div style={{
                    padding: '8px 16px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '8px',
                    border: '1px solid #bbf7d0',
                    color: '#15803d',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                }}>
                    City Average Score: 87.1
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>RANK</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>BARANGAY</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>SCORE</th>
                            <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>PICKUPS</th>
                            <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>RECYCLABLES</th>
                            <th style={{ padding: '12px', textAlign: 'right', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>COMPLAINTS</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', fontWeight: '600' }}>TREND</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings.map((barangay, index) => (
                            <tr key={barangay.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px 12px', textAlign: 'left' }}>
                                    {getRankBadge(index)}
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{barangay.name}</div>
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                    <div style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '99px',
                                        backgroundColor: index < 3 ? '#dcfce7' : '#f1f5f9',
                                        color: index < 3 ? '#15803d' : '#475569',
                                        fontWeight: '700'
                                    }}>
                                        {barangay.score}
                                    </div>
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'right', color: '#475569' }}>
                                    {barangay.pickups.toLocaleString()}
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'right', color: '#475569' }}>
                                    {barangay.recyclables}
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                    <span style={{ color: barangay.complaints > 5 ? '#ef4444' : '#10b981', fontWeight: '600' }}>
                                        {barangay.complaints}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                    {getTrendIcon(barangay.trend)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BarangayRankings;
