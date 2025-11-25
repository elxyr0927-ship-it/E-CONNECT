import React from 'react';
import { styles } from './adminStyles';

const SettingsPanel = ({ barangayDumpsites, selectedBarangayId, onSelectBarangay, dumpsite }) => (
    <div style={styles.settingsPanel}>
        <h3 style={styles.sectionTitle}>Dumpsite configuration</h3>
        <p style={styles.settingsHelp}>
            Choose a fixed starting dumpsite for collection routes. Collectors will use this location when calculating routes.
        </p>
        <label style={styles.settingsLabel} htmlFor="barangay-select">
            Default dumpsite barangay
        </label>
        <select
            id="barangay-select"
            value={selectedBarangayId}
            onChange={(e) => onSelectBarangay(e.target.value)}
            style={styles.settingsSelect}
        >
            {barangayDumpsites.map((b) => (
                <option key={b.id} value={b.id}>
                    {b.name}
                </option>
            ))}
        </select>
        {dumpsite && dumpsite.barangay && (
            <p style={styles.settingsCurrent}>
                Current dumpsite: {dumpsite.barangay}
            </p>
        )}
    </div>
);

export default SettingsPanel;
