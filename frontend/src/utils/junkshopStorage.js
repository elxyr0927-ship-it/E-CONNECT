/**
 * Junkshop storage utility functions
 * Manages junkshop data in localStorage with fallback to brgy.json
 */

import brgyData from '../data/brgy.json';

const STORAGE_KEY = 'junkshops';

/**
 * Get all junkshops from storage
 * @returns {Array} Array of junkshop objects
 */
export const getAllJunkshops = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const junkshops = JSON.parse(stored);
            return Array.isArray(junkshops) ? junkshops : [];
        }
    } catch (error) {
        console.error('Error reading junkshops from localStorage:', error);
    }

    // Fallback to brgy.json initial data
    if (brgyData && brgyData.junkshops) {
        // Initialize localStorage with brgy.json data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(brgyData.junkshops));
        return brgyData.junkshops;
    }

    return [];
};

/**
 * Add a new junkshop
 * @param {Object} junkshopData - Junkshop data without id
 * @returns {Object} The created junkshop with id
 */
export const addJunkshop = (junkshopData) => {
    const junkshops = getAllJunkshops();
    const newJunkshop = {
        ...junkshopData,
        id: `js_${Date.now()}`,
        type: 'junkshop',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    junkshops.push(newJunkshop);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(junkshops));

    return newJunkshop;
};

/**
 * Update an existing junkshop
 * @param {string} id - Junkshop ID
 * @param {Object} updates - Fields to update
 * @returns {Object|null} Updated junkshop or null if not found
 */
export const updateJunkshop = (id, updates) => {
    const junkshops = getAllJunkshops();
    const index = junkshops.findIndex(j => j.id === id);

    if (index !== -1) {
        junkshops[index] = {
            ...junkshops[index],
            ...updates,
            id: junkshops[index].id, // Preserve original id
            type: 'junkshop', // Preserve type
            createdAt: junkshops[index].createdAt, // Preserve creation date
            updatedAt: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(junkshops));
        return junkshops[index];
    }

    return null;
};

/**
 * Delete a junkshop
 * @param {string} id - Junkshop ID
 * @returns {boolean} True if deleted, false if not found
 */
export const deleteJunkshop = (id) => {
    const junkshops = getAllJunkshops();
    const filtered = junkshops.filter(j => j.id !== id);

    if (filtered.length < junkshops.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        return true;
    }

    return false;
};

/**
 * Get a single junkshop by ID
 * @param {string} id - Junkshop ID
 * @returns {Object|null} Junkshop object or null if not found
 */
export const getJunkshopById = (id) => {
    const junkshops = getAllJunkshops();
    return junkshops.find(j => j.id === id) || null;
};

/**
 * Search junkshops by name or barangay
 * @param {string} query - Search query
 * @returns {Array} Filtered junkshops
 */
export const searchJunkshops = (query) => {
    if (!query) return getAllJunkshops();

    const junkshops = getAllJunkshops();
    const lowerQuery = query.toLowerCase();

    return junkshops.filter(j =>
        j.name.toLowerCase().includes(lowerQuery) ||
        j.barangayName.toLowerCase().includes(lowerQuery)
    );
};

/**
 * Validate junkshop data
 * @param {Object} data - Junkshop data to validate
 * @returns {Object} { valid: boolean, errors: Array }
 */
export const validateJunkshop = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length === 0) {
        errors.push('Name is required');
    }

    if (!data.barangayName || data.barangayName.trim().length === 0) {
        errors.push('Barangay is required');
    }

    if (typeof data.lat !== 'number' || data.lat < -90 || data.lat > 90) {
        errors.push('Valid latitude is required');
    }

    if (typeof data.lng !== 'number' || data.lng < -180 || data.lng > 180) {
        errors.push('Valid longitude is required');
    }

    if (!data.operatingHours || data.operatingHours.trim().length === 0) {
        errors.push('Operating hours are required');
    }

    if (!data.buyingPrices || typeof data.buyingPrices !== 'object') {
        errors.push('Buying prices are required');
    }

    if (!data.acceptedMaterials || !Array.isArray(data.acceptedMaterials) || data.acceptedMaterials.length === 0) {
        errors.push('At least one accepted material is required');
    }

    return {
        valid: errors.length === 0,
        errors
    };
};

/**
 * Initialize junkshops from brgy.json if localStorage is empty
 */
export const initializeJunkshops = () => {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing && brgyData && brgyData.junkshops) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(brgyData.junkshops));
        console.log('Initialized junkshops from brgy.json');
    }
};
