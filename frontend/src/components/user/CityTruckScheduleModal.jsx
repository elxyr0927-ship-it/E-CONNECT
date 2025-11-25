import React from 'react';
import { styles } from './userStyles';

const CityTruckScheduleModal = ({ isOpen, schedule, onClose }) => {
    if (!isOpen || !schedule) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    padding: '32px',
                    maxWidth: '500px',
                    width: '100%',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚛</div>
                    <h3 style={{
                        margin: '0 0 8px',
                        fontSize: '1.5rem',
                        color: '#1e293b',
                        fontWeight: '700'
                    }}>
                        City Truck Schedule
                    </h3>
                    <p style={{
                        margin: 0,
                        color: '#64748b',
                        fontSize: '0.95rem'
                    }}>
                        {schedule.barangayName}
                    </p>
                </div>

                <div
                    style={{
                        padding: '20px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        marginBottom: '20px',
                    }}
                >
                    <p style={{
                        margin: '0 0 12px',
                        fontWeight: '600',
                        color: '#1e293b',
                        fontSize: '0.95rem'
                    }}>
                        📅 Collection Days:
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '16px'
                    }}>
                        {schedule.residualDays.map((day) => (
                            <span
                                key={day}
                                style={{
                                    padding: '6px 14px',
                                    backgroundColor: '#10b981',
                                    color: '#fff',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                }}
                            >
                                {day}
                            </span>
                        ))}
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>🕐</span>
                            <div>
                                <strong style={{ fontSize: '0.9rem', color: '#475569' }}>Time:</strong>
                                <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: '#475569' }}>
                                    {schedule.collectionTime}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px'
                        }}>
                            <span style={{ fontSize: '1.1rem' }}>🔄</span>
                            <div>
                                <strong style={{ fontSize: '0.9rem', color: '#475569' }}>Frequency:</strong>
                                <p style={{ margin: '2px 0 0', fontSize: '0.9rem', color: '#475569' }}>
                                    {schedule.frequency}
                                </p>
                            </div>
                        </div>

                        {schedule.notes && (
                            <div style={{
                                marginTop: '8px',
                                padding: '12px',
                                backgroundColor: '#fef3c7',
                                borderRadius: '8px',
                                border: '1px solid #fde047',
                            }}>
                                <div style={{
                                    display: 'flex',
                                    gap: '8px',
                                    alignItems: 'flex-start'
                                }}>
                                    <span style={{ fontSize: '1rem' }}>📝</span>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.85rem',
                                        color: '#92400e',
                                        lineHeight: '1.4'
                                    }}>
                                        {schedule.notes}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#fff',
                            color: '#475569',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => {
                            alert('Reminder set! We\'ll notify you on collection day.');
                            onClose();
                        }}
                        style={{
                            flex: 1,
                            padding: '12px 24px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(120deg, #10b981, #22d3ee)',
                            color: '#fff',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Set Reminder
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CityTruckScheduleModal;
