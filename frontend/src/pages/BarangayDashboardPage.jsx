import React from 'react';
import { useNavigate } from 'react-router-dom';
import BarangayDashboard from '../components/BarangayDashboard';

const BarangayDashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* Header with back button */}
            <div style={styles.header}>
                <button style={styles.backButton} onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
                <h1 style={styles.pageTitle}>Barangay Performance Dashboard</h1>
            </div>

            {/* Dashboard Component */}
            <BarangayDashboard />
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
    },
    header: {
        backgroundColor: '#fff',
        padding: '20px 40px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#10b981',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '0.95rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    pageTitle: {
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#111827',
        margin: 0
    }
};

export default BarangayDashboardPage;
