import React from 'react';
import { formatDistance, isJunkshopOpen } from '../../utils/junkshopUtils';

const JunkshopCard = ({ junkshop, onRoute, isRecommended = false }) => {
    const isOpen = isJunkshopOpen(junkshop.operatingHours);

    return (
        <div style={{
            backgroundColor: isRecommended ? '#ecfdf5' : '#ffffff',
            border: isRecommended ? '2px solid #10b981' : '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
            position: 'relative',
            transition: 'all 0.2s',
            cursor: 'pointer',
            boxShadow: isRecommended ? '0 4px 6px rgba(16, 185, 129, 0.1)' : '0 1px 3px rgba(0,0,0,0.1)'
        }}>
            {isRecommended && (
                <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                }}>
                    ⭐ BEST VALUE
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                    <h4 style={{
                        margin: '0 0 4px',
                        fontSize: '1rem',
                        color: '#111827',
                        fontWeight: '600'
                    }}>
                        {junkshop.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{
                            fontSize: '0.875rem',
                            color: '#6b7280',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            📍 {formatDistance(junkshop.distance)}
                        </span>
                        <span style={{
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            backgroundColor: isOpen ? '#d1fae5' : '#fee2e2',
                            color: isOpen ? '#065f46' : '#991b1b',
                            fontWeight: '600'
                        }}>
                            {isOpen ? '● Open' : '● Closed'}
                        </span>
                    </div>
                    {junkshop.operatingHours && (
                        <p style={{
                            margin: '0',
                            fontSize: '0.75rem',
                            color: '#9ca3af'
                        }}>
                            🕐 {junkshop.operatingHours}
                        </p>
                    )}
                </div>

                {junkshop.estimatedEarnings && (
                    <div style={{
                        textAlign: 'right',
                        marginLeft: '12px'
                    }}>
                        <p style={{
                            margin: '0',
                            fontSize: '0.75rem',
                            color: '#6b7280'
                        }}>
                            Est. Earnings
                        </p>
                        <p style={{
                            margin: '4px 0 0',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#10b981'
                        }}>
                            ₱{Math.round(junkshop.estimatedEarnings)}
                        </p>
                    </div>
                )}
            </div>

            {/* Buying Prices */}
            {junkshop.buyingPrices && (
                <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px'
                }}>
                    <p style={{
                        margin: '0 0 8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Buying Prices
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '8px'
                    }}>
                        {Object.entries(junkshop.buyingPrices).map(([material, price]) => (
                            <div key={material} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem'
                            }}>
                                <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                                    {material}:
                                </span>
                                <span style={{ fontWeight: '600', color: '#111827' }}>
                                    ₱{price}/kg
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Contact Info */}
            {junkshop.contactNumber && (
                <p style={{
                    margin: '0 0 12px',
                    fontSize: '0.75rem',
                    color: '#6b7280'
                }}>
                    📞 {junkshop.contactNumber}
                </p>
            )}

            {/* Route Button */}
            <button
                onClick={() => onRoute(junkshop)}
                disabled={!isOpen}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: isOpen ? '#10b981' : '#9ca3af',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: isOpen ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
                onMouseEnter={(e) => {
                    if (isOpen) {
                        e.target.style.backgroundColor = '#059669';
                        e.target.style.transform = 'translateY(-1px)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (isOpen) {
                        e.target.style.backgroundColor = '#10b981';
                        e.target.style.transform = 'translateY(0)';
                    }
                }}
            >
                🗺️ Route to Junkshop
            </button>
        </div>
    );
};

export default JunkshopCard;
