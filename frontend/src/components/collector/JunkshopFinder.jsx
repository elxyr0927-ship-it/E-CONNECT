import React, { useState, useEffect } from 'react';
import JunkshopCard from './JunkshopCard';
import { sortJunkshopsByDistance, findBestJunkshop, calculateJunkshopEarnings } from '../../utils/junkshopUtils';
import { getAllJunkshops } from '../../utils/junkshopStorage';

const JunkshopFinder = ({
    isOpen,
    onClose,
    currentPosition,
    wasteType = 'recyclable',
    onRouteToJunkshop
}) => {
    const [junkshops, setJunkshops] = useState([]);
    const [sortedJunkshops, setSortedJunkshops] = useState([]);
    const [bestJunkshop, setBestJunkshop] = useState(null);
    const [filterMaterial, setFilterMaterial] = useState('all');

    useEffect(() => {
        // Load junkshops from storage
        const loadedJunkshops = getAllJunkshops();
        setJunkshops(loadedJunkshops);
    }, [isOpen]); // Reload when modal opens to get latest data

    useEffect(() => {
        if (currentPosition && junkshops.length > 0) {
            // Sort junkshops by distance
            let sorted = sortJunkshopsByDistance(junkshops, currentPosition);

            // Add estimated earnings to each junkshop
            sorted = sorted.map(shop => ({
                ...shop,
                estimatedEarnings: calculateJunkshopEarnings(wasteType, shop)
            }));

            // Filter by material if selected
            if (filterMaterial !== 'all') {
                sorted = sorted.filter(shop =>
                    shop.acceptedMaterials && shop.acceptedMaterials.includes(filterMaterial)
                );
            }

            setSortedJunkshops(sorted);

            // Find best junkshop
            const best = findBestJunkshop(junkshops, currentPosition, wasteType);
            setBestJunkshop(best);
        }
    }, [currentPosition, junkshops, wasteType, filterMaterial]);

    const handleRouteToJunkshop = (junkshop) => {
        onRouteToJunkshop({ lat: junkshop.lat, lng: junkshop.lng }, junkshop.name);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div style={{
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
            padding: '16px'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', color: '#111827' }}>
                                ♻️ Find Junkshop
                            </h2>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                Maximize your earnings by selling to nearby junkshops
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                color: '#9ca3af',
                                padding: '4px',
                                lineHeight: 1
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Waste Type Badge */}
                    <div style={{ marginTop: '12px' }}>
                        <span style={{
                            display: 'inline-block',
                            padding: '6px 12px',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                        }}>
                            Current Load: {wasteType === 'recyclable' ? '♻️ Recyclable' : '🌱 Biodegradable'}
                        </span>
                    </div>
                </div>

                {/* Filter */}
                <div style={{
                    padding: '16px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                }}>
                    <label style={{
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        color: '#374151',
                        display: 'block',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        Filter by Material
                    </label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['all', 'plastic', 'metal', 'paper', 'copper', 'aluminum'].map(material => (
                            <button
                                key={material}
                                onClick={() => setFilterMaterial(material)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '16px',
                                    border: 'none',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    backgroundColor: filterMaterial === material ? '#10b981' : '#e5e7eb',
                                    color: filterMaterial === material ? 'white' : '#4b5563',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {material}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Junkshop List */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '24px'
                }}>
                    {sortedJunkshops.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '48px 24px',
                            color: '#9ca3af'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
                            <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                                No junkshops found
                            </p>
                            <p style={{ margin: '8px 0 0', fontSize: '0.875rem' }}>
                                Try adjusting your filter or check back later
                            </p>
                        </div>
                    ) : (
                        <>
                            <p style={{
                                margin: '0 0 16px',
                                fontSize: '0.875rem',
                                color: '#6b7280'
                            }}>
                                Found {sortedJunkshops.length} junkshop{sortedJunkshops.length !== 1 ? 's' : ''} nearby
                            </p>

                            {sortedJunkshops.map((shop, index) => (
                                <JunkshopCard
                                    key={shop.id || shop.barangayName || index}
                                    junkshop={shop}
                                    onRoute={handleRouteToJunkshop}
                                    isRecommended={bestJunkshop && shop.barangayName === bestJunkshop.barangayName}
                                />
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px',
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: '#f9fafb'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '0.75rem',
                        color: '#6b7280',
                        textAlign: 'center'
                    }}>
                        💡 Tip: Choose junkshops with higher buying prices for maximum profit
                    </p>
                </div>
            </div>
        </div>
    );
};

export default JunkshopFinder;
