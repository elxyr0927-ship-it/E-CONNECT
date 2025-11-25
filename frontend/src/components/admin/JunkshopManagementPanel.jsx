import React, { useState, useEffect } from 'react';
import { getAllJunkshops, addJunkshop, updateJunkshop, deleteJunkshop, validateJunkshop } from '../../utils/junkshopStorage';
import brgyData from '../../data/brgy.json';

const JunkshopManagementPanel = () => {
    const [junkshops, setJunkshops] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingJunkshop, setEditingJunkshop] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        barangayName: '',
        lat: 9.3068,
        lng: 123.3054,
        operatingHours: '8:00 AM - 6:00 PM',
        contactNumber: '',
        buyingPrices: {
            plastic: 15,
            metal: 50,
            paper: 4,
            copper: 300,
            aluminum: 80,
            mixed: 10
        },
        acceptedMaterials: []
    });
    const [errors, setErrors] = useState([]);
    const [notification, setNotification] = useState(null);

    const materialOptions = ['plastic', 'metal', 'paper', 'copper', 'aluminum', 'glass', 'electronics'];

    useEffect(() => {
        loadJunkshops();
    }, []);

    const loadJunkshops = () => {
        const loaded = getAllJunkshops();
        setJunkshops(loaded);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenForm = (junkshop = null) => {
        if (junkshop) {
            setEditingJunkshop(junkshop);
            setFormData(junkshop);
        } else {
            setEditingJunkshop(null);
            setFormData({
                name: '',
                barangayName: '',
                lat: 9.3068,
                lng: 123.3054,
                operatingHours: '8:00 AM - 6:00 PM',
                contactNumber: '',
                buyingPrices: {
                    plastic: 15,
                    metal: 50,
                    paper: 4,
                    copper: 300,
                    aluminum: 80,
                    mixed: 10
                },
                acceptedMaterials: []
            });
        }
        setErrors([]);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingJunkshop(null);
        setErrors([]);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePriceChange = (material, value) => {
        setFormData(prev => ({
            ...prev,
            buyingPrices: {
                ...prev.buyingPrices,
                [material]: parseFloat(value) || 0
            }
        }));
    };

    const handleMaterialToggle = (material) => {
        setFormData(prev => ({
            ...prev,
            acceptedMaterials: prev.acceptedMaterials.includes(material)
                ? prev.acceptedMaterials.filter(m => m !== material)
                : [...prev.acceptedMaterials, material]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validateJunkshop(formData);
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        if (editingJunkshop) {
            const updated = updateJunkshop(editingJunkshop.id, formData);
            if (updated) {
                showNotification('Junkshop updated successfully!');
                loadJunkshops();
                handleCloseForm();
            }
        } else {
            const created = addJunkshop(formData);
            if (created) {
                showNotification('Junkshop added successfully!');
                loadJunkshops();
                handleCloseForm();
            }
        }
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            const success = deleteJunkshop(id);
            if (success) {
                showNotification('Junkshop deleted successfully!', 'success');
                loadJunkshops();
            }
        }
    };

    return (
        <div style={{ padding: '24px' }}>
            {/* Notification */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 1000
                }}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: '#111827' }}>
                        🏪 Junkshop Management
                    </h2>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
                        Manage junkshop locations, operating hours, and buying prices
                    </p>
                </div>
                <button
                    onClick={() => handleOpenForm()}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    + Add Junkshop
                </button>
            </div>

            {/* Junkshop List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '16px' }}>
                {junkshops.map(shop => (
                    <div key={shop.id} style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ marginBottom: '12px' }}>
                            <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', color: '#111827' }}>
                                {shop.name}
                            </h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#6b7280' }}>
                                📍 {shop.barangayName}
                            </p>
                        </div>

                        <div style={{ marginBottom: '12px', fontSize: '0.875rem', color: '#4b5563' }}>
                            <p style={{ margin: '4px 0' }}>🕐 {shop.operatingHours}</p>
                            <p style={{ margin: '4px 0' }}>📞 {shop.contactNumber || 'N/A'}</p>
                            <p style={{ margin: '4px 0' }}>📍 {shop.lat.toFixed(4)}, {shop.lng.toFixed(4)}</p>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '0.75rem', fontWeight: '600', color: '#374151' }}>
                                ACCEPTED MATERIALS
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {shop.acceptedMaterials?.map(material => (
                                    <span key={material} style={{
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af',
                                        borderRadius: '12px'
                                    }}>
                                        {material}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => handleOpenForm(shop)}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(shop.id, shop.name)}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {junkshops.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏪</div>
                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>No junkshops yet</p>
                    <p style={{ margin: '8px 0 0', fontSize: '0.875rem' }}>Click "Add Junkshop" to create one</p>
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                    padding: '16px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                        padding: '24px'
                    }}>
                        <h3 style={{ margin: '0 0 16px', fontSize: '1.25rem' }}>
                            {editingJunkshop ? 'Edit Junkshop' : 'Add New Junkshop'}
                        </h3>

                        {errors.length > 0 && (
                            <div style={{
                                backgroundColor: '#fee2e2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '12px',
                                marginBottom: '16px'
                            }}>
                                {errors.map((error, i) => (
                                    <p key={i} style={{ margin: '4px 0', color: '#991b1b', fontSize: '0.875rem' }}>
                                        • {error}
                                    </p>
                                ))}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* Basic Info */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="e.g., Bagacay Recycling Center"
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Barangay *
                                </label>
                                <select
                                    value={formData.barangayName}
                                    onChange={(e) => handleInputChange('barangayName', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    <option value="">Select Barangay</option>
                                    {brgyData.barangays.map(brgy => (
                                        <option key={brgy.id} value={brgy.name}>{brgy.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Latitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={formData.lat}
                                        onChange={(e) => handleInputChange('lat', parseFloat(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                        Longitude *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.0001"
                                        value={formData.lng}
                                        onChange={(e) => handleInputChange('lng', parseFloat(e.target.value))}
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.875rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Operating Hours *
                                </label>
                                <input
                                    type="text"
                                    value={formData.operatingHours}
                                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="e.g., 8:00 AM - 6:00 PM"
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.contactNumber}
                                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        fontSize: '0.875rem'
                                    }}
                                    placeholder="e.g., 0917-123-4567"
                                />
                            </div>

                            {/* Buying Prices */}
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Buying Prices (₱/kg) *
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {Object.keys(formData.buyingPrices).map(material => (
                                        <div key={material} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <label style={{ fontSize: '0.75rem', textTransform: 'capitalize', minWidth: '70px' }}>
                                                {material}:
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.buyingPrices[material]}
                                                onChange={(e) => handlePriceChange(material, e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '6px 8px',
                                                    border: '1px solid #d1d5db',
                                                    borderRadius: '4px',
                                                    fontSize: '0.75rem'
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Accepted Materials */}
                            <div style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600' }}>
                                    Accepted Materials *
                                </label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {materialOptions.map(material => (
                                        <label key={material} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '6px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            backgroundColor: formData.acceptedMaterials.includes(material) ? '#dbeafe' : 'white'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptedMaterials.includes(material)}
                                                onChange={() => handleMaterialToggle(material)}
                                            />
                                            <span style={{ fontSize: '0.875rem', textTransform: 'capitalize' }}>
                                                {material}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {editingJunkshop ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JunkshopManagementPanel;
