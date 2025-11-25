import React from 'react';
import { styles } from './collectorStyles';

const IconSelectorModal = ({ isOpen, currentIcon, profileIcons, onSelect, onClose }) => {
    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.modalTitle}>Choose Profile Icon</h3>
                <div style={styles.iconGrid}>
                    {Object.entries(profileIcons).map(([key, iconUrl]) => (
                        <div
                            key={key}
                            style={{
                                ...styles.iconOption,
                                ...(currentIcon === key ? styles.iconOptionSelected : {}),
                            }}
                            onClick={() => onSelect(key)}
                        >
                            <img src={iconUrl} alt={key} style={styles.iconPreview} />
                            <span style={styles.iconLabel}>{key}</span>
                        </div>
                    ))}
                </div>
                <button style={styles.closeButton} onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default IconSelectorModal;
