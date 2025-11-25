import React from 'react';
import { styles } from './userStyles';

const WasteTypeSelector = ({ selectedType, onTypeChange, loadSize = 'base', onLoadSizeChange }) => {
    const wasteTypes = [
        {
            value: 'recyclable',
            label: 'Recyclable',
            icon: '♻️',
            description: 'Paper, plastic, metal, glass',
            color: '#10b981',
            bgColor: '#ecfdf5',
        },
        {
            value: 'biodegradable',
            label: 'Biodegradable',
            icon: '🌱',
            description: 'Food waste, garden trimmings',
            color: '#10b981',
            bgColor: '#ecfdf5',
        },
        {
            value: 'residual',
            label: 'Residual',
            icon: '🗑️',
            description: 'Non-recyclable trash',
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
        {
            value: 'bulk',
            label: 'Bulk / Special',
            icon: '🚛',
            description: 'Construction debris, appliances, large items',
            color: '#6366f1',
            bgColor: '#e0e7ff',
        },
    ];

    return (
        <div style={{
            marginBottom: '20px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
        }}>
            <p style={{
                margin: '0 0 12px',
                fontWeight: '600',
                fontSize: '0.95rem',
                color: '#1e293b'
            }}>
                🗑️ What type of waste do you have?
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px'
            }}>
                {wasteTypes.map((type) => (
                    <label
                        key={type.value}
                        style={{
                            padding: '14px',
                            borderRadius: '10px',
                            border: selectedType === type.value ? `2px solid ${type.color}` : '2px solid #e2e8f0',
                            backgroundColor: selectedType === type.value ? type.bgColor : '#fff',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        <input
                            type="radio"
                            name="wasteType"
                            value={type.value}
                            checked={selectedType === type.value}
                            onChange={(e) => onTypeChange(e.target.value)}
                            style={{
                                accentColor: type.color,
                                marginTop: '2px',
                                cursor: 'pointer'
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}>
                                <span>{type.icon}</span>
                                <span>{type.label}</span>
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: '#64748b',
                                lineHeight: '1.3'
                            }}>
                                {type.description}
                            </div>
                        </div>
                    </label>
                ))}
            </div>

            {selectedType === 'residual' && (
                <div style={{
                    marginTop: '12px',
                    padding: '10px 12px',
                    backgroundColor: '#fef3c7',
                    borderRadius: '8px',
                    border: '1px solid #fde047',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start'
                }}>
                    <span style={{ fontSize: '1rem' }}>ℹ️</span>
                    <p style={{
                        margin: 0,
                        fontSize: '0.85rem',
                        color: '#92400e',
                        lineHeight: '1.4'
                    }}>
                        For residual waste, we'll show you the city truck collection schedule for your barangay.
                    </p>
                </div>
            )}

            {selectedType === 'bulk' && (
                <div style={{
                    marginTop: '12px',
                    padding: '16px',
                    backgroundColor: '#e0e7ff',
                    borderRadius: '12px',
                    border: '1px solid #c7d2fe',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '1.2rem' }}>💰</span>
                        <h4 style={{ margin: 0, color: '#3730a3', fontSize: '1rem', fontWeight: '700' }}>Select Load Size</h4>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {[
                            { id: 'base', label: 'Base Pickup (Light)', price: 150, desc: 'Up to 3 sacks' },
                            { id: 'medium', label: 'Medium Load', price: 300, desc: 'Half-multicab / Appliance' },
                            { id: 'full', label: 'Full Load', price: 500, desc: 'Full Multicab / Debris' }
                        ].map((option) => (
                            <label
                                key={option.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '12px',
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: loadSize === option.id ? '2px solid #6366f1' : '1px solid #c7d2fe',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <input
                                    type="radio"
                                    name="loadSize"
                                    value={option.id}
                                    checked={loadSize === option.id}
                                    onChange={(e) => onLoadSizeChange(e.target.value)}
                                    style={{ accentColor: '#6366f1', marginRight: '12px' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#1e293b' }}>
                                        <span>{option.label}</span>
                                        <span>₱{option.price}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{option.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6366f1', fontStyle: 'italic' }}>
                        *Final price may vary based on actual load assessment by the driver.
                    </p>
                </div>
            )}
        </div>
    );
};

export default WasteTypeSelector;
