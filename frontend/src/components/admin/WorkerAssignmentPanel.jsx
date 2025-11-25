import React, { useState, useEffect, useCallback } from 'react';
import { styles } from './adminStyles';
import brgyData from '../../../../data/brgy.json';

const WorkerAssignmentPanel = () => {
    const [assignments, setAssignments] = useState({});
    const [workers, setWorkers] = useState([]);

    const fetchWorkers = useCallback(async () => {
        try {
            const response = await fetch('/api/admin/users-workers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setWorkers(data.workers || []);
            } else {
                console.error('Failed to fetch workers');
            }
        } catch (error) {
            console.error('Error fetching workers:', error);
        }
    }, []);

    // Load assignments from localStorage and fetch workers
    useEffect(() => {
        const saved = localStorage.getItem('workerAssignments');
        if (saved) {
            try {
                setAssignments(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load assignments:', e);
            }
        }

        fetchWorkers();
    }, [fetchWorkers]);

    // Save assignments to localStorage
    const saveAssignments = (newAssignments) => {
        setAssignments(newAssignments);
        localStorage.setItem('workerAssignments', JSON.stringify(newAssignments));
    };

    const handleAssign = (barangayId, workerId) => {
        const newAssignments = { ...assignments };
        if (workerId === '') {
            delete newAssignments[barangayId];
        } else {
            newAssignments[barangayId] = workerId;
        }
        saveAssignments(newAssignments);
    };

    const getWorkerName = (workerId) => {
        if (!workerId) return 'Unassigned';
        const worker = workers.find(w => w.id === workerId);
        return worker ? worker.name : `Unknown (ID: ${workerId})`;
    };

    const getAssignedBarangays = (workerId) => {
        return Object.entries(assignments)
            .filter(([_, wId]) => wId === workerId)
            .map(([brgyId]) => parseInt(brgyId));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header */}
            <div>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#0f172a' }}>
                    Worker Assignments
                </h2>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                    Assign collectors to specific barangays. Workers will only see pickup requests from their assigned areas.
                </p>
            </div>

            {/* Worker Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '16px'
            }}>
                {workers.length === 0 ? (
                    <div style={{
                        padding: '32px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px dashed #cbd5e1',
                        textAlign: 'center',
                        gridColumn: '1 / -1'
                    }}>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
                            No workers registered yet. Workers will appear here once they sign up.
                        </p>
                    </div>
                ) : (
                    workers.map(worker => {
                        const assignedCount = getAssignedBarangays(worker.id).length;
                        return (
                            <div
                                key={worker.id}
                                style={{
                                    padding: '16px',
                                    backgroundColor: '#fff',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: '#10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontWeight: '600',
                                        fontSize: '1.2rem'
                                    }}>
                                        {worker.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>
                                            {worker.name}
                                        </h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                                            {assignedCount} {assignedCount === 1 ? 'area' : 'areas'} assigned
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Assignment Table */}
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '16px',
                    borderBottom: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc'
                }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a' }}>
                        Barangay Assignments
                    </h3>
                </div>

                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 1 }}>
                            <tr>
                                <th style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#475569',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    Barangay
                                </th>
                                <th style={{
                                    padding: '12px 16px',
                                    textAlign: 'left',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#475569',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>
                                    Assigned Worker
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {brgyData.barangays.map((barangay) => (
                                <tr key={barangay.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '0.9rem', color: '#0f172a' }}>
                                        {barangay.name}
                                    </td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <select
                                            value={assignments[barangay.id] || ''}
                                            onChange={(e) => handleAssign(barangay.id, e.target.value)}
                                            style={{
                                                padding: '8px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #e2e8f0',
                                                fontSize: '0.9rem',
                                                backgroundColor: '#fff',
                                                cursor: 'pointer',
                                                minWidth: '200px'
                                            }}
                                        >
                                            <option value="">Unassigned</option>
                                            {workers.map(worker => (
                                                <option key={worker.id} value={worker.id}>
                                                    {worker.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Info Box */}
            <div style={{
                padding: '16px',
                backgroundColor: '#eff6ff',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
            }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                    <div>
                        <p style={{ margin: '0 0 8px', fontWeight: '600', color: '#1e40af' }}>
                            How it works:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e40af', fontSize: '0.9rem' }}>
                            <li>Assign workers to specific barangays using the dropdowns above</li>
                            <li>When a worker logs in, their assigned barangay's dumpsite is automatically set</li>
                            <li>Workers only see pickup requests from their assigned areas</li>
                            <li>Assignments are saved automatically</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerAssignmentPanel;
