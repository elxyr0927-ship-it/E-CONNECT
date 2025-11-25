/**
 * Utility functions for junkshop operations
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Object} point1 - {lat, lng}
 * @param {Object} point2 - {lat, lng}
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (point1, point2) => {
    if (!point1 || !point2) return Infinity;

    const R = 6371; // Earth's radius in km
    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

const toRad = (degrees) => {
    return degrees * (Math.PI / 180);
};

/**
 * Calculate potential earnings from selling to junkshop
 * @param {string} wasteType - Type of waste (recyclable, biodegradable, bulk)
 * @param {Object} junkshop - Junkshop object with buying prices
 * @param {number} estimatedWeight - Estimated weight in kg (default 5kg)
 * @returns {number} Estimated earnings in pesos
 */
export const calculateJunkshopEarnings = (wasteType, junkshop, estimatedWeight = 5) => {
    if (!junkshop || !junkshop.buyingPrices) return 0;

    const prices = junkshop.buyingPrices;

    // Map waste types to material categories
    const materialMap = {
        'recyclable': 'plastic', // Default to plastic for recyclable
        'biodegradable': 'organic',
        'bulk': 'mixed'
    };

    const material = materialMap[wasteType] || 'mixed';
    const pricePerKg = prices[material] || prices.mixed || 10;

    return pricePerKg * estimatedWeight;
};

/**
 * Sort junkshops by distance from current position
 * @param {Array} junkshops - Array of junkshop objects
 * @param {Object} currentPosition - {lat, lng}
 * @returns {Array} Sorted array with distance added to each junkshop
 */
export const sortJunkshopsByDistance = (junkshops, currentPosition) => {
    if (!currentPosition || !junkshops) return [];

    return junkshops
        .map(shop => ({
            ...shop,
            distance: calculateDistance(currentPosition, { lat: shop.lat, lng: shop.lng })
        }))
        .sort((a, b) => a.distance - b.distance);
};

/**
 * Find the best junkshop based on distance and price
 * @param {Array} junkshops - Array of junkshop objects
 * @param {Object} currentPosition - {lat, lng}
 * @param {string} wasteType - Type of waste
 * @returns {Object} Best junkshop with score
 */
export const findBestJunkshop = (junkshops, currentPosition, wasteType) => {
    if (!junkshops || junkshops.length === 0) return null;

    const scored = junkshops.map(shop => {
        const distance = calculateDistance(currentPosition, { lat: shop.lat, lng: shop.lng });
        const earnings = calculateJunkshopEarnings(wasteType, shop);

        // Score: higher earnings, lower distance is better
        // Normalize: earnings/100 - distance (so ₱100 = 1km worth of travel)
        const score = (earnings / 100) - distance;

        return {
            ...shop,
            distance,
            estimatedEarnings: earnings,
            score
        };
    });

    return scored.sort((a, b) => b.score - a.score)[0];
};

/**
 * Format distance for display
 * @param {number} distance - Distance in km
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
    if (distance < 1) {
        return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
};

/**
 * Check if junkshop is currently open
 * @param {string} operatingHours - e.g., "8:00 AM - 5:00 PM"
 * @returns {boolean} True if open
 */
export const isJunkshopOpen = (operatingHours) => {
    if (!operatingHours) return true; // Assume open if no hours specified

    try {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // Parse operating hours (simplified - assumes format "8:00 AM - 5:00 PM")
        const [openTime, closeTime] = operatingHours.split('-').map(t => t.trim());

        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);

            if (period === 'PM' && hours !== 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;

            return hours * 60 + minutes;
        };

        const currentMinutes = currentHour * 60 + currentMinute;
        const openMinutes = parseTime(openTime);
        const closeMinutes = parseTime(closeTime);

        return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
    } catch (error) {
        return true; // Default to open if parsing fails
    }
};
