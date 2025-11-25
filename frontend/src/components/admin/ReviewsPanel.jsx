import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { styles } from './adminStyles';

const ReviewsPanel = ({ ratings }) => {
    const [filter, setFilter] = useState('all');

    const filteredRatings = ratings.filter(r => {
        if (filter === 'flagged') return r.flagged;
        if (filter === '5star') return r.rating === 5;
        return true;
    });

    return (
        <div style={styles.reviewsPanel}>
            <div style={styles.filterBar}>
                <button
                    style={filter === 'all' ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => setFilter('all')}
                >
                    All Reviews
                </button>
                <button
                    style={filter === 'flagged' ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => setFilter('flagged')}
                >
                    Flagged <span style={styles.badge}>{ratings.filter(r => r.flagged).length}</span>
                </button>
                <button
                    style={filter === '5star' ? styles.filterBtnActive : styles.filterBtn}
                    onClick={() => setFilter('5star')}
                >
                    5-Star Only
                </button>
            </div>

            <div style={styles.reviewsList}>
                {filteredRatings.length === 0 && <p style={styles.emptyText}>No reviews found.</p>}
                {filteredRatings.map(rating => (
                    <div key={rating.id} style={rating.flagged ? styles.reviewCardFlagged : styles.reviewCard}>
                        <div style={styles.reviewHeader}>
                            <span style={styles.reviewerName}>{rating.userName}</span>
                            <div style={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                    <FiStar key={i} fill={i < rating.rating ? "#fbbf24" : "none"} color={i < rating.rating ? "#fbbf24" : "#cbd5e1"} />
                                ))}
                            </div>
                        </div>
                        <p style={styles.reviewComment}>{rating.comment || "No comment provided."}</p>
                        <div style={styles.reviewFooter}>
                            <span>Collector: {rating.collectorName}</span>
                            <span>{new Date(rating.timestamp).toLocaleDateString()}</span>
                        </div>
                        {rating.flagged && <div style={styles.flagLabel}>Flagged for review</div>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsPanel;
