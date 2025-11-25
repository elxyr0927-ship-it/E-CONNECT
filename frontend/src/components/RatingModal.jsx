import React, { useState } from 'react';
import { FiStar, FiCamera, FiX } from 'react-icons/fi';

const RatingModal = ({ isOpen, onClose, onSubmit, collectorName }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hasPhoto, setHasPhoto] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment, hasPhoto });
        // Reset
        setRating(0);
        setComment('');
        setHasPhoto(false);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <button style={styles.closeButton} onClick={onClose}><FiX /></button>

                <h3 style={styles.title}>Rate your pickup</h3>
                <p style={styles.subtitle}>How was the service from <strong>{collectorName}</strong>?</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.starContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                style={{
                                    ...styles.starButton,
                                    color: star <= rating ? '#fbbf24' : '#e2e8f0'
                                }}
                                onClick={() => setRating(star)}
                            >
                                <FiStar fill={star <= rating ? '#fbbf24' : 'none'} />
                            </button>
                        ))}
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Add a comment (optional)</label>
                        <textarea
                            style={styles.textarea}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Was the collector polite? Was the pickup on time?"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Evidence (optional)</label>
                        <button
                            type="button"
                            style={{
                                ...styles.photoButton,
                                borderColor: hasPhoto ? '#22c55e' : '#cbd5e1',
                                color: hasPhoto ? '#16a34a' : '#64748b',
                                backgroundColor: hasPhoto ? '#f0fdf4' : '#fff'
                            }}
                            onClick={() => setHasPhoto(!hasPhoto)}
                        >
                            <FiCamera style={{ marginRight: 8 }} />
                            {hasPhoto ? 'Photo attached' : 'Upload photo proof'}
                        </button>
                        {hasPhoto && <p style={styles.photoHint}>Photo evidence helps us verify your review.</p>}
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...styles.submitButton,
                            opacity: rating === 0 ? 0.5 : 1,
                            cursor: rating === 0 ? 'not-allowed' : 'pointer'
                        }}
                        disabled={rating === 0}
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    closeButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#94a3b8'
    },
    title: {
        margin: '0 0 8px',
        color: '#0f172a',
        fontSize: '1.5rem',
        textAlign: 'center'
    },
    subtitle: {
        margin: '0 0 24px',
        color: '#64748b',
        textAlign: 'center',
        fontSize: '0.95rem'
    },
    starContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '24px'
    },
    starButton: {
        background: 'none',
        border: 'none',
        fontSize: '32px',
        cursor: 'pointer',
        padding: '4px',
        transition: 'transform 0.1s'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '0.9rem',
        fontWeight: 500,
        color: '#334155'
    },
    textarea: {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        minHeight: '80px',
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box'
    },
    photoButton: {
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '2px dashed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontWeight: 500,
        transition: 'all 0.2s'
    },
    photoHint: {
        fontSize: '0.8rem',
        color: '#16a34a',
        marginTop: '6px',
        textAlign: 'center'
    },
    submitButton: {
        width: '100%',
        padding: '14px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#0f172a',
        color: '#fff',
        fontWeight: 600,
        fontSize: '1rem',
        marginTop: '8px'
    }
};

export default RatingModal;
