import React, { useState } from 'react';
import { styles } from './userStyles';

const GCashPanel = ({ userData, onUpdatePoints, isVisible }) => {
    const [activeTab, setActiveTab] = useState('cashin');
    const [amount, setAmount] = useState('');
    const [gcashNumber, setGcashNumber] = useState('');
    const [transactions, setTransactions] = useState([
        { id: 1, type: 'cash_in', amount: 50, points: 500, date: 'Nov 20, 2025', status: 'completed', ref: 'GC123456789' },
        { id: 2, type: 'cash_out', amount: 100, points: 1000, date: 'Nov 15, 2025', status: 'completed', ref: 'GC987654321' }
    ]);

    if (!isVisible) return null;

    const CONVERSION_RATE = 10; // 100 points = ₱10, so 10 points per peso

    const handleCashIn = () => {
        const pointsToConvert = parseInt(amount);
        if (!pointsToConvert || pointsToConvert < 500) {
            alert('Minimum 500 points required for cash in');
            return;
        }
        if (pointsToConvert > userData.points) {
            alert('Insufficient points');
            return;
        }
        if (!gcashNumber || gcashNumber.length !== 11) {
            alert('Please enter a valid 11-digit GCash number');
            return;
        }

        const pesos = Math.floor(pointsToConvert / CONVERSION_RATE);
        const newTransaction = {
            id: Date.now(),
            type: 'cash_in',
            amount: pesos,
            points: pointsToConvert,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'completed',
            ref: `GC${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        setTransactions([newTransaction, ...transactions]);
        onUpdatePoints(userData.points - pointsToConvert);
        alert(`✅ Success!\n\n₱${pesos} has been sent to ${gcashNumber}\nReference: ${newTransaction.ref}\n\n${pointsToConvert} points deducted from your account.`);
        setAmount('');
        setGcashNumber('');
    };

    const handleCashOut = () => {
        const pesos = parseInt(amount);
        if (!pesos || pesos < 50) {
            alert('Minimum ₱50 required for cash out');
            return;
        }
        if (!gcashNumber || gcashNumber.length !== 11) {
            alert('Please enter a valid 11-digit GCash number');
            return;
        }

        const pointsToAdd = pesos * CONVERSION_RATE;
        const newTransaction = {
            id: Date.now(),
            type: 'cash_out',
            amount: pesos,
            points: pointsToAdd,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'completed',
            ref: `GC${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        };

        setTransactions([newTransaction, ...transactions]);
        onUpdatePoints(userData.points + pointsToAdd);
        alert(`✅ Success!\n\n${pointsToAdd} points added to your account!\nReference: ${newTransaction.ref}\n\nPayment of ₱${pesos} received from ${gcashNumber}.`);
        setAmount('');
        setGcashNumber('');
    };

    return (
        <section style={styles.activityPanel}>
            {/* Header */}
            <div style={styles.tabHeader}>
                <div>
                    <h3 style={styles.sectionTitle}>💰 GCash Integration</h3>
                    <p style={styles.cardHint}>Convert points to cash or buy points with GCash</p>
                </div>
            </div>

            {/* Balance Card */}
            <div style={{
                background: 'linear-gradient(135deg, #007dfe 0%, #0055fe 100%)',
                padding: '24px',
                borderRadius: '16px',
                color: 'white',
                marginBottom: '24px',
                boxShadow: '0 10px 25px rgba(0, 125, 254, 0.3)'
            }}>
                <p style={{ margin: '0 0 8px', fontSize: '0.875rem', opacity: 0.9 }}>Available Points</p>
                <h2 style={{ margin: '0 0 12px', fontSize: '2.5rem' }}>{userData.points.toLocaleString()}</h2>
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    fontSize: '0.875rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '12px',
                    borderRadius: '8px'
                }}>
                    <div>
                        <p style={{ margin: 0, opacity: 0.9 }}>Cash Value</p>
                        <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: '700' }}>
                            ₱{Math.floor(userData.points / CONVERSION_RATE).toLocaleString()}
                        </p>
                    </div>
                    <div style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '16px' }}>
                        <p style={{ margin: 0, opacity: 0.9 }}>Conversion Rate</p>
                        <p style={{ margin: '4px 0 0', fontSize: '1.25rem', fontWeight: '700' }}>
                            100 pts = ₱10
                        </p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('cashin')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: activeTab === 'cashin' ? '#10b981' : 'white',
                        color: activeTab === 'cashin' ? 'white' : '#6b7280',
                        border: `2px solid ${activeTab === 'cashin' ? '#10b981' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    📤 Cash In (Points → GCash)
                </button>
                <button
                    onClick={() => setActiveTab('cashout')}
                    style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: activeTab === 'cashout' ? '#3b82f6' : 'white',
                        color: activeTab === 'cashout' ? 'white' : '#6b7280',
                        border: `2px solid ${activeTab === 'cashout' ? '#3b82f6' : '#e5e7eb'}`,
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    📥 Cash Out (GCash → Points)
                </button>
            </div>

            {/* Cash In Form */}
            {activeTab === 'cashin' && (
                <div style={{
                    backgroundColor: '#f0fdf4',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #bbf7d0',
                    marginBottom: '24px'
                }}>
                    <h4 style={{ margin: '0 0 16px', color: '#15803d' }}>Convert Points to GCash</h4>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                            Points to Convert (Min: 500)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter points"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        {amount && (
                            <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: '#15803d' }}>
                                You will receive: ₱{Math.floor(parseInt(amount) / CONVERSION_RATE)}
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                            GCash Number
                        </label>
                        <input
                            type="tel"
                            value={gcashNumber}
                            onChange={(e) => setGcashNumber(e.target.value)}
                            placeholder="09XXXXXXXXX"
                            maxLength="11"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        onClick={handleCashIn}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        💸 Convert to GCash
                    </button>
                </div>
            )}

            {/* Cash Out Form */}
            {activeTab === 'cashout' && (
                <div style={{
                    backgroundColor: '#eff6ff',
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px solid #bfdbfe',
                    marginBottom: '24px'
                }}>
                    <h4 style={{ margin: '0 0 16px', color: '#1e40af' }}>Buy Points with GCash</h4>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                            Amount to Pay (Min: ₱50)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount in pesos"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                        {amount && (
                            <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: '#1e40af' }}>
                                You will receive: {parseInt(amount) * CONVERSION_RATE} points
                            </p>
                        )}
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: '600', color: '#374151' }}>
                            GCash Number
                        </label>
                        <input
                            type="tel"
                            value={gcashNumber}
                            onChange={(e) => setGcashNumber(e.target.value)}
                            placeholder="09XXXXXXXXX"
                            maxLength="11"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        onClick={handleCashOut}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        💳 Pay with GCash
                    </button>
                </div>
            )}

            {/* Transaction History */}
            <div>
                <h4 style={{ margin: '0 0 16px', fontSize: '1.1rem', color: '#111827' }}>
                    📋 Transaction History
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {transactions.map((txn) => (
                        <div
                            key={txn.id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '16px',
                                backgroundColor: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '1.25rem' }}>
                                        {txn.type === 'cash_in' ? '📤' : '📥'}
                                    </span>
                                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>
                                        {txn.type === 'cash_in' ? 'Cash In' : 'Cash Out'}
                                    </p>
                                    <span style={{
                                        padding: '2px 8px',
                                        backgroundColor: '#d1fae5',
                                        color: '#065f46',
                                        borderRadius: '12px',
                                        fontSize: '0.7rem',
                                        fontWeight: '600'
                                    }}>
                                        {txn.status}
                                    </span>
                                </div>
                                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#6b7280' }}>
                                    {txn.date} · Ref: {txn.ref}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{
                                    margin: 0,
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    color: txn.type === 'cash_in' ? '#dc2626' : '#15803d'
                                }}>
                                    {txn.type === 'cash_in' ? '-' : '+'}{txn.points} pts
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#6b7280' }}>
                                    ₱{txn.amount}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div style={{
                marginTop: '20px',
                padding: '16px',
                backgroundColor: '#fef3c7',
                borderRadius: '8px',
                border: '1px solid #fde68a'
            }}>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#92400e' }}>
                    ⚠️ <strong>Demo Mode:</strong> This is a demonstration feature. No real money transactions are processed. In production, this would integrate with actual GCash API.
                </p>
            </div>
        </section>
    );
};

export default GCashPanel;
