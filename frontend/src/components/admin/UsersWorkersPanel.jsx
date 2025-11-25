import React, { useState, useEffect, useCallback } from 'react';
import { FiUserCheck, FiUserX, FiActivity } from 'react-icons/fi';
import { useSocket } from '../../context/socket';
import { styles } from './adminStyles';

const UsersWorkersPanel = () => {
    const { socket } = useSocket();
    const [users, setUsers] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const fetchUsersWorkers = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/users-workers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users || []);
                setWorkers(data.workers || []);
                setLastUpdated(new Date());
            } else {
                console.error('Failed to fetch users and workers');
            }
        } catch (error) {
            console.error('Error fetching users and workers:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsersWorkers();
    }, [fetchUsersWorkers]);

    // Listen for real-time user status updates
    useEffect(() => {
        const handleUserStatusUpdate = (update) => {
            console.log('Received user status update:', update);
            // Immediately refetch the data when a user logs in/out
            fetchUsersWorkers();
        };

        socket.on('userStatusUpdate', handleUserStatusUpdate);

        return () => {
            socket.off('userStatusUpdate', handleUserStatusUpdate);
        };
    }, [fetchUsersWorkers, socket]);

    const filteredUsers = users.filter(user => {
        if (filter === 'active') return user.isActive;
        if (filter === 'inactive') return !user.isActive;
        return true;
    });

    const filteredWorkers = workers.filter(worker => {
        if (filter === 'online') return worker.isOnline;
        if (filter === 'offline') return !worker.isOnline;
        return true;
    });

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner} />
                <p>Loading users and workers...</p>
            </div>
        );
    }

    return (
        <div style={styles.usersPanel}>
            <div style={styles.panelHeader}>
                <h3 style={styles.sectionTitle}>Users & Workers Management</h3>
                <div style={styles.lastUpdated}>
                    <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div style={styles.filterSection}>
                <div style={styles.filterGroup}>
                    <label style={styles.filterLabel}>Users:</label>
                    <button
                        style={filter === 'all' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilter('all')}
                    >
                        All ({users.length})
                    </button>
                    <button
                        style={filter === 'active' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilter('active')}
                    >
                        Active ({users.filter(u => u.isActive).length})
                    </button>
                    <button
                        style={filter === 'inactive' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilter('inactive')}
                    >
                        Inactive ({users.filter(u => !u.isActive).length})
                    </button>
                </div>
                <div style={styles.filterGroup}>
                    <label style={styles.filterLabel}>Workers:</label>
                    <button
                        style={filter === 'all' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilter('all')}
                    >
                        All ({workers.length})
                    </button>
                    <button
                        style={filter === 'online' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilter('online')}
                    >
                        Online ({workers.filter(w => w.isOnline).length})
                    </button>
                    <button
                        style={filter === 'offline' ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilter('offline')}
                    >
                        Offline ({workers.filter(w => !w.isOnline).length})
                    </button>
                </div>
            </div>

            <div style={styles.listsContainer}>
                <div style={styles.listSection}>
                    <h3 style={styles.sectionTitle}>Users ({filteredUsers.length})</h3>
                    <div style={styles.usersList}>
                        {filteredUsers.length === 0 ? (
                            <p style={styles.emptyText}>No users found.</p>
                        ) : (
                            filteredUsers.map(user => (
                                <div key={user.id} style={styles.userCard}>
                                    <div style={styles.userInfo}>
                                        <div style={styles.userAvatar}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={styles.cardUserName}>{user.name}</p>
                                            <p style={styles.userDetail}>@{user.username}</p>
                                            <p style={styles.userDetail}>{user.district}</p>
                                        </div>
                                    </div>
                                    <div style={styles.userStatus}>
                                        {user.isActive ? (
                                            <div style={{ ...styles.statusBadge, backgroundColor: '#dcfce7', color: '#166534' }}>
                                                <FiUserCheck size={14} />
                                                Active
                                            </div>
                                        ) : (
                                            <div style={{ ...styles.statusBadge, backgroundColor: '#fef2f2', color: '#991b1b' }}>
                                                <FiUserX size={14} />
                                                Inactive
                                            </div>
                                        )}
                                        {user.lastActivity && (
                                            <p style={styles.lastActivity}>
                                                Last seen: {new Date(user.lastActivity).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div style={styles.listSection}>
                    <h3 style={styles.sectionTitle}>Workers ({filteredWorkers.length})</h3>
                    <div style={styles.usersList}>
                        {filteredWorkers.length === 0 ? (
                            <p style={styles.emptyText}>No workers found.</p>
                        ) : (
                            filteredWorkers.map(worker => (
                                <div key={worker.id} style={styles.userCard}>
                                    <div style={styles.userInfo}>
                                        <div style={styles.workerAvatar}>
                                            {worker.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={styles.cardUserName}>{worker.name}</p>
                                            <p style={styles.userDetail}>@{worker.username}</p>
                                            <p style={styles.userDetail}>Worker</p>
                                        </div>
                                    </div>
                                    <div style={styles.userStatus}>
                                        {worker.isOnline ? (
                                            <div style={{ ...styles.statusBadge, backgroundColor: '#dcfce7', color: '#166534' }}>
                                                <FiActivity size={14} />
                                                Online
                                            </div>
                                        ) : (
                                            <div style={{ ...styles.statusBadge, backgroundColor: '#fef3c7', color: '#92400e' }}>
                                                <FiUserX size={14} />
                                                Offline
                                            </div>
                                        )}
                                        {worker.lastActivity && (
                                            <p style={styles.lastActivity}>
                                                Last seen: {new Date(worker.lastActivity).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersWorkersPanel;
