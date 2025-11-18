import React, { useEffect, useState } from 'react';
import { FiUsers, FiBriefcase, FiAward, FiEdit2, FiTrash2 } from 'react-icons/fi';

const mockUsers = [
  { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', points: 3250, role: 'user' },
  { id: 2, name: 'Maria Santos', email: 'maria@example.com', points: 2850, role: 'user' },
  { id: 3, name: 'John Doe', email: 'john@example.com', points: 4200, role: 'worker' },
];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, []);

  const totalUsers = users.filter((user) => user.role === 'user').length;
  const totalWorkers = users.filter((user) => user.role === 'worker').length;
  const totalPoints = users.reduce((sum, user) => sum + user.points, 0);

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Monitor users, workers, and sustainability progress at a glance.</p>
      </header>

      <section style={styles.statsGrid}>
        <div style={styles.statCard}>
          <FiUsers style={styles.statIcon} />
          <p style={styles.statLabel}>Total users</p>
          <h3 style={styles.statValue}>{totalUsers}</h3>
        </div>
        <div style={styles.statCard}>
          <FiBriefcase style={styles.statIcon} />
          <p style={styles.statLabel}>Total workers</p>
          <h3 style={styles.statValue}>{totalWorkers}</h3>
        </div>
        <div style={styles.statCard}>
          <FiAward style={styles.statIcon} />
          <p style={styles.statLabel}>Eco points issued</p>
          <h3 style={styles.statValue}>{totalPoints.toLocaleString()}</h3>
        </div>
      </section>

      <section style={styles.tableSection}>
        <div style={styles.tableHeader}>
          <div>
            <h2 style={styles.tableTitle}>User management</h2>
            <p style={styles.tableSubtitle}>Edit user roles, track activity, and manage worker assignments.</p>
          </div>
        </div>
        {loading ? (
          <p style={styles.loading}>Loading user data…</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Points</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.points.toLocaleString()}</td>
                    <td>
                      <span
                        style={{
                          ...styles.roleBadge,
                          backgroundColor: user.role === 'worker' ? '#dbeafe' : '#dcfce7',
                          color: user.role === 'worker' ? '#1d4ed8' : '#15803d',
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.actionCell}>
                      <button style={{ ...styles.actionButton, backgroundColor: '#3b82f6' }}>
                        <FiEdit2 /> Edit
                      </button>
                      <button style={{ ...styles.actionButton, backgroundColor: '#ef4444' }}>
                        <FiTrash2 /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

const styles = {
  page: {
    fontFamily: 'Inter, sans-serif',
    padding: '40px clamp(20px, 4vw, 60px)',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    margin: 0,
    fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
    color: '#0f172a',
  },
  subtitle: {
    margin: 0,
    color: '#475569',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 15px 30px rgba(15, 23, 42, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  statIcon: {
    fontSize: '1.8rem',
    color: '#16a34a',
  },
  statLabel: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#64748b',
  },
  statValue: {
    margin: 0,
    fontSize: '1.8rem',
    color: '#0f172a',
    fontWeight: 700,
  },
  tableSection: {
    backgroundColor: '#fff',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 15px 30px rgba(15, 23, 42, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px',
  },
  tableTitle: {
    margin: 0,
    color: '#0f172a',
  },
  tableSubtitle: {
    margin: 0,
    color: '#475569',
  },
  loading: {
    margin: 0,
    padding: '24px',
    textAlign: 'center',
    color: '#475569',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  roleBadge: {
    padding: '6px 12px',
    borderRadius: '999px',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  actionCell: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    border: 'none',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
  },
};

export default AdminDashboard;
