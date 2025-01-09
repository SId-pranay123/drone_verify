import { DronePattern } from '../../models/DronePattern.js';
import { CONFIG } from '../../config/config.js';

export class Tier2Verification {
    async verify(droneData) {
        try {
            await this.updatePattern(droneData);
            const isValid = await this.validatePattern(droneData);
            return { verified: isValid };
        } catch (error) {
            console.error('Tier 2 verification failed:', error);
            return { verified: false, error: error.message };
        }
    }

    async updatePattern(droneData) {
        const update = {
            $push: {
                locationHistory: {
                    $each: [{
                        coordinates: [droneData.deviceLocationLng, droneData.deviceLocationLat],
                        timestamp: new Date()
                    }],
                    $slice: -CONFIG.MAX_LOCATION_HISTORY
                }
            },
            $set: {
                lastUpdate: new Date()
            }
        };

        await DronePattern.findOneAndUpdate(
            { droneId: droneData.id },
            update,
            { upsert: true }
        );
    }

    async validatePattern(droneData) {
        const pattern = await DronePattern.findOne({ droneId: droneData.id });
        if (!pattern || pattern.locationHistory.length < 2) {
            return true; // Not enough history to validate
        }

        const isLocationValid = await this.validateLocation(
            droneData,
            pattern.locationHistory
        );

        return isLocationValid;
    }

    async validateLocation(droneData, locationHistory) {
        const lastLocation = locationHistory[locationHistory.length - 1];
        const distance = this.calculateDistance(
            droneData.deviceLocationLat,
            droneData.deviceLocationLng,
            lastLocation.coordinates[1],
            lastLocation.coordinates[0]
        );

        return distance <= CONFIG.MAX_DISTANCE_KM;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
}
